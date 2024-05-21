let cube = [];
let tire = [];
let soccer = [];
let sphere = [];
let pipe = [];

async function load_all_model() {
    cube = await load_one_model("./object/cube.obj");
    tire = await load_one_model("./object/tire.obj");
    soccer = await load_one_model("./object/soccer.obj");
    sphere = await load_one_model("./object/sphere.obj");
    pipe = await load_one_model("./object/pipe.obj");
}


var mdlMatrix = new Matrix4();
var QuadMdlMatrix = new Matrix4();
var gndMdlMatrix = new Matrix4();
var birdMatrix = new Matrix4();
var pipeMatrix = new Matrix4();
var pipeMatrix2 = new Matrix4();
var pipeMatrix3 = new Matrix4();
var pipeMatrix4 = new Matrix4();

//array of pipe mat
var pipeMdlMatrix = [];



var pipeGap = 0.5;


function init_mdl(){

    //center of the map
    mdlMatrix.setIdentity();
    mdlMatrix.scale(0.5, 0.5, 0.5);


    //set bird mdl
    if(isFlapping){
        birdYoffset += 0.5;
        isFlapping = false;
    } 

    birdMatrix.setIdentity();   
    birdMatrix.translate(birdX, birdY + birdYoffset, birdZ);
    birdMatrix.scale(0.2, 0.2, 0.2);


    //set gnd mdl
    gndMdlMatrix.setIdentity();
    gndMdlMatrix.translate(0, -5, 0);
    gndMdlMatrix.scale(100, 0.1, 100);


    //set pillar mdl
    pipeMatrix.setIdentity(); 
    pipeMatrix.translate(0 + pipeXoffset, -5, 1.1); // z off by 1.1 
    pipeMatrix.scale(0.04, 0.1, 0.04);

    pipeMatrix2.setIdentity(); 
    pipeMatrix2.rotate(180, 0, 0, 1); 
    pipeMatrix2.translate(-1.8 - pipeXoffset, -5, 1.1); // x off by 1.8
    pipeMatrix2.scale(0.04, 0.08, 0.04);

    pipeMatrix3.setIdentity(); 
    pipeMatrix3.translate(0 + pipeXoffset + 3, -5 + pipeGap, 1.1);
    pipeMatrix3.scale(0.04, 0.08, 0.04);

    pipeMatrix4.setIdentity();
    pipeMatrix4.rotate(180, 0, 0, 1);
    pipeMatrix4.translate(-1.8 - pipeXoffset - 3, -5 - pipeGap, 1.1); 
    pipeMatrix4.scale(0.04, 0.08, 0.04);




}

function drawRobot() {
    drawObjectWithTexture(cube, mdlMatrix, 0.0, 0.0, 0.0, "ballTex", false);

    //celing and floor
    drawObjectWithTexture(cube, gndMdlMatrix, 0.0, 0.0, 0.0, "groundTex", false);
    // gndMdlMatrix.translate(0, 100, 0);
    // drawObjectWithTexture(cube, gndMdlMatrix, 0.0, 0.0, 0.0, "groundTex", false);
    
    drawObjectWithTexture(sphere, birdMatrix, 0.0, 0.0, 0.0, "ballTex", false);

    drawObjectWithTexture(pipe, pipeMatrix, 0.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix2, 0.0, 0.0, 0.0, "pipeTex", false);

    for( var i = 0; i < 10 ; i++){
        pipeMatrix2.translate(0, -40, 0);
        drawObjectWithTexture(pipe, pipeMatrix2, 0.0, 0.0, 0.0, "pipeTex", false);
    }
    
    drawObjectWithTexture(pipe, pipeMatrix3, 0.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix4, 0.0, 0.0, 0.0, "pipeTex", false);

    for( var i = 0; i < 10 ; i++){
        pipeMatrix4.translate(0, -40, 0);
        drawObjectWithTexture(pipe, pipeMatrix4, 0.0, 0.0, 0.0, "pipeTex", false);
    }


    QuadMdlMatrix.setIdentity();
    QuadMdlMatrix.translate(-3, 1.2, 3);
    QuadMdlMatrix.scale(0.5, 0.5, 0.5);
    
}

//gnd
// const gridSize = 15;
// const blockSize = 0.4;
// const maxHeight = 0.2; // Height difference of one block

// for (let x = 0; x < gridSize; x++) {
//   for (let z = 0 ; z < gridSize; z++) {
//     // Generate height using a noise function or any height map
//     const height = Math.sin(x * 0.5) * Math.cos(z * 0.5) * maxHeight;
    
//     // Set the model matrix for each block
//     gndMdlMatrix.setIdentity();
//     gndMdlMatrix.translate(-2, 0, -1); 
//     gndMdlMatrix.translate(x * blockSize, height, z * blockSize); // Translate on x, height on y, and z axes
//     gndMdlMatrix.scale(blockSize, blockSize, blockSize);
    
//     // Draw the block with the texture
//     drawObjectWithTexture(cube, gndMdlMatrix, 0.0, 0.0, 0.0, "groundTex", false);
//   }
// }