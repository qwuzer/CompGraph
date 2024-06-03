var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Normal;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_normalMatrix;
    varying vec3 v_Normal;
    varying vec3 v_PositionInWorld;
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
        v_PositionInWorld = (u_modelMatrix * a_Position).xyz; 
        v_Normal = normalize(vec3(u_normalMatrix * a_Normal));
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
    uniform vec3 u_Color;
    varying vec3 v_Normal;
    varying vec3 v_PositionInWorld;
    void main(){
        // let ambient and diffuse color are u_Color 
        // (you can also input them from ouside and make them different)
        vec3 ambientLightColor = u_Color;
        vec3 diffuseLightColor = u_Color;
        // assume white specular light (you can also input it from ouside)
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

/////BEGIN:///////////////////////////////////////////////////////////////////////////////////////////////
/////The folloing three function is for creating vertex buffer, but link to shader to user later//////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////END://///////////////////////////////////////////////////////////////////////////////////////////////
/////The folloing three function is for creating vertex buffer, but link to shader to user later//////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

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



var gl, canvas;
var mvpMatrix;
var modelMatrix;
var normalMatrix;
var nVertex;
var mario = [];
var sonic = [];
var cube = [];
var sphere = [];
var moveDistance = 0;
var rotateAngle1 = 0, rotateAngle2 = 0;

let mdlMatrix = new Matrix4(); //model matrix of objects
var matStack = [];
function pushMatrix( mat ){
    matStack.push(new Matrix4(mdlMatrix));
}
function popMatrix(mat){
    mdlMatrix = matStack.pop();
}

var objStack = [];
function pushObj( mat ){
  objStack.push(new Matrix4(mdlMatrix));
}

function popObj(mat){
  mdlMatrix = objStack.pop();
}


async function main(){
    canvas = document.getElementById('webgl');
    gl = canvas.getContext('webgl2');
    if(!gl){
        console.log('Failed to get the rendering context for WebGL');
        return ;
    }

    program = compileShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    gl.useProgram(program);

    program.a_Position = gl.getAttribLocation(program, 'a_Position'); 
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

    /////3D model mario
    response = await fetch('mario.obj');
    text = await response.text();
    obj = parseOBJ(text);
    for( let i=0; i < obj.geometries.length; i ++ ){
      let o = initVertexBufferForLaterUse(gl, 
                                          obj.geometries[i].data.position,
                                          obj.geometries[i].data.normal, 
                                          obj.geometries[i].data.texcoord);
      mario.push(o);
    }

    /////3D model sonic
    response = await fetch('sonic.obj');
    text = await response.text();
    obj = parseOBJ(text);
    for( let i=0; i < obj.geometries.length; i ++ ){
      let o = initVertexBufferForLaterUse(gl, 
                                          obj.geometries[i].data.position,
                                          obj.geometries[i].data.normal, 
                                          obj.geometries[i].data.texcoord);
      sonic.push(o);
    }

    ////cube
    //TODO-1: create vertices for the cube whose edge length is 2.0 (or 1.0 is also fine)
    //F: Face, T: Triangle, V: vertex (XYZ)
    var v0 = [1.0, 1.0, 1.0];
    var v1 = [-1.0, 1.0, 1.0];
    var v2 = [-1.0, -1.0, 1.0];
    var v3 = [1.0, -1.0, 1.0];
    var v4 = [1.0, 1.0, -1.0];
    var v5 = [-1.0, 1.0, -1.0];
    var v6 = [-1.0, -1.0, -1.0];
    var v7 = [1.0, -1.0, -1.0];

    cubeVertices = [//F1_T1_V1,  F1_T1_V2,  F1_T1_V3,  F1_T2_V4,  F1_T2_V5,  F1_T2_V6,   //this row for the face z = 1.0
                    v0, v1, v2, v0, v2, v3,
                    // //F2_T1_V1,  F2_T1_V2,  F2_T1_V3,  F2_T2_V4,  F2_T2_V5,  F2_T2_V6,   //this row for the face x = 1.0
                    v0, v3, v7, v0, v7, v4,
                    // //F3_T1_V1,  F3_T1_V2,  F3_T1_V3,  F3_T2_V4,  F3_T2_V5,  F3_T2_V6,   //this row for the face y = 1.0
                    v0, v4, v5, v0, v5, v1,
                    // //F4_T1_V1,  F4_T1_V2,  F4_T1_V3,  F4_T2_V4,  F4_T2_V5,  F4_T2_V6,   //this row for the face x = -1.0
                    v1, v5, v6, v1, v6, v2,
                    // //F5_T1_V1,  F5_T1_V2,  F5_T1_V3,  F5_T2_V4,  F5_T2_V5,  F5_T2_V6,   //this row for the face y = -1.0
                    v7, v3, v2, v7, v2, v6,
                    // //F6_T1_V1,  F6_T1_V2,  F6_T1_V3,  F6_T2_V4,  F6_T2_V5,  F6_T2_V6,   //this row for the face z = -1.0
                    v5, v4, v7, v5, v7, v6,
                  ]
    cubeVertices = cubeVertices.flat(2);
    cubeNormals = getNormalOnVertices(cubeVertices);
    let o = initVertexBufferForLaterUse(gl, cubeVertices, cubeNormals, null);
    cube.push(o);


    var latitudeBands = 100;
    var longitudeBands = 10;
    var radius = 0.3;

    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];
    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);

            normalData.push(x);
            normalData.push(y);
            normalData.push(z);
            // normalData.push(getNormalOnVertices(vertexPositionData));

            textureCoordData.push(u);
            textureCoordData.push(v);
            vertexPositionData.push(radius * x);
            vertexPositionData.push(radius * y);
            vertexPositionData.push(radius * z);
        }
    }

    normalData = getNormalOnVertices(normalData);
    let o1 = initVertexBufferForLaterUse(gl, vertexPositionData, normalData, textureCoordData);
    sphere.push(o1);


    mvpMatrix = new Matrix4();
    modelMatrix = new Matrix4();
    normalMatrix = new Matrix4();

    gl.enable(gl.DEPTH_TEST);

    draw();//draw it once before mouse move

    canvas.onmousedown = function(ev){mouseDown(ev)};
    canvas.onmousemove = function(ev){mouseMove(ev)};
    canvas.onmouseup = function(ev){mouseUp(ev)};
    document.onkeydown = function(ev){keyDown(ev)};

    // var slider1 = document.getElementById("move");
    // slider1.oninput = function() {
    //     moveDistance = this.value/60.0
    //     draw();
    // }

    var slider2 = document.getElementById("scale");
    slider2.oninput = function() {
        scaleScene = this.value/ 10;
        draw();
    }

    var slider3 = document.getElementById("rotateRobot");
    slider3.oninput = function() {
        rotateAngle1 = this.value 
        draw();
    }

    var slider4 = document.getElementById("rotateObj");
    slider4.oninput = function() {
        rotateAngle2 = this.value 
        draw();
    }
}

