var mouseLastX, mouseLastY;
var mouseDragging = false;
var bodyXMove = 0, bodyYMove = 0;
var angleX = 0, angleY = 0;

var gl, canvas;
var mvpMatrix;
var modelMatrix;
var normalMatrix;
var nVertex;


var rotateAngle = 0;
var normalMode = true;
var quadObj;

var textures = {};
var texCount = 0;

var fbo;
var offScreenWidth = 800,
    offScreenHeight = 800;


//bird
var birdX = 0 , birdY = 2, birdZ = 0;
var isFlapping = false;
var birdYoffset = 0;
var birdYMove = -0.015;

//pillar
var pillarX = 0, pillarY = 0, pillarZ = 0;
var pipeXoffset = 0;
var pipeXoffset2 = 15;
var pipeXMove = -0.07;

var first = true;

async function main(){
    canvas = document.getElementById('webgl');
    gl = canvas.getContext('webgl2');
    if(!gl){
        console.log('Failed to get the rendering context for WebGL');
        return ;
    }

    var quad = new Float32Array([
        -1, -1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 1,
    ]); //just a quad

    programEnvCube = compileShader(
        gl,
        VSHADER_SOURCE_ENVCUBE,
        FSHADER_SOURCE_ENVCUBE
    );
    programEnvCube.a_Position = gl.getAttribLocation(
        programEnvCube,
        "a_Position"
    );
    programEnvCube.u_envCubeMap = gl.getUniformLocation(
        programEnvCube,
        "u_envCubeMap"
    );
    programEnvCube.u_viewDirectionProjectionInverse = gl.getUniformLocation(
        programEnvCube,
        "u_viewDirectionProjectionInverse"
    );

    quadObj = initVertexBufferForLaterUse(gl, quad);

    cubeMapTex = initCubeTexture(
      "./cubemap/pos-x.jpg",
      "./cubemap/neg-x.jpg",
      "./cubemap/pos-y.jpg",
      "./cubemap/neg-y.jpg",
      "./cubemap/pos-z.jpg",
      "./cubemap/neg-z.jpg",
      512,
      512
    );

    program = compileShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    gl.useProgram(program);
    program.a_Position = gl.getAttribLocation(program, 'a_Position'); 
    program.a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord'); 
    program.a_Normal = gl.getAttribLocation(program, 'a_Normal'); 
    program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix'); 
    program.u_modelMatrix = gl.getUniformLocation(program, 'u_modelMatrix'); 
    program.u_normalMatrix = gl.getUniformLocation(program, 'u_normalMatrix');
    program.u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition');
    program.u_ViewPosition = gl.getUniformLocation(program, 'u_ViewPosition');
    program.u_Ka = gl.getUniformLocation(program, 'u_Ka'); 
    program.u_Kd = gl.getUniformLocation(program, 'u_Kd');
    program.u_Ks = gl.getUniformLocation(program, 'u_Ks');
    program.u_shininess = gl.getUniformLocation(program, 'u_shininess');
    program.u_Color = gl.getUniformLocation(program, 'u_Color'); 
    program.u_textureScale = gl.getUniformLocation(program, 'u_textureScale');
    gl.uniform1f(program.u_textureScale, 1.0);

    mvpMatrix = new Matrix4();
    modelMatrix = new Matrix4();
    normalMatrix = new Matrix4();

    fbo = initFrameBuffer(gl);

    gl.enable(gl.DEPTH_TEST);

    load_all_model();
    load_all_texture();
    draw_all();
    interface();

  
    var tick = function(){
        
        if( birdYoffset < -3 ){
            console.log("end");
            birdoffset = 0;
        } else{
            birdYoffset += birdYMove; // offsets add up all the movement
        }

        
        if( pipeXoffset < -30 ){
          pipeXoffset = 0;
        } 

        if( first ){
          if( pipeXoffset2 < -30 ){
            pipeXoffset2 = 0;
            first = false;
          }
        } else {
          if( pipeXoffset2 < -30 ){
            pipeXoffset2 = 0;
          }
        }

        // pipeXoffset += pipeXMove;
        // pipeXoffset2 += pipeXMove;
        

        draw_all();
        requestAnimationFrame(tick);
    }

    tick();
}


