var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Normal;
    attribute vec2 a_TexCoord;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_normalMatrix;
    varying vec3 v_Normal;
    varying vec3 v_PositionInWorld;
    varying vec2 v_TexCoord;
    void main(){
      gl_Position = u_MvpMatrix * a_Position;
      v_PositionInWorld = (u_modelMatrix * a_Position).xyz; 
      v_Normal = normalize(vec3(u_normalMatrix * a_Normal));
      v_TexCoord = a_TexCoord;
    }    
`;
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec3 u_LightPosition;
    uniform vec3 u_ViewPosition;
    uniform float u_Ka;
    uniform float u_Kd;
    uniform float u_Ks;
    uniform float u_shininess;
    uniform sampler2D u_Sampler;
    uniform vec3 u_Color;
    varying vec3 v_Normal;
    varying vec3 v_PositionInWorld;
    varying vec2 v_TexCoord;
    void main(){
        vec3 texColor = texture2D( u_Sampler, v_TexCoord ).rgb;

        if( u_Color != vec3(0.0, 0.0, 0.0) ){
          texColor = u_Color;
        }
        // if(texColor == vec3(0.0, 0.0, 0.0)) {
        //   texColor = u_Color;
        // }

        // vec3 ambientLightColor = u_Color;
        // vec3 diffuseLightColor = u_Color;
        vec3 ambientLightColor = texColor;
        vec3 diffuseLightColor = texColor;
        vec3 specularLightColor = vec3(1.0, 1.0, 1.0);        

        vec3 ambient = ambientLightColor * u_Ka;

        vec3 normal = normalize(v_Normal);
        vec3 lightDirection = normalize(u_LightPosition - v_PositionInWorld);
        float nDotL = max(dot(lightDirection, normal), 0.0);
        vec3 diffuse = diffuseLightColor * u_Kd * nDotL;

        vec3 specular = vec3(0.0, 0.0, 0.0);
        if(nDotL > 0.0) {
            vec3 R = reflect(-lightDirection, normal);
            // V: the vector, point to viewer       
            vec3 V = normalize(u_ViewPosition - v_PositionInWorld); 
            float specAngle = clamp(dot(R, V), 0.0, 1.0);
            specular = u_Ks * pow(specAngle, u_shininess) * specularLightColor; 
        }

        gl_FragColor = vec4( ambient + diffuse + specular, 1.0 );
    }
`;

var VSHADER_SOURCE_ENVCUBE = `
  attribute vec4 a_Position;
  varying vec4 v_Position;
  void main() {
    v_Position = a_Position;
    gl_Position = a_Position;
  } 
`;

var FSHADER_SOURCE_ENVCUBE = `
  precision mediump float;
  uniform samplerCube u_envCubeMap;
  uniform mat4 u_viewDirectionProjectionInverse;
  varying vec4 v_Position;
  void main() {
    vec4 t = u_viewDirectionProjectionInverse * v_Position;
    gl_FragColor = textureCube(u_envCubeMap, normalize(t.xyz / t.w));
  }
`;

function compileShader(gl, vShaderText, fShaderText){
    //////Build vertex and fragment shader objects
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    //The way to  set up shader text source
    gl.shaderSource(vertexShader, vShaderText)
    gl.shaderSource(fragmentShader, fShaderText)
    //compile vertex shader
    gl.compileShader(vertexShader)
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.log('vertex shader ereror');
        var message = gl.getShaderInfoLog(vertexShader); 
        console.log(message);//print shader compiling error message
    }
    //compile fragment shader
    gl.compileShader(fragmentShader)
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.log('fragment shader ereror');
        var message = gl.getShaderInfoLog(fragmentShader);
        console.log(message);//print shader compiling error message
    }

    /////link shader to program (by a self-define function)
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    //if not success, log the program info, and delete it.
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        alert(gl.getProgramInfoLog(program) + "");
        gl.deleteProgram(program);
    }

    return program;
}


//#region BEGIN:////////The folloing three function is for creating vertex buffer, but link to shader to user later/////////
function initAttributeVariable(gl, a_attribute, buffer){
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

function initArrayBufferForLaterUse(gl, data, num, type) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Store the necessary information to assign the object to the attribute variable later
  buffer.num = num;
  buffer.type = type;

  return buffer;
}

