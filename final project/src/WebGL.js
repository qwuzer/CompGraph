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
var shadowfbo;
var offScreenWidth = 800,
    offScreenHeight = 800;


//bird
var birdX = 0 , birdY = 0, birdZ = 0;
var isFlapping = false;
var birdYoffset = 0;
var birdYMove = -0.02;

//pillar
var pillarX = 0, pillarY = 0, pillarZ = 0;
var pipeXoffset = 0;
var pipeXoffset2 = 20;
var pipeXMove = -0.05;

var points = 0;
var end = false;
var first = true;

var gameStart = false;

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

    // cubeMapTex = initCubeTexture(
    //   "./cubemap/pos-x.jpg",
    //   "./cubemap/neg-x.jpg",
    //   "./cubemap/pos-y.jpg",
    //   "./cubemap/neg-y.jpg",
    //   "./cubemap/pos-z.jpg",
    //   "./cubemap/neg-z.jpg",
    //   512,
    //   512
    // );

    cubeMapTex = initCubeTexture(
      "./cubemap/right.png",
      "./cubemap/left.png",
      
      "./cubemap/top.png",
      "./cubemap/bottom.png",
      
      "./cubemap/front.png",
      "./cubemap/back.png",
      256,
      256
    );
    
    programTextureOnCube = compileShader(gl, VSHADER_SOURCE_TEXTURE_ON_CUBE, FSHADER_SOURCE_TEXTURE_ON_CUBE);
    programTextureOnCube.a_Position = gl.getAttribLocation(programTextureOnCube, 'a_Position'); 
    programTextureOnCube.a_Normal = gl.getAttribLocation(programTextureOnCube, 'a_Normal'); 
    programTextureOnCube.u_MvpMatrix = gl.getUniformLocation(programTextureOnCube, 'u_MvpMatrix'); 
    programTextureOnCube.u_modelMatrix = gl.getUniformLocation(programTextureOnCube, 'u_modelMatrix'); 
    programTextureOnCube.u_normalMatrix = gl.getUniformLocation(programTextureOnCube, 'u_normalMatrix');
    programTextureOnCube.u_ViewPosition = gl.getUniformLocation(programTextureOnCube, 'u_ViewPosition');
    programTextureOnCube.u_envCubeMap = gl.getUniformLocation(programTextureOnCube, 'u_envCubeMap'); 
    programTextureOnCube.u_Color = gl.getUniformLocation(programTextureOnCube, 'u_Color'); 

    shadowProgram = compileShader(gl, VSHADER_SHADOW_SOURCE, FSHADER_SHADOW_SOURCE);
    shadowProgram.a_Position = gl.getAttribLocation(shadowProgram, 'a_Position');
    shadowProgram.u_MvpMatrix = gl.getUniformLocation(shadowProgram, 'u_MvpMatrix');


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
    program.u_MvpMatrixOfLight = gl.getUniformLocation(program, 'u_MvpMatrixOfLight');
    program.u_Ka = gl.getUniformLocation(program, 'u_Ka'); 
    program.u_Kd = gl.getUniformLocation(program, 'u_Kd');
    program.u_Ks = gl.getUniformLocation(program, 'u_Ks');
    program.u_shininess = gl.getUniformLocation(program, 'u_shininess');
    program.u_ShadowMap = gl.getUniformLocation(program, "u_ShadowMap");
    program.u_Color = gl.getUniformLocation(program, 'u_Color'); 
    program.u_textureScale = gl.getUniformLocation(program, 'u_textureScale');
    gl.uniform1f(program.u_textureScale, 1.0);

    mvpMatrix = new Matrix4();
    modelMatrix = new Matrix4();
    normalMatrix = new Matrix4();

    // fbo = initFrameBuffer(gl);
    reflectfbo = initFrameBufferForCubemapRendering();
    shadowfbo = initFrameBuffer(gl);

    gl.enable(gl.DEPTH_TEST);

    load_all_model();
    load_all_texture();
    draw_all();
    interface();

    
    var gameTime = 60;

    var timerElement = document.getElementById('time'); 
    var pointElement = document.getElementById('point');

    var timer = setInterval(() => {
        if (gameStart && gameTime > 0 && !end) {
            gameTime--;
            timerElement.textContent = gameTime;
        } else {
            clearInterval(timer);
        }
    }, 1000);

    //start button
    document.getElementById("startButton").addEventListener("click", startGame);

    function startGame(){
      document.getElementById("startButton").style.display = "none";
      gameStart = true;
      console.log( gameStart)
    }


    setInterval(() => {
      tick;
    }, 1);  

    
    var amplitude = 0.5; // Maximum distance from the center position
    var frequency = 1; // Oscillations per second
    var startTime = null;

    var tick = function(timestamp){  
      if(end) return;

      if (!startTime) startTime = timestamp;
      var elapsedTime = (timestamp - startTime) / 1000; // Time in seconds

      if (!gameStart) {
          // Oscillate birdYoffset using a sine function
          firstcameraY = amplitude * Math.sin(2 * Math.PI * frequency * elapsedTime);
          birdYoffset = amplitude * Math.sin(2 * Math.PI * frequency * elapsedTime);
      }

      
      if( !gameStart ) {
        gameTime == 60;
      }

      pointElement.textContent = points;

      console.log(gameStart);

      if( birdYoffset < -3 ){
          console.log("end");
          birdoffset = 0;
          end = true;
      } else{
          firstcameraY += birdYMove;
          birdYoffset += birdYMove; // offsets add up all the movement
      }

      
      if( pipeXoffset < -40 ){
        pipeXoffset = 0;
      } 

      if( first ){
        if( pipeXoffset2 < -40 ){
          pipeXoffset2 = 0;
          first = false;
        }
      } else {
        if( pipeXoffset2 < -40 ){
          pipeXoffset2 = 0;
        }
      }

      if( gameStart ){
        pipeXoffset += pipeXMove;
        pipeXoffset2 += pipeXMove;
      }

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


var lightX = 0, lightY = 10, lightZ = 20;
var scaleScene = 0;
var cameraDirX = 10, cameraDirY = 0, cameraDirZ = 0;
var cameraDirX3 = 0, cameraDirY3 = 0.2, cameraDirZ3 = -10;
var room = 0;
var view_size = 60;

var thirdcameraX = 1,
    thirdcameraY = 0.2,
    thirdcameraZ = 8;
var firstcameraX = 0,
    firstcameraY = 0,
    firstcameraZ = 0;

var third_view = 1;

function draw_all(){
    if( third_view == 1 ){
      var viewDir = new Vector3([cameraDirX3, cameraDirY3, cameraDirZ3]);
    } else {
      var viewDir = new Vector3([cameraDirX, cameraDirY, cameraDirZ]);
    }

    var rotateMatrix = new Matrix4();
    rotateMatrix.setRotate(angleX, 0, 1, 0); //for mouse rotation
    rotateMatrix.rotate(angleY, 1, 0, 0); //for mouse rotation
    var newViewDir = rotateMatrix.multiplyVector3(viewDir);

    var vMatrix = new Matrix4();
    var pMatrix = new Matrix4();
    pMatrix.setPerspective(view_size, 1, 1, 1000);

    if(third_view){
      vMatrix.lookAt(
        thirdcameraX,
        thirdcameraY,
        thirdcameraZ,
        thirdcameraX + newViewDir.elements[0],
        thirdcameraY + newViewDir.elements[1],
        thirdcameraZ + newViewDir.elements[2],
        0,
        1,
        0
      );
    } else{
      vMatrix.lookAt(
        firstcameraX,
        firstcameraY,
        firstcameraZ,
        firstcameraX + newViewDir.elements[0],
        firstcameraY + newViewDir.elements[1],
        firstcameraZ + newViewDir.elements[2],
        0,
        1,
        0
      );
    }

    var vpMatrix = new Matrix4();
    vpMatrix.set(pMatrix);
    vpMatrix.multiply(vMatrix);

    init_mdl();
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowfbo);
    gl.viewport(0, 0, offScreenWidth, offScreenHeight);
    draw_shadow();

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.width);
    draw_world(vMatrix, pMatrix, vpMatrix);

    draw_all_reflection_object(vpMatrix);

}

