var VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        varying vec4 v_Color;
        uniform mat4 u_modelMatrix;
        uniform mat4 u_ViewMatrix;
        uniform mat4 u_ProjMatrix;
        void main(){
            gl_Position =   u_ProjMatrix * u_ViewMatrix * u_modelMatrix * a_Position;
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
    o.colorBuffer = initArrayBufferForLaterUse(gl, new Float32Array(colors),3, gl.FLOAT);
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
var transformMatObject = new Matrix4(); //initial circle base transformation matrix

var rectVertices = [0.5, 0.5, 0.0, -0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0]; 
var rectColorR = [1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0 ];
var rectColorG = [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0 ];
var rectColorB = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0 ];

var triangleVertices = [0.0, 0.4, 0.0, 0.2, 0.0, 0.0, -0.2, 0.0, 0.0];
var triangleColor = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0]

var clawOpenAngle = 0;
var armNode1Angle = 0;
var armNode2Angle = 0;
var armNode3Angle = 0;
var objectArmAngle = 0;
var objectLegAngle = 0;
var objectSwordAngle = 0;
var bodyXMove= 0;
var bodyYMove = 0;
var scale = 0;


circle1Angle = 0; //the angle of the triangle on the circle

/////// create circle model
var circleVertices = []
var circleColors = []
var circleColorsTouch = []
var circleColorsGrab = []
var circleRadius = 0.1;
for (i = 0; i <= 1000; i++){
    circleRadius = 0.1
    x = circleRadius*Math.cos(i * 2 * Math.PI / 200)
    y = circleRadius*Math.sin(i * 2 * Math.PI / 200) 
    circleVertices.push(x, y);
    circleColors.push(1, 0, 0); //circle normal color
    circleColorsTouch.push(0, 1, 0); //color when the circle connect with the triangle corner
    circleColorsGrab.push(0, 0.5, 0); //color when the circle is grabbed by the triangle corner
}


var matStack = [];
var u_modelMatrix;
var viewMatrix = new Matrix4();
function pushMatrix(){
    matStack.push(new Matrix4(transformMat));
}
function popMatrix(){
    transformMat = matStack.pop();
}