function initVertexBufferForLaterUse(gl, vertices, normals, texCoords){
  var nVertices = vertices.length / 3;

  var o = new Object();
  o.vertexBuffer = initArrayBufferForLaterUse(gl, new Float32Array(vertices), 3, gl.FLOAT);
  if( normals != null ) o.normalBuffer = initArrayBufferForLaterUse(gl, new Float32Array(normals), 3, gl.FLOAT);
  if( texCoords != null ) o.texCoordBuffer = initArrayBufferForLaterUse(gl, new Float32Array(texCoords), 2, gl.FLOAT);
  //you can have error check here
  o.numVertices = nVertices;

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}
//#endregion ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

///// normal vector calculation (for the cube)
function getNormalOnVertices(vertices){
  var normals = [];
  var nTriangles = vertices.length/9;
  for(let i=0; i < nTriangles; i ++ ){
      var idx = i * 9 + 0 * 3;
      var p0x = vertices[idx+0], p0y = vertices[idx+1], p0z = vertices[idx+2];
      idx = i * 9 + 1 * 3;
      var p1x = vertices[idx+0], p1y = vertices[idx+1], p1z = vertices[idx+2];
      idx = i * 9 + 2 * 3;
      var p2x = vertices[idx+0], p2y = vertices[idx+1], p2z = vertices[idx+2];

      var ux = p1x - p0x, uy = p1y - p0y, uz = p1z - p0z;
      var vx = p2x - p0x, vy = p2y - p0y, vz = p2z - p0z;

      var nx = uy*vz - uz*vy;
      var ny = uz*vx - ux*vz;
      var nz = ux*vy - uy*vx;

      var norm = Math.sqrt(nx*nx + ny*ny + nz*nz);
      nx = nx / norm;
      ny = ny / norm;
      nz = nz / norm;

      normals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
  }
  return normals;
}


var mouseLastX, mouseLastY;
var mouseDragging = false;
var bodyXMove = 0, bodyYMove = 0;
var angleX = 0, angleY = 0;
var clawOpenAngle = 0;
var armNode1Angle = 0;
var armNode2Angle = 0;
var armNode3Angle = 0;
var objAngle1 = 0;
var objAngle2 = 0;
var rotateAngle1 = 0, rotateAngle2 = 0;

var gl, canvas;
var mvpMatrix;
var modelMatrix;
var normalMatrix;
var nVertex;

var offScreenWidth = 2048, offScreenHeight = 2048;
var fbo;
var rotateAngle = 0;
var normalMode = true;
var quadObj;



var textures = {};
var texCount = 0;

var fbo;
var offScreenWidth = 800,
    offScreenHeight = 800;


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
    // program.u_Sampler = gl.getUniformLocation(program , "u_Sampler");
    

    mvpMatrix = new Matrix4();
    modelMatrix = new Matrix4();
    normalMatrix = new Matrix4();

    fbo = initFrameBuffer(gl);

    gl.enable(gl.DEPTH_TEST);

    load_all_model();
    load_all_texture();
    draw_all();
    interface();
}


var clawCorner = new Vector4([0.0, 0.0, 0.0, 1.0]);

var objVer = new Vector4([0.4 * -2, 0.4 * 2, 0, 1.0]);
var grab = 2; //grab: 1, not grab: -1, init: 2
var distance = 0;
// function draw(){
//     //Cube (ground)
//     //TODO-1: set mdlMatrix for the cube
//     mdlMatrix.setIdentity();
//     mdlMatrix.scale(4, 0.2, 4);
//     drawOneObject(cube, mdlMatrix, 1.0, 0.4, 0.4);

//     //light
//     mdlMatrix.setIdentity();
//     mdlMatrix.translate(3, 3, 2);
//     mdlMatrix.scale(0.1, 0.1, 0.1);
//     drawOneObject(cube, mdlMatrix, 1, 1, 1);


//     //football
//     mdlMatrix.setIdentity();
//     mdlMatrix.translate(1, 1, 1);
//     mdlMatrix.scale(2, 2,2);
//     drawOneObject(football, mdlMatrix, 1, 1, 1);


//     //robot
//     mdlMatrix.setIdentity();
//     mdlMatrix.scale(0.4, 0.4, 0.4);
//     mdlMatrix.rotate(rotateAngle1, 0, 1, 0);
    