function draw_shadow() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  drawAllShadows();
}

function draw_world(vMatrix, pMatrix, vpMatrix) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  draw_cubemap( vMatrix, pMatrix) ;

  drawRobot( vpMatrix);
}


// function draw( vMatrix, pMatrix , vpMatrix ){
//   //cube map
//   gl.viewport(0, 0, canvas.width, canvas.height);
//   gl.clearColor(0, 0, 0, 1);
//   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//   gl.enable(gl.DEPTH_TEST);
//   draw_cubemap( vMatrix, pMatrix);

//   //on screen
//   gl.useProgram(program);
//   gl.bindFramebuffer(gl.FRAMEBUFFER, null);    
  
//   init_mdl();
//   drawRobot( vpMatrix );
// }

function draw_cubemap( vMatrix, pMatrix ) {
  var vpFromCamera = new Matrix4();
  vpFromCamera.set(pMatrix);
  vMatrix.elements[12] = 0; //ignore translation
  vMatrix.elements[13] = 0;
  vMatrix.elements[14] = 0;
  vpFromCamera.multiply(vMatrix);
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

function draw_all_reflection_object(vpMatrix) {
  var cur_cameraX = new Matrix4();
  var cur_cameraY = new Matrix4();
  var cur_cameraZ = new Matrix4();
  if (third_view) {
      cur_cameraX = thirdcameraX;
      cur_cameraY = thirdcameraY;
      cur_cameraZ = thirdcameraZ;
  } else {
      cur_cameraX = firstcameraX;
      cur_cameraY = firstcameraY;
      cur_cameraZ = firstcameraZ;
  }
  drawDynamicReflectionObject(
      pipe,
      pipeMatrix,
      vpMatrix,
      cur_cameraX,
      cur_cameraY,
      cur_cameraZ,
      width + pipeXoffset, -5 - gapYarr[1], 1.1 
  );

    drawDynamicReflectionObject(
      pipe,
      pipeMatrix8,
      vpMatrix,
      cur_cameraX,
      cur_cameraY,
      cur_cameraZ,
      -width -1.8 - pipeXoffset - pipeGapX * 3, -5 + gapYarr[4], 1.1
  );
  
}

function drawOneObject( obj, mdlMatrix, vpMatrix, colorR, colorG, colorB , cameraX, cameraY, cameraZ){
    gl.useProgram(program);
    var mvpMatrix = new Matrix4();
    var modelMatrix = new Matrix4();
    var normalMatrix = new Matrix4();
    mvpMatrix.setIdentity();
    mvpMatrix.multiply(vpMatrix);
    mvpMatrix.multiply(mdlMatrix);

    modelMatrix.setIdentity();
    modelMatrix.multiply(mdlMatrix);

    //normal matrix
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    gl.uniform3f(program.u_LightPosition, lightX, lightY, lightZ);
    gl.uniform3f(program.u_ViewPosition, cameraX, cameraY, cameraZ);
    gl.uniform1f(program.u_Ka, 0.6);
    gl.uniform1f(program.u_Kd, 0.8);
    gl.uniform1f(program.u_Ks, 1.0);
    gl.uniform1f(program.u_shininess, 10.0);
    gl.uniform3f(program.u_Color, colorR, colorG, colorB);


    gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);
    gl.uniformMatrix4fv(program.u_modelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(program.u_normalMatrix, false, normalMatrix.elements);

    for( let i=0; i < obj.length; i ++ ){
      initAttributeVariable(gl, program.a_Position, obj[i].vertexBuffer);
      initAttributeVariable(gl, program.a_Normal, obj[i].normalBuffer);
      gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
    }
}

function drawObjectWithTexture (
  obj, mdlMatrix, vpMatrix, mvpFromLight, cameraX, cameraY, cameraZ, texture
){
  gl.useProgram(program);
  var mvpMatrix = new Matrix4();
  var modelMatrix = new Matrix4();
  var normalMatrix = new Matrix4();

  // mvpMatrix.set(vpMatrix);
  mvpMatrix.setIdentity();
  mvpMatrix.multiply(vpMatrix);
  mvpMatrix.multiply(mdlMatrix);

  modelMatrix.setIdentity();
  modelMatrix.multiply(mdlMatrix);

  //normal matrix
  normalMatrix.setInverseOf(mdlMatrix);
  normalMatrix.transpose();

  gl.uniform3f(program.u_LightPosition, lightX, lightY, lightZ);
  gl.uniform3f(program.u_ViewPosition, cameraX, cameraY, cameraZ);
  gl.uniform1f(program.u_Ka, 0.4);
  gl.uniform1f(program.u_Kd, 0.7);
  gl.uniform1f(program.u_Ks, 1.0);
  gl.uniform1f(program.u_shininess, 10.0);
  // gl.uniform3f(program.u_Color, colorR, colorG, colorB);
  if( texture == "booTex" ){
    gl.uniform3f(program.u_Color, 0,0,0);
  } else {
  gl.uniform3f(program.u_Color, 0.0, 0.0, 0.0);
  }
  gl.uniformMatrix4fv(
    program.u_MvpMatrixOfLight,
    false,
    mvpFromLight.elements
  );


  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures[texture]);
  gl.uniform1i(program.u_Sampler, 0);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, shadowfbo.texture);
  gl.uniform1i(program.u_ShadowMap, 1);

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