var clawCorner = new Vector4([0.0, 0.0, 0.0, 1.0]);

var objVer = new Vector4([0.4 * -2, 0.4 * 2, 0, 1.0]);
var grab = 2; //grab: 1, not grab: -1, init: 2
var distance = 0;

async function load_one_model(file_path) {
  obj_data = [];
  response = await fetch(file_path);
  text = await response.text();
  obj = parseOBJ(text);
  for (let i = 0; i < obj.geometries.length; i++) {
      let o = initVertexBufferForLaterUse(
          gl,
          obj.geometries[i].data.position,
          obj.geometries[i].data.normal,
          obj.geometries[i].data.texcoord
      );
      obj_data.push(o);
  }
  return obj_data;
}


function draw_all(){

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, offScreenWidth, offScreenHeight);
    draw();
    drawObjectWithTexture(cube, QuadMdlMatrix, 0.0, 0.0, 0.0, "ballTex", false);
    

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    draw();
    drawObjectWithTexture(cube, QuadMdlMatrix, 0.0, 0.0, 0.0, "ballTex", true);


}


function draw(){
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  draw_cubemap();

  gl.useProgram(program);
  init_mdl();
  drawRobot();
}

var lightX = 3, lightY = 3, lightZ = 2;
var scaleScene = 0;
var cameraX = 0, cameraY = 0, cameraZ = 20;
var cameraDirX = 3, cameraDirY = 5, cameraDirZ = 15;
var room = 0;

function draw_cubemap() {
  let rotateMatrix = new Matrix4();
  // rotateMatrix.setRotate(angleY, 1, 0, 0); //for mouse rotation
  // rotateMatrix.rotate(angleX, 0, 1, 0); //for mouse rotation
  var viewDir = new Vector3([cameraDirX, cameraDirY, cameraDirZ]);
  var newViewDir = rotateMatrix.multiplyVector3(viewDir);

  var vpFromCamera = new Matrix4();
  vpFromCamera.setPerspective(60 - room, 1, 1, 15);
  var viewMatrixRotationOnly = new Matrix4();
  viewMatrixRotationOnly.lookAt(
      cameraX,
      cameraY,
      cameraZ,
      cameraX + newViewDir.elements[0],
      cameraY + newViewDir.elements[1],
      cameraZ + newViewDir.elements[2],
      0,
      1,
      0
  );
  viewMatrixRotationOnly.elements[12] = 0; //ignore translation
  viewMatrixRotationOnly.elements[13] = 0;
  viewMatrixRotationOnly.elements[14] = 0;
  vpFromCamera.multiply(viewMatrixRotationOnly);
  var vpFromCameraInverse = vpFromCamera.invert();

  //quad
  gl.useProgram(programEnvCube);
  gl.depthFunc(gl.LEQUAL);
  gl.uniformMatrix4fv(
      programEnvCube.u_viewDirectionProjectionInverse,
      false,
      vpFromCameraInverse.elements
  );
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMapTex);
  gl.uniform1i(programEnvCube.u_envCubeMap, 0);
  initAttributeVariable(gl, programEnvCube.a_Position, quadObj.vertexBuffer);
  gl.drawArrays(gl.TRIANGLES, 0, quadObj.numVertices);
}