//     mdlMatrix.translate(2.0 + bodyXMove, 2, 0 - bodyYMove);
//     pushMatrix();
//     mdlMatrix.scale(1, 1, 1);
//     drawOneObject(cube, mdlMatrix, 0.0 , 0.4, 0.0);
//     popMatrix();

//     //#region ------------------------ tires ------------------------ 
//     pushMatrix();//1
//     pushMatrix();//2
//     pushMatrix();//3
//     pushMatrix();//4
//     mdlMatrix.translate(1.2, -1.5, 1);
//     pushMatrix();
//     // mdlMatrix.rotate(bodyXMove * 100, 0, 1, 0);
//     mdlMatrix.scale(0.6, 0.6, 0.6);
//     drawOneObject(tire, mdlMatrix, 0.0, 0.0, 0.0);
//     popMatrix();
//     popMatrix();//1
//     mdlMatrix.translate(1.2, -1.5, -1);
//     pushMatrix();
//     mdlMatrix.scale(0.6, 0.6, 0.6);
//     drawOneObject(tire, mdlMatrix, 0.0, 0.0, 0.0);
//     popMatrix();
//     popMatrix();//2
//     mdlMatrix.translate(-1.2, -1.5, -1);
//     pushMatrix();
//     mdlMatrix.scale(0.6, 0.6, 0.6);
//     drawOneObject(tire, mdlMatrix, 0.0, 0.0, 0.0);
//     popMatrix();
//     popMatrix();//3
//     mdlMatrix.translate(-1.2, -1.5, 1);
//     pushMatrix();
//     mdlMatrix.scale(0.6, 0.6, 0.6);
//     drawOneObject(tire, mdlMatrix, 0.0, 0.0, 0.0);
//     popMatrix();
//     popMatrix();//4
//     //#endregion ------------------------ tires ------------------------ 

//     mdlMatrix.translate(0, 1, 0);
//     mdlMatrix.translate(0, 2.5, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.2, 2.5, 0.2);
//     drawOneObject(cube, mdlMatrix, 0.4, 0.4, 0.4);
//     popMatrix();

//     mdlMatrix.translate(0, 2.5, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.23, 0.23, 0.23);
//     drawOneObject(cube, mdlMatrix, 1.0, 0.4, 0.4);
//     popMatrix();
    
//     mdlMatrix.rotate(armNode1Angle + 45, 0, 0, 1);
//     mdlMatrix.translate(0, 1, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.2, 1, 0.2);
//     drawOneObject(cube, mdlMatrix, 0.4, 0.4, 0.4);
//     popMatrix();  

//     mdlMatrix.translate(0, 1, 0);
//     mdlMatrix.rotate(armNode2Angle + 90, 0, 0, 1);
//     mdlMatrix.translate(0, 1, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.2, 1, 0.2);
//     drawOneObject(cube, mdlMatrix, 0.4, 0.4, 0.4);
//     popMatrix();

//     mdlMatrix.translate(0, 1, 0);
//     mdlMatrix.rotate(armNode3Angle + 45, 0, 0, 1);
//     mdlMatrix.translate(0, 0.5, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.2, 0.5, 0.2);
//     drawOneObject(cube, mdlMatrix, 0.4, 0.4, 0.4);
//     popMatrix();

//     var ccl = 0.5;//claw cube length
//     mdlMatrix.translate(0, 0.5, 0);
//     pushMatrix();
//     mdlMatrix.scale(ccl, ccl, ccl);
//     drawOneObject(cube, mdlMatrix, 1.0, 1.0, 1.0);
//     popMatrix();