function drawOneObjectOnShadowfbo(obj, mdlMatrix) {
  var mvpFromLight = new Matrix4();
  //model Matrix (part of the mvp matrix)
  //mvp: projection * view * model matrix
  mvpFromLight.setPerspective(160, offScreenWidth / offScreenHeight, 1, 1000);
  mvpFromLight.lookAt(lightX, lightY, lightZ, 5, 0, 0, 0, 1, 0);
  mvpFromLight.multiply(mdlMatrix);

  gl.useProgram(shadowProgram);
  gl.uniformMatrix4fv(
      shadowProgram.u_MvpMatrix,
      false,
      mvpFromLight.elements
  );

  for (let i = 0; i < obj.length; i++) {
      initAttributeVariable(
          gl,
          shadowProgram.a_Position,
          obj[i].vertexBuffer
      );
      gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
  }

  return mvpFromLight;
}

function drawDynamicReflectionObject(
  obj, modelMatrix, vpMatrix, cameraX, cameraY, cameraZ, posX, posY, posZ
) {
  drawReflectFbo(posX, posY, posZ);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.useProgram(programTextureOnCube);
  let mvpMatrix = new Matrix4();
  let normalMatrix = new Matrix4();
  mvpMatrix.set(vpMatrix);
  mvpMatrix.multiply(modelMatrix);

  //normal matrix
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniform3f(programTextureOnCube.u_ViewPosition, cameraX, cameraY, cameraZ );
  gl.uniform3f(programTextureOnCube.u_Color, 0.1, 0.1, 0.1);
  gl.uniformMatrix4fv( programTextureOnCube.u_MvpMatrix, false, mvpMatrix.elements);
  gl.uniformMatrix4fv( programTextureOnCube.u_modelMatrix, false, modelMatrix.elements);
  gl.uniformMatrix4fv( programTextureOnCube.u_normalMatrix, false, normalMatrix.elements );

  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, reflectfbo.texture);
  gl.uniform1i(programTextureOnCube.u_envCubeMap, 2);

  for (let i = 0; i < obj.length; i++) {
      initAttributeVariable(
          gl,
          programTextureOnCube.a_Position,
          obj[i].vertexBuffer
      );
      initAttributeVariable(
          gl,
          programTextureOnCube.a_Normal,
          obj[i].normalBuffer
      );
      gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
  }
}