var clawCorner = new Vector4([0.0, 0.0, 0.0, 1.0]);

var objVer = new Vector4([0.4 * -2, 0.4 * 2, 0, 1.0]);
var grab = 2; //grab: 1, not grab: -1, init: 2
var distance = 0;


/////Call drawOneObject() here to draw all object one by one 
////   (setup the model matrix and color to draw)
function draw(){
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Cube (ground)
    //TODO-1: set mdlMatrix for the cube
    mdlMatrix.setIdentity();
    mdlMatrix.scale(4, 0.2, 4);
    drawOneObject(cube, mdlMatrix, 1.0, 0.4, 0.4);


    //light
    mdlMatrix.setIdentity();
    mdlMatrix.translate(3, 3, 2);
    mdlMatrix.scale(0.1, 0.1, 0.1);
    drawOneObject(cube, mdlMatrix, 1, 1, 1);


    //robot
    mdlMatrix.setIdentity();
    mdlMatrix.scale(0.4, 0.4, 0.4);
    mdlMatrix.rotate(rotateAngle1, 0, 1, 0);

    mdlMatrix.translate(2.0 + bodyXMove, 2, 0 - bodyYMove);
    pushMatrix();
    mdlMatrix.scale(1, 1, 1);
    drawOneObject(cube, mdlMatrix, 0.0 , 0.4, 0.0);
    popMatrix();

    //tires
    pushMatrix();//1
    pushMatrix();//2
    pushMatrix();//3
    pushMatrix();//4
    mdlMatrix.translate(1, -1, 1);
    pushMatrix();
    mdlMatrix.scale(0.5, 0.5, 0.5);
    drawOneObject(cube, mdlMatrix, 0.0 , 0.0, 0.0);
    popMatrix();
    popMatrix();//1
    mdlMatrix.translate(1, -1, -1);
    pushMatrix();
    mdlMatrix.scale(0.5, 0.5, 0.5);
    drawOneObject(cube, mdlMatrix, 0.0 , 0.0, 0.0);
    popMatrix();
    popMatrix();//2
    mdlMatrix.translate(-1, -1, -1);
    pushMatrix();
    mdlMatrix.scale(0.5, 0.5, 0.5);
    drawOneObject(cube, mdlMatrix, 0.0 , 0.0, 0.0);
    popMatrix();
    popMatrix();//3
    mdlMatrix.translate(-1, -1, 1);
    pushMatrix();
    mdlMatrix.scale(0.5, 0.5, 0.5);
    drawOneObject(cube, mdlMatrix, 0.0 , 0.0, 0.0);
    popMatrix();
    popMatrix();//4
    //tires

    mdlMatrix.translate(0, 1, 0);
    mdlMatrix.translate(0, 2.5, 0);
    pushMatrix();
    mdlMatrix.scale(0.2, 2.5, 0.2);
    drawOneObject(cube, mdlMatrix, 0.4, 0.4, 0.4);
    popMatrix();

    mdlMatrix.translate(0, 2.5, 0);
    pushMatrix();
    mdlMatrix.scale(0.23, 0.23, 0.23);
    drawOneObject(cube, mdlMatrix, 1.0, 0.4, 0.4);
    popMatrix();
    
    mdlMatrix.rotate(armNode1Angle + 45, 0, 0, 1);
    mdlMatrix.translate(0, 1, 0);
    pushMatrix();
    mdlMatrix.scale(0.2, 1, 0.2);
    drawOneObject(cube, mdlMatrix, 0.4, 0.4, 0.4);
    popMatrix();  

    mdlMatrix.translate(0, 1, 0);
    mdlMatrix.rotate(armNode2Angle + 90, 0, 0, 1);
    mdlMatrix.translate(0, 1, 0);
    pushMatrix();
    mdlMatrix.scale(0.2, 1, 0.2);
    drawOneObject(cube, mdlMatrix, 0.4, 0.4, 0.4);
    popMatrix();

    mdlMatrix.translate(0, 1, 0);
    mdlMatrix.rotate(armNode3Angle + 45, 0, 0, 1);
    mdlMatrix.translate(0, 0.5, 0);
    pushMatrix();
    mdlMatrix.scale(0.2, 0.5, 0.2);
    drawOneObject(cube, mdlMatrix, 0.4, 0.4, 0.4);
    popMatrix();

    var ccl = 0.5;//claw cube length
    mdlMatrix.translate(0, 0.5, 0);
    pushMatrix();
    mdlMatrix.scale(ccl, ccl, ccl);
    drawOneObject(cube, mdlMatrix, 1.0, 1.0, 1.0);
    popMatrix();

    //right claw
    pushMatrix();
    pushMatrix();
    pushMatrix();
    mdlMatrix.translate(0, -ccl, 0);
    mdlMatrix.rotate(45 + clawOpenAngle, 0, 0, 1);
    mdlMatrix.translate(0, 1, 0);
    pushMatrix();
    mdlMatrix.scale(0.2, 1, 0.2);
    drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
    popMatrix();
    mdlMatrix.translate(0, 1, 0);
    mdlMatrix.rotate(135 + clawOpenAngle, 0, 0, 1);
    mdlMatrix.translate(0, -0.5, 0);
    mdlMatrix.scale(0.2, 1, 0.2);
    drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
    //left claw
    popMatrix();
    mdlMatrix.translate(0, -ccl, 0);
    mdlMatrix.rotate(-45 - clawOpenAngle, 0, 0, 1);
    mdlMatrix.translate(0, 1, 0);
    pushMatrix();
    mdlMatrix.scale(0.2, 1, 0.2);
    drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
    popMatrix();
    mdlMatrix.translate(0, 1, 0);
    mdlMatrix.rotate(-135 - clawOpenAngle, 0, 0, 1);
    mdlMatrix.translate(0, -0.5, 0);
    mdlMatrix.scale(0.2, 1, 0.2);
    drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
    //inner claw
    popMatrix();
    mdlMatrix.translate(0, -ccl, 0);
    mdlMatrix.rotate(-45 - clawOpenAngle, 1, 0, 0);
    mdlMatrix.translate(0, 1, 0);
    pushMatrix();
    mdlMatrix.scale(0.2, 1, 0.2);
    drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
    popMatrix();
    mdlMatrix.translate(0, 1, 0);
    mdlMatrix.rotate(-135 - clawOpenAngle, 1, 0, 0);
    mdlMatrix.translate(0, -0.5, 0);
    mdlMatrix.scale(0.2, 1, 0.2);
    drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
    //outer claw
    popMatrix();
    mdlMatrix.translate(0, -ccl, 0);
    mdlMatrix.rotate(45 + clawOpenAngle, 1, 0, 0);
    mdlMatrix.translate(0, 1, 0);
    pushMatrix();
    mdlMatrix.scale(0.2, 1, 0.2);
    drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
    popMatrix();
    mdlMatrix.translate(0, 1, 0);
    mdlMatrix.rotate(135 + clawOpenAngle, 1, 0, 0);
    mdlMatrix.translate(0, -0.5, 0);
    pushMatrix();
    mdlMatrix.scale(0.2, 1, 0.2);
    drawOneObject(cube, mdlMatrix, 1,0, 1.0, 0.0);
    var clawCornerPos  =  new Vector4([-1, -1, -0.5, 1.0]);
    clawCorner = mdlMatrix.multiplyVector4(clawCornerPos);
    popMatrix();

    distance = Math.sqrt(Math.pow(clawCorner.elements[0] - objVer.elements[0], 2) + Math.pow(clawCorner.elements[1] - objVer.elements[1], 2) + Math.pow(clawCorner.elements[2] - objVer.elements[2], 2));
    // console.log(distance);  

    //object
    if( grab == 1 ){
        mdlMatrix.translate(0.0, -2.5, 0.0);
        var objPos = new Vector4([0.4 * -2, 0.4 * 2, 0, 1.0, 1.0]);
        objVer = mdlMatrix.multiplyVector4(objPos);
        pushObj();
        mdlMatrix.rotate(rotateAngle2, 0, 1, 0);
        console.log(objVer.elements);
        pushMatrix();
        mdlMatrix.scale(0.5, 1, 0.5);
        drawOneObject(cube, mdlMatrix, 0.0, 0.0, 1.0);
        popMatrix();
    } else{
      if( distance < 0.8 ){
          console.log("objstack length:" + objStack.length)
          console.log("distance: " + distance)
          if( objStack.length != 0){
              console.log("pop");
              popObj();
              pushObj();
          } else{
              mdlMatrix.setIdentity();
              mdlMatrix.translate(objVer.elements[0], objVer.elements[1], objVer.elements[2]);
              mdlMatrix.scale(0.4,0.4,0.4);
          }

          mdlMatrix.rotate(rotateAngle2, 0, 1, 0);
          console.log(objVer.elements);

          pushMatrix();
          mdlMatrix.scale(0.5, 1, 0.5);
          drawOneObject(cube, mdlMatrix, 0.0, 0.0, 1.0);
          popMatrix();  
      } else {
          if( grab == 2 ){
              mdlMatrix.setIdentity();
              mdlMatrix.scale(0.4, 0.4, 0.4);
              mdlMatrix.translate(-2, 2, 0);
              mdlMatrix.rotate(rotateAngle2, 0, 1, 0);
              pushMatrix();
              mdlMatrix.scale(0.5, 1, 0.5);
              drawOneObject(cube, mdlMatrix, 0.0, 0.0, 1.0);
              popMatrix();
          } else {
              mdlMatrix.setIdentity();
              // mdlMatrix.translate(objVer.elements[0], objVer.elements[1], objVer.elements[2]);
              // mdlMatrix.scale(0.4, 0.4, 0.4);
              popObj();
              pushObj();
              mdlMatrix.rotate(rotateAngle2, 0, 1, 0);
              pushMatrix();
              mdlMatrix.scale(0.5, 1, 0.5);
              drawOneObject(cube, mdlMatrix, 0.0, 0.0, 1.0);
              popMatrix();
          }
      }
    }

    // pushMatrix();
    pushMatrix();
    pushMatrix();
    pushMatrix();
    pushMatrix();
    //head
    mdlMatrix.translate(0, 1, 0);
    mdlMatrix.translate(0, 0.5, 0);
    pushMatrix();
    mdlMatrix.scale(0.5, 0.5, 0.5);
    if(grab == 1){
        drawOneObject(cube, mdlMatrix, 1.0, 0.0, 0.0);
    } else {
        if(distance < 0.8 ){
            drawOneObject(cube, mdlMatrix, 0.0, 1.0, 0.0);
        } else {
            if(grab == 2){
              drawOneObject(cube, mdlMatrix, 0.7, 0.4, 1.0);
            } else {
              drawOneObject(cube, mdlMatrix, 0.7, 0.4, 1.0);
            }
        }
    }
    popMatrix();

    popMatrix();
    mdlMatrix.translate(0, -1, -0.05);
    mdlMatrix.rotate(45 + objAngle2 , 0, 0, 1);
    mdlMatrix.translate(0, -0.5, 0);
    pushMatrix();
    mdlMatrix.scale(0.25, 0.5, 0.25);
    drawOneObject(cube, mdlMatrix, 1.0, 0.0, 1.0);
    popMatrix();

    popMatrix();
    mdlMatrix.translate(0, -1, -0.05);
    mdlMatrix.rotate(-45 - objAngle2 , 0, 0, 1);
    mdlMatrix.translate(0, -0.5, 0);
    pushMatrix();
    mdlMatrix.scale(0.25, 0.5, 0.25);
    drawOneObject(cube, mdlMatrix, 1.0, 0.0, 1.0);
    popMatrix();

    popMatrix();
    mdlMatrix.translate(0, 1, -0.05);
    mdlMatrix.rotate(45 + objAngle1, 0, 0, 1);
    mdlMatrix.translate(0, -1, 0);
    pushMatrix();
    mdlMatrix.scale(0.25, 0.5, 0.25);
    drawOneObject(cube, mdlMatrix, 1.0, 0.0, 1.0);
    popMatrix();

    popMatrix();
    mdlMatrix.translate(0, 1, -0.05);
    mdlMatrix.rotate(-45 - objAngle1 , 0, 0, 1);
    mdlMatrix.translate(0, -1, 0);
    pushMatrix();
    mdlMatrix.scale(0.25, 0.5, 0.25);
    drawOneObject(cube, mdlMatrix, 1.0, 0.0, 1.0);
    popMatrix();

}