//     //#region ------------------------ claws ------------------------ 
//     //right claw
//     pushMatrix();
//     pushMatrix();
//     pushMatrix();
//     mdlMatrix.translate(0, -ccl, 0);
//     mdlMatrix.rotate(45 + clawOpenAngle, 0, 0, 1);
//     mdlMatrix.translate(0, 1, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.2, 1, 0.2);
//     drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
//     popMatrix();
//     mdlMatrix.translate(0, 1, 0);
//     mdlMatrix.rotate(135 + clawOpenAngle, 0, 0, 1);
//     mdlMatrix.translate(0, -0.5, 0);
//     mdlMatrix.scale(0.2, 1, 0.2);
//     drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
//     //left claw
//     popMatrix();
//     mdlMatrix.translate(0, -ccl, 0);
//     mdlMatrix.rotate(-45 - clawOpenAngle, 0, 0, 1);
//     mdlMatrix.translate(0, 1, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.2, 1, 0.2);
//     drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
//     popMatrix();
//     mdlMatrix.translate(0, 1, 0);
//     mdlMatrix.rotate(-135 - clawOpenAngle, 0, 0, 1);
//     mdlMatrix.translate(0, -0.5, 0);
//     mdlMatrix.scale(0.2, 1, 0.2);
//     drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
//     //inner claw
//     popMatrix();
//     mdlMatrix.translate(0, -ccl, 0);
//     mdlMatrix.rotate(-45 - clawOpenAngle, 1, 0, 0);
//     mdlMatrix.translate(0, 1, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.2, 1, 0.2);
//     drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
//     popMatrix();
//     mdlMatrix.translate(0, 1, 0);
//     mdlMatrix.rotate(-135 - clawOpenAngle, 1, 0, 0);
//     mdlMatrix.translate(0, -0.5, 0);
//     mdlMatrix.scale(0.2, 1, 0.2);
//     drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
//     //outer claw
//     popMatrix();
//     mdlMatrix.translate(0, -ccl, 0);
//     mdlMatrix.rotate(45 + clawOpenAngle, 1, 0, 0);
//     mdlMatrix.translate(0, 1, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.2, 1, 0.2);
//     drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
//     popMatrix();
//     mdlMatrix.translate(0, 1, 0);
//     mdlMatrix.rotate(135 + clawOpenAngle, 1, 0, 0);
//     mdlMatrix.translate(0, -0.5, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.2, 1, 0.2);
//     drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
//     var clawCornerPos  =  new Vector4([-1, -1, -0.5, 1.0]);
//     clawCorner = mdlMatrix.multiplyVector4(clawCornerPos);
//     popMatrix();
//     //#endregion ------------------------ claws ------------------------

//     distance = Math.sqrt(Math.pow(clawCorner.elements[0] - objVer.elements[0], 2) + Math.pow(clawCorner.elements[1] - objVer.elements[1], 2) + Math.pow(clawCorner.elements[2] - objVer.elements[2], 2));
//     // console.log(distance);  

//     //object
//     if( grab == 1 ){
//         mdlMatrix.translate(0.0, -2.5, 0.0);
//         var objPos = new Vector4([0.4 * -2, 0.4 * 2, 0, 1.0, 1.0]);
//         objVer = mdlMatrix.multiplyVector4(objPos);
//         pushObj();
//         mdlMatrix.rotate(rotateAngle2, 0, 1, 0);
//         console.log(objVer.elements);
//         pushMatrix();
//         mdlMatrix.scale(0.5, 1, 0.5);
//         drawOneObject(cube, mdlMatrix, 0.0, 0.0, 1.0);
//         popMatrix();
//     } else{
//       if( distance < 0.8 ){
//           console.log("objstack length: " + objStack.length)
//           console.log("distance: " + distance)
//           if( objStack.length != 0){
//               console.log("pop");
//               popObj();
//               pushObj();
//           } else{
//               mdlMatrix.setIdentity();
//               mdlMatrix.translate(objVer.elements[0], objVer.elements[1], objVer.elements[2]);
//               // mdlMatrix.scale(0.4,0.4,0.4);
//           }

//           mdlMatrix.rotate(rotateAngle2, 0, 1, 0);
//           console.log(objVer.elements);

