var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    void main(){
        gl_Position = a_Position;
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

// function initAttributeVariable(gl, a_attribute, buffer){
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     console.log('a_attribute:', a_attribute)
//     gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
//     gl.enableVertexAttribArray(a_attribute);
// }

// function initArrayBufferForLaterUse(gl, data, num, type) {
//     // Create a buffer object
//     var buffer = gl.createBuffer();
//     if (!buffer) {
//       console.log('Failed to create the buffer object');
//       return null;
//     }
//     // Write date into the buffer object
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
//     // Store the necessary information to assign the object to the attribute variable later
//     buffer.num = num;
//     buffer.type = type;
  
//     return buffer;
// }

// function initVertexBufferForLaterUse(gl, vertices, colors){
//     var nVertices = vertices.length / 3;
//     console.log('nVertices:', nVertices)

//     // var nVertices = 1;

//     var o = new Object();
//     o.vertexBuffer = initArrayBufferForLaterUse(gl, new Float32Array(vertices), 3, gl.FLOAT);
//     o.colorBuffer = initArrayBufferForLaterUse(gl, new Float32Array(colors), 3, gl.FLOAT);
//     if (!o.vertexBuffer || !o.colorBuffer) 
//         console.log("Error: in initVertexBufferForLaterUse(gl, vertices, colors)"); 
//     o.numVertices = nVertices;

//     gl.bindBuffer(gl.ARRAY_BUFFER, null);
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

//     return o;
// }

function main(){
    //////Get the canvas context
    var canvas = document.getElementById('webgl');

    var gl = canvas.getContext('webgl2');
    if(!gl){
        console.log('Failed to get the rendering context for WebGL');
        return ;
    }

    /////compile shader and use it
    let program = compileShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    gl.useProgram(program);

    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //mouse event
    canvas.onmousedown = function(ev){click(ev, gl, canvas, program)};
    document.onkeydown = function(ev){keydown(ev)};

}

g_points = []; // store all clicked positions
g_triangle_points = []; // store all clicked positions
g_square_points = []; // store all clicked positions
var num_points = 0 // total amount of points
var num_triangles = 0 // total amount of triangles
var num_squares = 0 // total amount of squares
var shape_type = 't'
var color_mode = 'r'

function keydown(ev){ 
    if(ev.key == 'p') {
        shape_type = 'p';
    } else if(ev.key == 't') {
        shape_type = 't';
    } else if(ev.key == 's') {
        shape_type = 's';
    } else if(ev.key == 'r') {
        color_mode = 'r';
    } else if(ev.key == 'g') {
        color_mode = 'g';
    } else if(ev.key == 'b') {
        color_mode = 'b';
    }
    console.log('shape_type:', shape_type)
    console.log('color_mode:', color_mode)
}

function click(ev, gl, canvas, program){
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
    y = (canvas.width/2 - (y - rect.top))/(canvas.height/2);

    console.log('x:', x, 'y:', y)

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var verts = [x, y, 0.0, 0.0, 0.0, 0.0] //x, y, z , r, g, b
    
    console.log('color_mode:', color_mode)
    if(color_mode == 'r'){
        verts[3] = 1.0
    } else if(color_mode == 'g'){
        // console.log('g')
        verts[4] = 1.0
    } else if(color_mode == 'b'){
        verts[5] = 1.0
    }

    if(shape_type == 'p') {
        num_points += 1;
        g_points = g_points.concat(verts);
        if(num_points > 3) {
            g_points.splice(0, 6);
            num_points -= 1;
        } 
        console.log('g_points:', g_points)
    }

    if( shape_type == 't'){ 
        num_triangles += 1;
        verts[0] += 0.1
        // verts[1] += 0.1
        g_triangle_points = g_triangle_points.concat(verts);
        // verts[0] += 0.1
        verts[1] += 0.1
        g_triangle_points = g_triangle_points.concat(verts);
        verts[0] -= 0.1
        verts[1] -= 0.1
        g_triangle_points = g_triangle_points.concat(verts);
        if(num_triangles > 3) {
            g_triangle_points.splice(0, 6 * 3);
            num_triangles -= 1;
        } 
        console.log('g_triangle_points:', g_triangle_points)
    }

    if( shape_type == 's') {
        //can I just draw a large point as a square? :(            
        //draw two triangle as a square(two of the vertices are the same), so there will be 6 vertices
        num_squares += 1;
        var arr = [+0.2, +0.1, -0.1, +0.1, -0.2, -0.4, 0, 0, +0.2, +0.4, -0.3, -0.3]
        for( var i = 0; i < 12 ; i+=2 ){
            verts[0] += arr[i]
            verts[1] += arr[i+1]
            g_square_points = g_square_points.concat(verts);
        }

        if(num_squares > 3) {
            g_square_points.splice(0, 6 * 6);
            num_squares -= 1;
        }
        console.log('g_square_points:', g_square_points)    
    }

    draw(gl, program)
}


function initBufferAndDraw( gl, program, vertice_array , num_vertices, shape){
    var vertices = new Float32Array(vertice_array);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var FSIZE = vertices.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*6, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE*6, FSIZE*3);
    gl.enableVertexAttribArray(a_Color);

    if(shape == 'p') {
        gl.drawArrays(gl.POINTS, 0, num_vertices);
    } else if(shape == 't') {
        gl.drawArrays(gl.TRIANGLES, 0, num_vertices);
    } else if(shape == 's') {
        gl.drawArrays(gl.TRIANGLES, 0, num_vertices);
    }
}

function draw(gl, program)
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    initBufferAndDraw(gl, program, g_points, num_points, 'p');
    initBufferAndDraw(gl, program, g_triangle_points, num_triangles * 3, 't');
    initBufferAndDraw(gl, program, g_square_points, num_squares * 6, 's');
    console.log('num_points:', num_points, 'num_triangles:', num_triangles, 'num_squares:', num_squares)
}