var grab = 2; //grab: 1, not grab: -1
var distance = 0;
var circleCenter = new Vector4([0.5, 0, 0, 1.0]);
var scaleScene = 0;

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

    var u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0, 0, 5 + scaleScene, 0, 0, -100, 0, 1, 0);
    // viewMatrix.setLookAt(-1, -1, -4.6, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);


    var u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
    var projMatrix = new Matrix4();
    projMatrix.setPerspective(30, 1, 1, 100);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);


    /////prepare attribute reference of the shader
    program.a_Position = gl.getAttribLocation(program, 'a_Position');
    program.a_Color = gl.getAttribLocation(program, 'a_Color');
    program.u_modelMatrix = gl.getUniformLocation(program, 'u_modelMatrix');
    // program.u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    if(program.a_Position<0 || program.a_Color<0 || program.u_modelMatrix < 0)  
        console.log('Error: f(program.a_Position<0 || program.a_Color<0 || .....');

    
    // viewMatrix.setLookAt(0, 0, 1, 0, 0, -100, 0, 1, 0);
    // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    rectModelR = initVertexBufferForLaterUse(gl, rectVertices, rectColorR);
    rectModelG = initVertexBufferForLaterUse(gl, rectVertices, rectColorG);
    rectModelB = initVertexBufferForLaterUse(gl, rectVertices, rectColorB);

    triModel = initVertexBufferForLaterUse(gl, triangleVertices, triangleColor);
    ////create vertex buffer of the circle with red color, light green and dark green color
    circleModel = initVertexBufferForLaterUse(gl, circleVertices, circleColors);
    circleModelTouch = initVertexBufferForLaterUse(gl, circleVertices, circleColorsTouch);
    circleModelGrab = initVertexBufferForLaterUse(gl, circleVertices, circleColorsGrab);
    
    document.addEventListener('keydown', (event)=> {    
        if( event.key == 'a' || event.key == 'A'){ //move triangle1 to the left
            console.log('A')
            bodyXMove -= 0.1;
            draw(gl)
        }else if ( event.key == 'd' || event.key == 'D'){  //move triangle1 to the right
            console.log('D')
            bodyXMove += 0.1;
            draw(gl)
        }else if ( event.key == 's' || event.key == 'S'){ //shorten the second triangle
            console.log('S')
            bodyYMove -= 0.1;
            draw(gl)
        }else if ( event.key == 'w' || event.key == 'W'){ //shorten the second triangle
            console.log('W')
            bodyYMove += 0.1;
            draw(gl)
        }else if ( event.key == 'r' || event.key == 'R'){  //rotate the second triangle
            console.log('R')
            if( clawOpenAngle < 30 ){
                clawOpenAngle += 10;
            }
            draw(gl)
        }else if ( event.key == 't' || event.key == 'T'){  //rotate the second triangle
            console.log('T')
            if( clawOpenAngle > -30 ){
                clawOpenAngle -= 10;
            }
            draw(gl)
        }else if ( event.key == 'n' || event.key == 'N'){  //rotate the second triangle
            console.log('N')
            armNode1Angle += 10;
            draw(gl)
        }else if ( event.key == 'm' || event.key == 'M'){  //rotate the second triangle
            console.log('M')
            armNode1Angle -= 10;
            draw(gl)
        }else if ( event.key == 'o' || event.key == 'O'){  //rotate the second triangle
            console.log('O')
            armNode2Angle += 10;
            draw(gl)
        }else if ( event.key == 'p' || event.key == 'P'){  //rotate the second triangle
            console.log('P')
            armNode2Angle -= 10;
            draw(gl)
        }else if ( event.key == 'j' || event.key == 'J'){  //rotate the second triangle
            console.log('J')
            armNode3Angle += 10;
            draw(gl)
        }else if ( event.key == 'k' || event.key == 'K'){  //rotate the second triangle
            console.log('K')
            armNode3Angle -= 10;
            draw(gl)
        }else if ( event.key == '1'){  //rotate the second triangle
            console.log('1')
            objectArmAngle += 10;
            draw(gl)
        }else if ( event.key == '2'){  //rotate the second triangle
            console.log('2')
            objectArmAngle -= 10;
            draw(gl)
        }else if ( event.key == '3'){  //rotate the second triangle
            console.log('3')
            objectLegAngle += 10;
            draw(gl)
        }else if ( event.key == '4'){  //rotate the second triangle
            console.log('4')
            objectLegAngle -= 10;
            draw(gl)
        }else if ( event.key == '5'){  //rotate the second triangle
            console.log('5')
            objectSwordAngle += 10;
            draw(gl)
        }else if ( event.key == '6'){  //rotate the second triangle
            console.log('6')
            objectSwordAngle -= 10;
            draw(gl)
        }else if ( event.key == '=' ){  //rotate the second triangle
            console.log('=')
            scaleScene -= 0.5;
            viewMatrix.setLookAt(0, 0, 5 + scaleScene, 0, 0, -100, 0, 1, 0);
            gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
            draw(gl)
        }else if ( event.key == '-'){  //rotate the second triangle
            console.log('-')
            scaleScene += 0.5;
            viewMatrix.setLookAt(0, 0, 5+ scaleScene, 0, 0, -100, 0, 1, 0);
            gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
            draw(gl)
        }else if ( event.key == 'g' || event.key == 'G'){ //shorten the second triangle
            console.log('G')
            console.log('grab: ', grab)
            distance = Math.sqrt(Math.pow(clawCorner.elements[0] - circleCenter.elements[0], 2) + Math.pow(clawCorner.elements[1] - circleCenter.elements[1], 2));
            if( distance < 0.1*0.5 ){
                console.log('ju');
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



function drawObject(gl, model, mode, transformMat){
    initAttributeVariable(gl, program.a_Position, model.vertexBuffer);
    initAttributeVariable(gl, program.a_Color, model.colorBuffer); 

    gl.uniformMatrix4fv(program.u_modelMatrix, false, transformMat.elements);
    gl.drawArrays(mode, 0, model.numVertices);
}

var clawCorner = new Vector4([0.0, 0.0, 0.0, 1.0]);
var circleCenter = new Vector4([-0.8, -0.67, 0.0, 1.0]);

function draw(gl)
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    transformMat.setIdentity(); 
    transformMat.translate(bodyXMove, bodyYMove, 0.0);
    transformMat.translate(0.6, -0.8, 0.0);
    transformMat.scale(0.3 + scale , 0.3 + scale, 0.0); //scaling the whole model

    //////////////////////// CAR BODY /////////////////////////
    pushMatrix();
    transformMat.scale(2.0, 0.8, 0.0);
    drawObject(gl, rectModelR, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    pushMatrix();
    transformMat.translate(1.0, -0.4, 0.0);
    transformMat.scale(3.0, 3.0, 0.0);
    drawObject(gl, circleModel, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    pushMatrix();
    transformMat.translate(-1.0, -0.4, 0.0);
    transformMat.scale(3.0, 3.0, 0.0);
    drawObject(gl, circleModel, gl.TRIANGLE_FAN, transformMat);
    popMatrix();
    //////////////////////// CAR BODY /////////////////////////

    //////////////////////// ARM  /////////////////////////
    transformMat.translate(0.0, 0.4, 0.0);
    transformMat.translate(0.0, 1.0, 0.0);
    pushMatrix();
    transformMat.scale(0.3, 2.0, 0.0);
    drawObject(gl, rectModelB, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    transformMat.translate(0.0, 1.0, 0.0);
    transformMat.translate(0.0, 0.05, 0.0);
    pushMatrix();
    transformMat.scale(1.6, 1.6, 0.0);
    drawObject(gl, circleModel, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    transformMat.translate(0.0, 0.05, 0.0);
    transformMat.rotate(45 + armNode1Angle, 0.0, 0.0, 1.0);
    transformMat.translate(0.0, 0.6, 0.0);
    pushMatrix();
    transformMat.scale(0.25, 1.0, 0.0);
    drawObject(gl, rectModelB, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    transformMat.translate(0.0, 0.5, 0.0);
    transformMat.translate(0.0, 0.05, 0.0);
    pushMatrix();
    transformMat.scale(1.5, 1.5, 0.0);
    drawObject(gl, circleModel, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    transformMat.translate(0.0, 0.05, 0.0);
    transformMat.rotate(90 + armNode2Angle, 0.0, 0.0, 1.0);
    transformMat.translate(0.0, 0.5, 0.0);
    pushMatrix();
    transformMat.scale(0.25, 0.7, 0.0);
    drawObject(gl, rectModelB, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    transformMat.translate(0.0, 0.35, 0.0);
    transformMat.translate(0.0, 0.05, 0.0);
    pushMatrix();
    transformMat.scale(1.5, 1.5, 0.0);
    drawObject(gl, circleModel, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    transformMat.rotate(45 + armNode3Angle, 0.0, 0.0, 1.0);
    transformMat.translate(0.0, 0.5, 0.0);
    pushMatrix();
    transformMat.scale(0.25, 0.7, 0.0);
    drawObject(gl, rectModelB, gl.TRIANGLE_FAN, transformMat);
    popMatrix();
    //////////////////////// ARM  /////////////////////////

    //////////////////////// CLAW /////////////////////////
    transformMat.translate(0.0, 0.35, 0.0);
    pushMatrix();
    pushMatrix();
    transformMat.scale(0.4, 0.8, 0.0);
    drawObject(gl, rectModelG, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    transformMat.translate(-0.2, -0.4, 0.0);
    transformMat.rotate(-135 - clawOpenAngle, 0.0, 0.0, 1.0);
    transformMat.translate(0.0, -0.5, 0.0);
    
    pushMatrix();
    transformMat.scale(0.1, 1.0, 0.0);
    drawObject(gl, rectModelG, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    transformMat.translate(0.0, -0.5, 0.0);
    transformMat.rotate(-45, 0.0, 0.0, 1.0);
    transformMat.translate(0.0, -0.4, 0.0);
    pushMatrix();
    transformMat.scale(0.1, 0.8, 0.0);
    drawObject(gl, rectModelG, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    popMatrix();
    transformMat.translate(0.2, -0.4, 0.0);
    transformMat.rotate(135 + clawOpenAngle, 0.0, 0.0, 1.0);
    transformMat.translate(0.0, -0.5, 0.0);

    pushMatrix();
    transformMat.scale(0.1, 1.0, 0.0);
    drawObject(gl, rectModelG, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    transformMat.translate(0.0, -0.5, 0.0);
    transformMat.rotate(45, 0.0, 0.0, 1.0);
    transformMat.translate(0.0, -0.4, 0.0);
    pushMatrix();
    transformMat.scale(0.1, 0.8, 0.0);
    drawObject(gl, rectModelG, gl.TRIANGLE_FAN, transformMat);
    var clawCornerPos = new Vector4([-0.5, -0.5, 0.0, 1.0]);
    clawCorner = transformMat.multiplyVector4(clawCornerPos);

    popMatrix();

    distance = Math.sqrt(Math.pow(clawCorner.elements[0] - circleCenter.elements[0], 2) + Math.pow(clawCorner.elements[1] - circleCenter.elements[1], 2));
    //////////////////////// CLAW /////////////////////////
    
    
    //////////////////////// OBJECT /////////////////////////

    
    if( grab == 1 ){
        var transformMatCal = new Matrix4(); 
        transformMatCal.setIdentity();
        transformMatCal = transformMatCal.multiply(transformMat);
        transformMatCal.translate(0.0, -0.4, 0.0);
        var circleCenterPos = new Vector4([0.0, 0.0 , 0.0, 1.0]);
        circleCenter = transformMatCal.multiplyVector4(circleCenterPos);


        
        transformMat.translate(0.0, -0.4, 0.0);
        // transformMat.scale(3.3, 3.3, 0.0);
        transformMat.scale(1/ ((0.3 + scale)), 1/ ((0.3 + scale)), 0.0);
        transformMat.scale(1 * ((0.3 + scale)/0.3),1 * ((0.3 + scale)/0.3), 0.0);
        pushMatrix();
        transformMat.translate(0.0, 0.13, 0.0);
        
        transformMat.scale(0.5, 0.5, 0.0);

        drawObject(gl, circleModelGrab, gl.TRIANGLE_FAN, transformMat);
        popMatrix();
    } else{
        console.log('distance: ', distance)
        if( distance < 0.1*0.5 ){
            transformMat.setIdentity();
            transformMat.scale(1 * ((0.3 + scale)/0.3),1 * ((0.3 + scale)/0.3), 0.0);
            transformMat.translate(circleCenter.elements[0], circleCenter.elements[1], 0.0);
            pushMatrix();
            transformMat.scale(0.5, 0.5, 0.0);
            console.log('circleCenter[0], circleCenter[1]: ', circleCenter.elements[0], circleCenter.elements[1])
            drawObject(gl, circleModelTouch, gl.TRIANGLE_FAN, transformMat);
            popMatrix();
            transformMat.translate(0.0, -0.13, 0.0);
        } else{
            if( grab == 2 ){
                transformMat.setIdentity();
                transformMat.scale(1 * ((0.3 + scale)/0.3),1 * ((0.3 + scale)/0.3), 0.0);
                transformMat.translate(-0.8, -0.8, 0.0); 
                pushMatrix();
                transformMat.translate(0.0, 0.13, 0.0);
                transformMat.scale(0.5, 0.5, 0.0);
                drawObject(gl, circleModel, gl.TRIANGLE_FAN, transformMat);
                popMatrix();
            } else{
                transformMat.setIdentity();
                transformMat.scale(1 * ((0.3 + scale)/0.3),1 * ((0.3 + scale)/0.3), 0.0);
                transformMat.translate(circleCenter.elements[0], circleCenter.elements[1], 0.0);
                pushMatrix();
                transformMat.scale(0.5, 0.5, 0.0);
                drawObject(gl, circleModel, gl.TRIANGLE_FAN, transformMat);
                popMatrix();
                transformMat.translate(0.0, -0.13, 0.0);
            }
        }
    }
    
    pushMatrix();
    pushMatrix();
    transformMat.scale(0.05, 0.2, 0.0);
    drawObject(gl, rectModelB , gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    transformMat.translate(0.025, 0.1, 0.0);
    transformMat.rotate(-135 - objectArmAngle, 0.0, 0.0, 1.0);
    transformMat.translate(0.0, 0.05, 0.0);
    pushMatrix();
    transformMat.scale(0.03, 0.1, 0.0);
    drawObject(gl, rectModelR, gl.TRIANGLE_FAN, transformMat);
    
    popMatrix();
    transformMat.translate( 0.0 , 0.05, 0.0);
    transformMat.rotate(40 + objectSwordAngle, 0.0, 0.0, 1.0);
    pushMatrix();
    transformMat.scale(0.1, 0.7, 0.0);
    drawObject(gl, triModel, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    transformMat.translate(0.0 , 0.4*0.7, 0.0);
    pushMatrix();
    transformMat.scale(0.3, 0.3, 0.0);
    drawObject(gl, circleModel, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    popMatrix();
    pushMatrix();
    transformMat.translate(-0.025, 0.1, 0.0);
    transformMat.rotate(135 + objectArmAngle, 0.0, 0.0, 1.0);
    transformMat.translate(0.0, 0.05, 0.0);
    pushMatrix();
    transformMat.scale(0.03, 0.1, 0.0);
    drawObject(gl, rectModelR, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    popMatrix();
    pushMatrix();

    transformMat.translate(0.025, -0.1, 0.0);
    transformMat.rotate(-135 - objectLegAngle , 0.0, 0.0, 1.0);
    transformMat.translate(0.0, 0.05, 0.0);
    pushMatrix();
    transformMat.scale(0.03, 0.1, 0.0);
    drawObject(gl, rectModelR, gl.TRIANGLE_FAN, transformMat);
    popMatrix();

    popMatrix();
    pushMatrix();
    transformMat.translate(-0.025, -0.1, 0.0);
    transformMat.rotate(135 + objectLegAngle , 0.0, 0.0, 1.0);
    transformMat.translate(0.0, 0.05, 0.0);
    pushMatrix();
    transformMat.scale(0.03, 0.1, 0.0);
    drawObject(gl, rectModelR, gl.TRIANGLE_FAN, transformMat);
    popMatrix();
 
    /////////////////////// OBJECT ARMS /////////////////////////
    popMatrix();

}   