//           pushMatrix();
//           mdlMatrix.scale(0.5, 1, 0.5);
//           drawOneObject(cube, mdlMatrix, 0.0, 0.0, 1.0);
//           popMatrix();  
//       } else {
//           if( grab == 2 ){
//               mdlMatrix.setIdentity();
//               mdlMatrix.scale(0.4, 0.4, 0.4);
//               mdlMatrix.translate(-2, 2, 0);
//               mdlMatrix.rotate(rotateAngle2, 0, 1, 0);
//               pushMatrix();
//               mdlMatrix.scale(0.5, 1, 0.5);
//               drawOneObject(cube, mdlMatrix, 0.0, 0.0, 1.0);
//               popMatrix();
//           } else {
//               mdlMatrix.setIdentity();
//               // mdlMatrix.translate(objVer.elements[0], objVer.elements[1], objVer.elements[2]);
//               // mdlMatrix.scale(0.4, 0.4, 0.4);
//               popObj();
//               pushObj();
//               mdlMatrix.rotate(rotateAngle2, 0, 1, 0);
//               pushMatrix();
//               mdlMatrix.scale(0.5, 1, 0.5);
//               drawOneObject(cube, mdlMatrix, 0.0, 0.0, 1.0);
//               popMatrix();
//           }
//       }
//     }

//     // pushMatrix();
//     pushMatrix();
//     pushMatrix();
//     pushMatrix();
//     pushMatrix();
//     //head
//     mdlMatrix.translate(0, 1, 0);
//     mdlMatrix.translate(0, 0.5, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.5, 0.5, 0.5);
//     if(grab == 1){
//         drawOneObject(cube, mdlMatrix, 1.0, 0.0, 0.0);
//     } else {
//         if(distance < 0.8 ){
//             drawOneObject(cube, mdlMatrix, 0.0, 1.0, 0.0);
//         } else {
//             if(grab == 2){
//               drawOneObject(cube, mdlMatrix, 0.7, 0.4, 1.0);
//             } else {
//               drawOneObject(cube, mdlMatrix, 0.7, 0.4, 1.0);
//             }
//         }
//     }
//     popMatrix();

//     popMatrix();
//     mdlMatrix.translate(0, -1, -0.05);
//     mdlMatrix.rotate(45 + objAngle2 , 0, 0, 1);
//     mdlMatrix.translate(0, -0.5, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.25, 0.5, 0.25);
//     drawOneObject(cube, mdlMatrix, 1.0, 0.0, 1.0);
//     popMatrix();

//     popMatrix();
//     mdlMatrix.translate(0, -1, -0.05);
//     mdlMatrix.rotate(-45 - objAngle2 , 0, 0, 1);
//     mdlMatrix.translate(0, -0.5, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.25, 0.5, 0.25);
//     drawOneObject(cube, mdlMatrix, 1.0, 0.0, 1.0);
//     popMatrix();

//     popMatrix();
//     mdlMatrix.translate(0, 1, -0.05);
//     mdlMatrix.rotate(45 + objAngle1, 0, 0, 1);
//     mdlMatrix.translate(0, -1, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.25, 0.5, 0.25);
//     drawOneObject(cube, mdlMatrix, 1.0, 0.0, 1.0);
//     popMatrix();

//     popMatrix();
//     mdlMatrix.translate(0, 1, -0.05);
//     mdlMatrix.rotate(-45 - objAngle1 , 0, 0, 1);
//     mdlMatrix.translate(0, -1, 0);
//     pushMatrix();
//     mdlMatrix.scale(0.25, 0.5, 0.25);
//     drawOneObject(cube, mdlMatrix, 1.0, 0.0, 1.0);
//     popMatrix();

// }



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
  drawRobot();
}

var lightX = 3, lightY = 3, lightZ = 2;
var scaleScene = 0;
var cameraX = 3, cameraY = 7, cameraZ = 15;
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

}

function initTexture(gl, img, imgName){
  var tex = gl.createTexture();
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.bindTexture(gl.TEXTURE_2D, tex);

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

  textures[imgName] = tex;

  // texCount++;
  // if( texCount == numTextures)draw();

  draw_all();
}

function initFrameBuffer(gl){
  //create and set up a texture object as the color buffer
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, offScreenWidth, offScreenHeight,
                  0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  

  //create and setup a render buffer as the depth buffer
  var depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 
                          offScreenWidth, offScreenHeight);

  //create and setup framebuffer: linke the color and depth buffer to it
  var frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, 
                            gl.TEXTURE_2D, texture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, 
                              gl.RENDERBUFFER, depthBuffer);
  frameBuffer.texture = texture;
  return frameBuffer;
}