function drawReflectFbo(posX, posY, posZ) {
  //camera 6 direction to render 6 cubemap faces
  var ENV_CUBE_LOOK_DIR = [
      [1.0, 0.0, 0.0],
      [-1.0, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, -1.0, 0.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, -1.0],
  ];

  //camera 6 look up vector to render 6 cubemap faces
  var ENV_CUBE_LOOK_UP = [
      [0.0, -1.0, 0.0],
      [0.0, -1.0, 0.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, -1.0],
      [0.0, -1.0, 0.0],
      [0.0, -1.0, 0.0],
  ];

  gl.activeTexture(gl.TEXTURE2);
  gl.bindFramebuffer(gl.FRAMEBUFFER, reflectfbo);
  // gl.viewport(0, 0, 300, 300);
  gl.viewport(0, 0, offScreenWidth, offScreenHeight);
  gl.clearColor(1.0, 0.0, 0.0, 1);
  for (var side = 0; side < 6; side++) {
      gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_CUBE_MAP_POSITIVE_X + side,
          reflectfbo.texture,
          0
      );
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      let vMatrix = new Matrix4();
      let pMatrix = new Matrix4();
      pMatrix.setPerspective(90, 1, 1, 100);
      vMatrix.lookAt(
          posX,
          posY,
          posZ,
          posX + ENV_CUBE_LOOK_DIR[side][0],
          posY + ENV_CUBE_LOOK_DIR[side][1],
          posZ + ENV_CUBE_LOOK_DIR[side][2],
          ENV_CUBE_LOOK_UP[side][0],
          ENV_CUBE_LOOK_UP[side][1],
          ENV_CUBE_LOOK_UP[side][2]
      );
      let vpMatrix = new Matrix4();
      vpMatrix.set(pMatrix);
      vpMatrix.multiply(vMatrix);

      draw_world(vMatrix, pMatrix, vpMatrix);
      draw_cubemap( vMatrix, pMatrix) ;
      gl.viewport(0, 0, canvas.width, canvas.height);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

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

  //boo
  var imageBoo= new Image();
  imageBoo.onload = function(){initTexture(gl, imageBoo, "booTex");};
  imageBoo.src = "./texture/boo.png";
}