var scaleScene = 0;
var cameraX = 3, cameraY = 5, cameraZ = 15;
//obj: the object components
//mdlMatrix: the model matrix without mouse rotation
//colorR, G, B: object color
function drawOneObject(obj, mdlMatrix, colorR, colorG, colorB){
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

    for( let i=0; i < obj.length; i ++ ){
      initAttributeVariable(gl, program.a_Position, obj[i].vertexBuffer);
      initAttributeVariable(gl, program.a_Normal, obj[i].normalBuffer);
      gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
    }
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

    draw();
}


function keyDown(event){
    if( event.key == 'a' || event.key == 'A'){
        console.log('A')
        bodyXMove -= 0.1;
        draw()
    }else if ( event.key == 'd' || event.key == 'D'){
        console.log('D')
        bodyXMove += 0.1;
        draw()
    }else if ( event.key == 's' || event.key == 'S'){
        console.log('S')
        bodyYMove -= 0.1;
        draw()
    }else if ( event.key == 'w' || event.key == 'W'){
        console.log('W')
        bodyYMove += 0.1;
        draw()
    }else if ( event.key == 'r' || event.key == 'R'){ 
      console.log('R')
      if( clawOpenAngle < 20 ){
          clawOpenAngle += 10;
      }
      draw()
    }else if ( event.key == 't' || event.key == 'T'){ 
        console.log('T')
        if( clawOpenAngle > -20 ){
            clawOpenAngle -= 10;
        }
        draw()
    }else if ( event.key == 'n' || event.key == 'N'){ 
        console.log('N')
        armNode1Angle += 10;
        draw()
    }else if ( event.key == 'm' || event.key == 'M'){ 
        console.log('M')
        armNode1Angle -= 10;
        draw()
    }else if ( event.key == 'o' || event.key == 'O'){  
        console.log('O')
        armNode2Angle += 10;
        draw()
    }else if ( event.key == 'p' || event.key == 'P'){  
        console.log('P')
        armNode2Angle -= 10;
        draw()
    }else if ( event.key == 'j' || event.key == 'J'){  //rotate the second triangle
        console.log('J')
        armNode3Angle += 10;
        draw()
    }else if ( event.key == 'k' || event.key == 'K'){  //rotate the second triangle
        console.log('K')
        armNode3Angle -= 10;
        draw()
    }else if ( event.key == '1' ){  
        console.log('1')
        objAngle1 -= 10;
        draw()
    }else if ( event.key == '2'){  //rotate the second triangle
        console.log('2')
        objAngle1 += 10;
        draw()
    }else if ( event.key == '3' ){  
        console.log('3')
        objAngle2 -= 10;
        draw()
    }else if ( event.key == '4'){  //rotate the second triangle
        console.log('4')
        objAngle2 += 10;
        draw()
    }else if ( event.key == 'g' || event.key == 'G'){ //shorten the second triangle
      console.log('G')
      distance = Math.sqrt(Math.pow(clawCorner.elements[0] - objVer.elements[0], 2) + Math.pow(clawCorner.elements[1] - objVer.elements[1], 2) + Math.pow(clawCorner.elements[2] - objVer.elements[2], 2));
      if( distance < 0.8 ){
          if( grab == 0 || grab == 2 ){
              grab = 1;
          } else {
              grab = 0;
          }
      }
      draw()    
  }


    draw();
}