function initCubeTexture(posXName, negXName, posYName, negYName, 
  posZName, negZName, imgWidth, imgHeight)
{
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

  const faceInfos = [
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      fName: posXName,
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      fName: negXName,
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      fName: posYName,
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      fName: negYName,
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      fName: posZName,
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      fName: negZName,
    },
  ];
  faceInfos.forEach((faceInfo) => {
  const {target, fName} = faceInfo;
    // setup each face so it's immediately renderable
    gl.texImage2D(target, 0, gl.RGBA, imgWidth, imgHeight, 0, 
    gl.RGBA, gl.UNSIGNED_BYTE, null);

  var image = new Image();
    image.onload = function(){
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    };
  image.src = fName;
  });
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  return texture;
}

function parseOBJ(text) {
  // because indices are base 1 let's just fill in the 0th data
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];

  // same order as `f` indices
  const objVertexData = [
    objPositions,
    objTexcoords,
    objNormals,
  ];

  // same order as `f` indices
  let webglVertexData = [
    [],   // positions
    [],   // texcoords
    [],   // normals
  ];

  const materialLibs = [];
  const geometries = [];
  let geometry;
  let groups = ['default'];
  let material = 'default';
  let object = 'default';

  const noop = () => {};

  function newGeometry() {
    // If there is an existing geometry and it's
    // not empty then start a new one.
    if (geometry && geometry.data.position.length) {
      geometry = undefined;
    }
  }

  function setGeometry() {
    if (!geometry) {
      const position = [];
      const texcoord = [];
      const normal = [];
      webglVertexData = [
        position,
        texcoord,
        normal,
      ];
      geometry = {
        object,
        groups,
        material,
        data: {
          position,
          texcoord,
          normal,
        },
      };
      geometries.push(geometry);
    }
  }

  function addVertex(vert) {
    const ptn = vert.split('/');
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return;
      }
      const objIndex = parseInt(objIndexStr);
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
      webglVertexData[i].push(...objVertexData[i][index]);
    });
  }

  const keywords = {
    v(parts) {
      objPositions.push(parts.map(parseFloat));
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    vt(parts) {
      // should check for missing v and extra w?
      objTexcoords.push(parts.map(parseFloat));
    },
    f(parts) {
      setGeometry();
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
    s: noop,    // smoothing group
    mtllib(parts, unparsedArgs) {
      // the spec says there can be multiple filenames here
      // but many exist with spaces in a single filename
      materialLibs.push(unparsedArgs);
    },
    usemtl(parts, unparsedArgs) {
      material = unparsedArgs;
      newGeometry();
    },
    g(parts) {
      groups = parts;
      newGeometry();
    },
    o(parts, unparsedArgs) {
      object = unparsedArgs;
      newGeometry();
    },
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
      continue;
    }
    handler(parts, unparsedArgs);
  }

  // remove any arrays that have no entries.
  for (const geometry of geometries) {
    geometry.data = Object.fromEntries(
        Object.entries(geometry.data).filter(([, array]) => array.length > 0));
  }

  return {
    geometries,
    materialLibs,
  };
}

function interface() {
  canvas.onmousedown = function (ev) {
      mouseDown(ev);
      draw_all();
  };
  canvas.onmousemove = function (ev) {
      mouseMove(ev);
      draw_all();
  };
  canvas.onmouseup = function (ev) {
      mouseUp(ev);
      draw_all();
  };
  document.onkeydown = function (ev) {
      keyDown(ev);
      draw_all();
  };
  var sliderX = document.getElementById("moveX");
  sliderX.oninput = function() {
    bodyXMove = this.value / 10;
    draw_all();
  }

  var sliderY = document.getElementById("moveY");
  sliderY.oninput = function() {
    bodyYMove = this.value / 10;
    draw_all();
  }

  var slider2 = document.getElementById("scale");
  slider2.oninput = function() {
      scaleScene = this.value/ 10;
      draw_all();
  }

  var slider3 = document.getElementById("rotateRobot");
  slider3.oninput = function() {
      rotateAngle1 = this.value 
      draw_all();
  }

  var slider4 = document.getElementById("rotateObj");
  slider4.oninput = function() {
      rotateAngle2 = this.value 
      draw_all();
  }
}

function mouseDown(ev){ 
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    if( rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom){
        mouseLastX = x;
        mouseLastY = y;
        mouseDragging = true;
    }
}

function mouseUp(ev){ 
    mouseDragging = false;
}