function drawOneObject(
  obj, mdlMatrix,colorR, colorG, colorB
){
    //model Matrix (part of the mvp matrix)
    if( colorR == 1.0 && colorG == 1.0 && colorB == 0.0){
        modelMatrix.setIdentity();
    } else{
      modelMatrix.setRotate(angleY, 1, 0, 0);//for mouse rotation
      modelMatrix.rotate(angleX, 0, 1, 0);//for mouse rotation
    }
   
    modelMatrix.multiply(mdlMatrix);
    //mvp: projection * view * model matrix  
    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(cameraX , cameraY, cameraZ + scaleScene, 0, 0, 0, 0, 1, 0);
    mvpMatrix.multiply(modelMatrix);

    //normal matrix
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    gl.uniform3f(program.u_LightPosition, 3, 3, 2);
    gl.uniform3f(program.u_ViewPosition, cameraX, cameraY, cameraZ);
    gl.uniform1f(program.u_Ka, 0.2);
    gl.uniform1f(program.u_Kd, 0.7);
    gl.uniform1f(program.u_Ks, 1.0);
    gl.uniform1f(program.u_shininess, 10.0);
    gl.uniform3f(program.u_Color, colorR, colorG, colorB);


    gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);
    gl.uniformMatrix4fv(program.u_modelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(program.u_normalMatrix, false, normalMatrix.elements);

    // gl.bindTexture(gl.TEXTURE_2D, textures[texture]);
    
    
    for( let i=0; i < obj.length; i ++ ){
      initAttributeVariable(gl, program.a_Position, obj[i].vertexBuffer);
      initAttributeVariable(gl, program.a_Normal, obj[i].normalBuffer);
      gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
    }
}

function drawObjectWithTexture (
  obj, mdlMatrix,colorR, colorG, colorB, texture, fbomode
){
  //model Matrix (part of the mvp matrix)
  modelMatrix.setRotate(angleY, 1, 0, 0);//for mouse rotation
  modelMatrix.rotate(angleX, 0, 1, 0);//for mouse rotation
  modelMatrix.multiply(mdlMatrix);
  //mvp: projection * view * model matrix  
  mvpMatrix.setPerspective(30, 1, 1, 100);
  mvpMatrix.lookAt(cameraX , cameraY, cameraZ + scaleScene, 0, 0, 0, 0, 1, 0);
  mvpMatrix.multiply(modelMatrix);

  //normal matrix
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniform3f(program.u_LightPosition, 3, 3, 2);
  gl.uniform3f(program.u_ViewPosition, cameraX, cameraY, cameraZ);
  gl.uniform1f(program.u_Ka, 0.2);
  gl.uniform1f(program.u_Kd, 0.7);
  gl.uniform1f(program.u_Ks, 1.0);
  gl.uniform1f(program.u_shininess, 10.0);
  gl.uniform3f(program.u_Color, colorR, colorG, colorB);


  gl.activeTexture(gl.TEXTURE0);
  if (fbomode) {
    gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
  } else {
      // console.log("textture!!")
      gl.bindTexture(gl.TEXTURE_2D, textures[texture]);
  }
  gl.uniform1i(program.u_Sampler, 0);

  gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);
  gl.uniformMatrix4fv(program.u_modelMatrix, false, modelMatrix.elements);
  gl.uniformMatrix4fv(program.u_normalMatrix, false, normalMatrix.elements);
  
  for( let i=0; i < obj.length; i ++ ){
    initAttributeVariable(gl, program.a_Position, obj[i].vertexBuffer);
    initAttributeVariable(gl, program.a_TexCoord, obj[i].texCoordBuffer);
    initAttributeVariable(gl, program.a_Normal, obj[i].normalBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
  }

}


async function load_all_texture() {
  //soccer ball
  var imageBall = new Image();
  imageBall.onload = function(){initTexture(gl, imageBall, "ballTex");};
  // imageBall.src = "./texture/soccer.png";
  imageBall.src = "./texture/ball.webp";


  //gold ball
  var imageGold = new Image();
  imageGold.onload = function(){initTexture(gl, imageGold, "goldTex");};
  imageGold.src = "./texture/goldball.jpeg";

  //ground
  var imageGnd= new Image();
  imageGnd.onload = function(){initTexture(gl, imageGnd, "groundTex");};
  imageGnd.src = "./texture/ground.jpeg";

  //tire
  var imageTire= new Image();
  imageTire.onload = function(){initTexture(gl, imageTire, "tireTex");};
  imageTire.src = "./texture/tire.jpg";

  //pipe
  var imagePipe= new Image();
  imagePipe.onload = function(){initTexture(gl, imagePipe, "pipeTex");};
  imagePipe.src = "./texture/pipe.jpeg";
}
