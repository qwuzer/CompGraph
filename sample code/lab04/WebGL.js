var VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        varying vec4 v_Color;
        uniform mat4 u_ModelMatrix;
        uniform mat4 u_ViewMatrix;
        uniform mat4 u_ProjMatrix;
        void main(){
            gl_Position = u_ProjMatrix*u_ViewMatrix * u_ModelMatrix * a_Position;
            gl_PointSize = 10.0;
            v_Color = a_Color;
        }    
    `;

var FSHADER_SOURCE = `
        precision mediump float;
        varying vec4 v_Color;
        void main(){
            gl_FragColor = v_Color;
        }
    `;


function createProgram(gl, vertexShader, fragmentShader){
    //create the program and attach the shaders
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    //if success, return the program. if not, log the program info, and delete it.
    if(gl.getProgramParameter(program, gl.LINK_STATUS)){
        return program;
    }
    alert(gl.getProgramInfoLog(program) + "");
    gl.deleteProgram(program);
}

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

function initVertexBufferForLaterUse(gl, vertices, colors){
    var nVertices = vertices.length / 3;

    var o = new Object();
    o.vertexBuffer = initArrayBufferForLaterUse(gl, new Float32Array(vertices), 3, gl.FLOAT);
    o.colorBuffer = initArrayBufferForLaterUse(gl, new Float32Array(colors), 3, gl.FLOAT);
    if (!o.vertexBuffer || !o.colorBuffer) 
        console.log("Error: in initVertexBufferForLaterUse(gl, vertices, colors)"); 
    o.numVertices = nVertices;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return o;
}
/////END://///////////////////////////////////////////////////////////////////////////////////////////////
/////The folloing three function is for creating vertex buffer, but link to shader to user later//////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

var transformMat = new Matrix4(); 
var transformMatCircle1 = new Matrix4(); //initial circle base transformation matrix
transformMatCircle1.setTranslate(0.5, 0, 0);

//NOTE: You are NOT allowed to change the vertex information here
var triangleVerticesA = [0.0, 0.2, 0.0, -0.1, -0.3, 0.0, 0.1, -0.3, 0.0]; //green rotating triangle vertices
var triangleColorA = [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0 ]; //green trotating riangle color

//NOTE: You are NOT allowed to change the vertex information here
var triangleVerticesB = [0.0, 0.0, 0.0, -0.1, -0.5, 0.0, 0.1, -0.5, 0.0]; //green rotating triangle vertices
var triangleColorB= [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0 ]; //green trotating riangle color

   
var triangle1XMove = 0;
var triangle1YMove = 0;
var triangle2Angle = 125;
var triangle2HeightScale = 1;
var triangle3Angle = 0;

circle1Angle = 0; //the angle of the triangle on the circle


/////// create circle model
var circleVertices = []
var circleColors = []
var circleColorsTouch = []
var circleColorsGrab = []
var circleRadius = 0.1;
for (i = 0; i <= 1000; i++){
    circleRadius = 0.1
    x = ceRadius*Math.sin(i * 2 * Math.PI / 200) 
    circleVerircleRadius*Math.cos(i * 2 * Math.PI / 200)
    y = circltices.push(x, y);
    circleColors.push(1, 0, 0); //circle normal color
    circleColorsTouch.push(0, 1, 0); //color when the circle connect with the triangle corner
    circleColorsGrab.push(0, 0.5, 0); //color when the circle is grabbed by the triangle corner
}


var transformMat = new Matrix4();
var matStack = [];
var u_modelMatrix;
function pushMatrix(){
    matStack.push(new Matrix4(transformMat));
}
function popMatrix(){
    transformMat = matStack.pop();
}


var grab = 2; //grab: 1, not grab: -1
var distance = 0;
var circleCenter = new Vector4([0.5, 0, 0, 1.0]);
var triangleCorner = new Vector4([-0.1, -0.5, 0.0, 1.0]);

function main(){
    //////Get the canvas context
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl2');
    if(!gl){
        console.log('Failed to get the rendering context for WebGL');
        return ;
    }

    /////compile shader and use it
    program = compileShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    gl.useProgram(program);

    /////prepare attribute reference of the shader
    program.a_Position = gl.getAttribLocation(program, 'a_Position');
    program.a_Color = gl.getAttribLocation(program, 'a_Color');

    var u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    var u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    var u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
    var modelMatrix = new Matrix4();
    var viewMatrix = new Matrix4();
    var projMatrix = new Matrix4();
    program.u_modelMatrix = gl.getUniformLocation(program, 'u_modelMatrix');
    if(program.a_Position<0 || program.a_Color<0 || program.u_modelMatrix < 0)  
        console.log('Error: f(program.a_Position<0 || program.a_Color<0 || .....');




    

    /////create vertex buffer of the two triangle models for later use
    triangleModelA = initVertexBufferForLaterUse(gl, triangleVerticesA, triangleColorA);
    triangleModelB = initVertexBufferForLaterUse(gl, triangleVerticesB, triangleColorB);

    ////create vertex buffer of the circle with red color, light green and dark green color
    circleModel = initVertexBufferForLaterUse(gl, circleVertices, circleColors);
    circleModelTouch = initVertexBufferForLaterUse(gl, circleVertices, circleColorsTouch);
    circleModelGrab = initVertexBufferForLaterUse(gl, circleVertices, circleColorsGrab);
    
    document.addEventListener('keydown', (event)=> {    
        if( event.key == 'a' || event.key == 'A'){ //move triangle1 to the left
            console.log('A')
            triangle1XMove -= 0.05;
            draw(gl)
        }else if ( event.key == 'd' || event.key == 'D'){  //move triangle1 to the right
            console.log('D')
            triangle1XMove += 0.05;
            draw(gl)
        }else if ( event.key == 's' || event.key == 'S'){ //shorten the second triangle
            console.log('S')
            triangle1YMove -= 0.1;
            draw(gl)
        }else if ( event.key == 'w' || event.key == 'W'){ //shorten the second triangle
            console.log('W')
            triangle1YMove += 0.1;
            draw(gl)
        }else if ( event.key == 'r' || event.key == 'R'){  //rotate the second triangle
            console.log('R')
            triangle2Angle += 10;
            draw(gl)
        }else if ( event.key == 'g' || event.key == 'G'){ //shorten the second triangle
            console.log('G')
            distance = Math.sqrt(Math.pow(triangleCorner.elements[0] - circleCenter.elements[0], 2) + Math.pow(triangleCorner.elements[1] - circleCenter.elements[1], 2));
            if( distance < 0.1 ){
                if( grab == 0 || grab == 2 ){
                    grab = 1;
                } else {
                    // circleCenter = transformMat.multiplyVector4(circleCenter);/
                    grab = 0;
                }
            }
            draw(gl)
        }
    });

    ////For creating animation, in short this code segment will keep calling "draw(gl)" 
    ////btw, this needs "webgl-util.js" in the folder (we include it in index.html)
    var tick = function() {
        draw(gl);
        requestAnimationFrame(tick);
    }
    tick();
}

function draw(gl)
{
    ////clear background color by black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    transformMat.setIdentity(); //set identity matrix to transformMat
    
    //Note: You are NOT Allowed to change the following code
    transformMat.translate(triangle1XMove, triangle1YMove, 0);
    initAttributeVariable(gl, program.a_Position, triangleModelA.vertexBuffer);//set triangle  vertex to shader varibale
    initAttributeVariable(gl, program.a_Color, triangleModelA.colorBuffer); //set triangle  color to shader varibale
    gl.uniformMatrix4fv(program.u_modelMatrix, false, transformMat.elements);//pass current transformMat to shader
    gl.drawArrays(gl.TRIANGLES, 0, triangleModelA.numVertices);//draw a triangle using triangleModelA
    ////////////// END: draw the first triangle

    /////////The code segment from here to the end of draw() function 
    /////////   is the only code segment you are allowed to change in this practice
    transformMat.translate(0.0, 0.2, 0, 1);
    transformMat.rotate(triangle2Angle, 0, 0, 1);
    transformMat.scale(1, triangle2HeightScale, 1);
    initAttributeVariable(gl, program.a_Position, triangleModelB.vertexBuffer);//set triangle  vertex to shader varibale
    initAttributeVariable(gl, program.a_Color, triangleModelB.colorBuffer); //set triangle  color to shader varibale
    gl.uniformMatrix4fv(program.u_modelMatrix, false, transformMat.elements);//pass current transformMat to shader
    gl.drawArrays(gl.TRIANGLES, 0, triangleModelB.numVertices);//draw the triangle 

    pushMatrix();

    var triangleCornerPos = new Vector4([-0.1, -0.5, 0.0, 1.0]);
    triangleCorner = transformMat.multiplyVector4(triangleCornerPos);
    // console.log("triangleCornerPos", triangleCorner.elements)

    distance = Math.sqrt(Math.pow(triangleCorner.elements[0] - circleCenter.elements[0], 2) + Math.pow(triangleCorner.elements[1] - circleCenter.elements[1], 2));

    if( grab == 1 ){
        popMatrix();
        console.log("transformMat", transformMat.elements)
        transformMat.translate(-0.1, -0.5, 0);
        var circleCenterPos = new Vector4([0.0, 0.0, 0.0, 1.0])
        circleCenter = transformMat.multiplyVector4(circleCenterPos);
        console.log("circleCenter", circleCenter.elements)

        initAttributeVariable(gl, program.a_Position, circleModelGrab.vertexBuffer);//set circle  vertex to shader varibale
        initAttributeVariable(gl, program.a_Color, circleModelGrab.colorBuffer); //set circle normal color to shader varibale
    } else {
        if( distance < 0.1 ){
            initAttributeVariable(gl, program.a_Position, circleModelTouch.vertexBuffer);//set circle  vertex to shader varibale
            initAttributeVariable(gl, program.a_Color, circleModelTouch.colorBuffer); //set circle normal color to shader varibale
            transformMat.setIdentity(); 
            transformMat.setTranslate(circleCenter.elements[0], circleCenter.elements[1], 0);
        } else {
            console.log("not touch")
            initAttributeVariable(gl, program.a_Position, circleModel.vertexBuffer);//set circle  vertex to shader varibale
            initAttributeVariable(gl, program.a_Color, circleModel.colorBuffer); //set circle normal color to shader varibale
            if( grab == 2 ){
                transformMat.setIdentity();
                transformMat.translate(0.5, 0, 0);
            } else {
                transformMat.setIdentity();
                transformMat.translate( circleCenter.elements[0], circleCenter.elements[1], 0);
            }
        }
    }
    gl.uniformMatrix4fv(program.u_modelMatrix, false, transformMat.elements);//pass current transformMat to shader
    gl.drawArrays(gl.TRIANGLES, 0, circleModel.numVertices);//draw the triangle 



    // distance = Math.sqrt(Math.pow(triangleCorner.elements[0] - circleCenter.elements[0], 2) + Math.pow(triangleCorner.elements[1] - circleCenter.elements[1], 2));

    // if( grab ){
    //     initAttributeVariable(gl, program.a_Position, circleModelGrab.vertexBuffer);//set circle  vertex to shader varibale
    //     initAttributeVariable(gl, program.a_Color, circleModelGrab.colorBuffer); //set circle normal color to shader varibale
    //     popMatrix();
    //     transformMat.translate(-0.1, -0.5, 0);
    // } else { 
    //     if (distance < 0.1){
    //         console.log("touch")
    //         initAttributeVariable(gl, program.a_Position, circleModelTouch.vertexBuffer);//set circle  vertex to shader varibale
    //         initAttributeVariable(gl, program.a_Color, circleModelTouch.colorBuffer); //set circle normal color to shader varibale
    //         if( grab ){
    //             console.log("grab")
    //             initAttributeVariable(gl, program.a_Position, circleModelGrab.vertexBuffer);//set circle  vertex to shader varibale
    //             initAttributeVariable(gl, program.a_Color, circleModelGrab.colorBuffer); //set circle normal color to shader varibale
    //             popMatrix();
    //             // console.log("transformMat", transformMat.elements)
    //             transformMat.translate(-0.1, -0.5, 0);
    //         }
    //     } else {
    //         console.log("not touch")
    //         initAttributeVariable(gl, program.a_Position, circleModel.vertexBuffer);//set circle  vertex to shader varibale
    //         initAttributeVariable(gl, program.a_Color, circleModel.colorBuffer); //set circle normal color to shader varibale
    //     }
    // }
    // gl.uniformMatrix4fv(program.u_modelMatrix, false, transformMat.elements);//pass current transformMat to shader
    // gl.drawArrays(gl.TRIANGLES, 0, circleModel.numVertices);//draw the triangle 

    circle1Angle ++; //keep changing the angle of the triangle
    transformMat.rotate(circle1Angle, 0, 0, 1);
    initAttributeVariable(gl, program.a_Position, triangleModelB.vertexBuffer);//set triangle  vertex to shader varibale
    initAttributeVariable(gl, program.a_Color, triangleModelB.colorBuffer); //set triangle  color to shader varibale
    gl.uniformMatrix4fv(program.u_modelMatrix, false, transformMat.elements);//pass current transformMat to shader
    gl.drawArrays(gl.TRIANGLES, 0, triangleModelB.numVertices);//draw the triangle 
}