function mouseMove(ev){ 
    var x = ev.clientX;
    var y = ev.clientY;
    if( mouseDragging ){
        var factor = 100/canvas.height; //100 determine the spped you rotate the object
        var dx = factor * (x - mouseLastX);
        var dy = factor * (y - mouseLastY);

        angleX += dx; //yes, x for y, y for x, this is right
        angleY += dy;
    }
    mouseLastX = x;
    mouseLastY = y;

    draw_all();
}

function keyDown(event){
   //implment keydown event here
   let rotateMatrix = new Matrix4();
   rotateMatrix.setRotate(angleY, 1, 0, 0); //for mouse rotation
   rotateMatrix.rotate(angleX, 0, 1, 0); //for mouse rotation
   var viewDir = new Vector3([cameraDirX, cameraDirY, cameraDirZ]);
   var newViewDir = rotateMatrix.multiplyVector3(viewDir);
    if( event.key == 'a' || event.key == 'A'){
        console.log('A')
        bodyXMove -= 0.1;
        draw_all()
    }else if ( event.key == 'd' || event.key == 'D'){
        console.log('D')
        bodyXMove += 0.1;
        draw_all()
    }else if ( event.key == 's' || event.key == 'S'){
        console.log('S')
        bodyYMove -= 0.1;
        draw_all()
    }else if ( event.key == 'w' || event.key == 'W'){
        console.log('W')
        // bodyYMove += 0.1;
        cameraX -= newViewDir.elements[0] * 0.02;
        cameraY -= newViewDir.elements[1] * 0.02;
        cameraZ -= newViewDir.elements[2] * 0.02;
        draw_all()
    }else if ( (event.key == 'w' || event.key == 'W' ) && ( event.key == 'd' || event.key == 'D') ){
        console.log('W+D')
        bodyYMove += 0.1;
        draw_all()
    }else if ( event.key == 'r' || event.key == 'R'){ 
      console.log('R')
      if( clawOpenAngle < 20 ){
          clawOpenAngle += 10;
      }
      draw_all()
    }else if ( event.key == 't' || event.key == 'T'){ 
        console.log('T')
        if( clawOpenAngle > -20 ){
            clawOpenAngle -= 10;
        }
        draw_all()
    }else if ( event.key == 'n' || event.key == 'N'){ 
        console.log('N')
        armNode1Angle += 10;
        draw_all()
    }else if ( event.key == 'm' || event.key == 'M'){ 
        console.log('M')
        armNode1Angle -= 10;
        draw_all()
    }else if ( event.key == 'o' || event.key == 'O'){  
        console.log('O')
        armNode2Angle += 10;
        draw_all()
    }else if ( event.key == 'p' || event.key == 'P'){  
        console.log('P')
        armNode2Angle -= 10;
        draw_all()
    }else if ( event.key == 'j' || event.key == 'J'){  //rotate the second triangle
        console.log('J')
        armNode3Angle += 10;
        draw_all()
    }else if ( event.key == 'k' || event.key == 'K'){  //rotate the second triangle
        console.log('K')
        armNode3Angle -= 10;
        draw_all()
    }else if ( event.key == '1' ){  
        console.log('1')
        objAngle1 -= 10;
        draw_all()
    }else if ( event.key == '2'){  //rotate the second triangle
        console.log('2')
        objAngle1 += 10;
        draw_all()
    }else if ( event.key == '3' ){  
        console.log('3')
        objAngle2 -= 10;
        draw_all()
    }else if ( event.key == '4'){  //rotate the second triangle
        console.log('4')
        objAngle2 += 10;
        draw_all()
    }else if ( event.key == 'g' || event.key == 'G'){ //shorten the second triangle
      console.log('G')
      distance = Math.sqrt(Math.pow(clawCorner.elements[0] - objVer.elements[0], 2) + Math.pow(clawCorner.elements[1] - objVer.elements[1], 2) + Math.pow(clawCorner.elements[2] - objVer.elements[2], 2));
      console.log("grab: " + grab)
      if( distance < 0.8 ){
          if( grab == 0 || grab == 2 ){
              grab = 1;
              console.log("grab: " + grab);
          } else {
              grab = 0;
              console.log("grab: " + grab);
          }
      }
      draw_all()    
  }


    draw_all();
}

