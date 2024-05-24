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
var pipeMatrix5 = new Matrix4();
var pipeMatrix6 = new Matrix4();
var pipeMatrix7 = new Matrix4();
var pipeMatrix8 = new Matrix4();
var pipeMatrix9 = new Matrix4();
var pipeMatrix10 = new Matrix4();
var pipeMatrix11 = new Matrix4();
var pipeMatrix12 = new Matrix4();
var pipeMatrix13 = new Matrix4();
var pipeMatrix14 = new Matrix4();
var pipeMatrix15 = new Matrix4();
var pipeMatrix16 = new Matrix4();
var pipeMatrix17 = new Matrix4();
var pipeMatrix18 = new Matrix4();
var pipeMatrix19 = new Matrix4();
var pipeMatrix20 = new Matrix4();

//array of pipe mat
var pipeMdlMatrix = [];

var pipeGap = 0.5;


var birdScale = 0.1;


var width =5;
var pipeGapX = 3;

//generate an array of float between -2 and 2, whose size is 10
function randomPipeGapY(){
    var arr = [];
    for(var i = 0; i < 10; i++){
        arr.push(Math.random() * 4 - 2);
    }
    return arr;

}

gapYarr = randomPipeGapY();


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
    birdMatrix.scale(birdScale, birdScale, birdScale);

    //set gnd mdl
    gndMdlMatrix.setIdentity();
    gndMdlMatrix.translate(0, -5, 0);
    gndMdlMatrix.scale(100, 0.1, 100);

    //set pillar mdl
    pipeMatrix.setIdentity(); 
    pipeMatrix.translate( width + pipeXoffset, -5 - gapYarr[1], 1.1); // z off by 1.1 
    pipeMatrix.scale(0.04, 0.1, 0.04);

    pipeMatrix2.setIdentity(); 
    pipeMatrix2.rotate(180, 0, 0, 1); 
    pipeMatrix2.translate( -width - 1.8 - pipeXoffset, -5 + gapYarr[1], 1.1); // x off by 1.8
    pipeMatrix2.scale(0.04, 0.08, 0.04);

    pipeMatrix3.setIdentity(); 
    pipeMatrix3.translate( width + pipeXoffset + pipeGapX , -5 - gapYarr[2], 1.1);
    pipeMatrix3.scale(0.04, 0.08, 0.04);

    pipeMatrix4.setIdentity();
    pipeMatrix4.rotate(180, 0, 0, 1);
    pipeMatrix4.translate( -width -1.8 - pipeXoffset - pipeGapX, -5 + gapYarr[2], 1.1); 
    pipeMatrix4.scale(0.04, 0.08, 0.04);

    pipeMatrix5.setIdentity();
    pipeMatrix5.translate( width + pipeXoffset + pipeGapX * 2, -5 - gapYarr[3], 1.1);
    pipeMatrix5.scale(0.04, 0.08, 0.04);

    pipeMatrix6.setIdentity();
    pipeMatrix6.rotate(180, 0, 0, 1);
    pipeMatrix6.translate( -width -1.8 - pipeXoffset - pipeGapX * 2, -5 + gapYarr[3], 1.1);
    pipeMatrix6.scale(0.04, 0.08, 0.04);

    pipeMatrix7.setIdentity();
    pipeMatrix7.translate( width + pipeXoffset + pipeGapX * 3, -5 - gapYarr[4], 1.1);
    pipeMatrix7.scale(0.04, 0.08, 0.04);

    pipeMatrix8.setIdentity();
    pipeMatrix8.rotate(180, 0, 0, 1);
    pipeMatrix8.translate( -width -1.8 - pipeXoffset - pipeGapX * 3, -5 + gapYarr[4], 1.1);
    pipeMatrix8.scale(0.04, 0.08, 0.04);

    pipeMatrix9.setIdentity();  
    pipeMatrix9.translate( width + pipeXoffset + pipeGapX * 4, -5 - gapYarr[5], 1.1);
    pipeMatrix9.scale(0.04, 0.08, 0.04);

    pipeMatrix10.setIdentity();
    pipeMatrix10.rotate(180, 0, 0, 1);
    pipeMatrix10.translate( -width -1.8 - pipeXoffset - pipeGapX * 4, -5 + gapYarr[5], 1.1);
    pipeMatrix10.scale(0.04, 0.08, 0.04);

    pipeMatrix11.setIdentity();
    pipeMatrix11.translate( width + pipeXoffset2 , -5 - gapYarr[6], 1.1);
    pipeMatrix11.scale(0.04, 0.08, 0.04);

    pipeMatrix12.setIdentity();
    pipeMatrix12.rotate(180, 0, 0, 1);
    pipeMatrix12.translate( -width -1.8 - pipeXoffset2, -5 + gapYarr[6], 1.1);
    pipeMatrix12.scale(0.04, 0.08, 0.04);

    pipeMatrix13.setIdentity();
    pipeMatrix13.translate( width + pipeXoffset2 + pipeGapX, -5 - gapYarr[7], 1.1);
    pipeMatrix13.scale(0.04, 0.08, 0.04);

    pipeMatrix14.setIdentity();
    pipeMatrix14.rotate(180, 0, 0, 1);
    pipeMatrix14.translate( -width -1.8 - pipeXoffset2 - pipeGapX, -5 + gapYarr[7], 1.1);
    pipeMatrix14.scale(0.04, 0.08, 0.04);

    pipeMatrix15.setIdentity();
    pipeMatrix15.translate( width + pipeXoffset2 + pipeGapX * 2, -5 - gapYarr[8], 1.1);
    pipeMatrix15.scale(0.04, 0.08, 0.04);

    pipeMatrix16.setIdentity();
    pipeMatrix16.rotate(180, 0, 0, 1);
    pipeMatrix16.translate( -width -1.8 - pipeXoffset2 - pipeGapX * 2, -5 + gapYarr[8], 1.1);
    pipeMatrix16.scale(0.04, 0.08, 0.04);

    pipeMatrix17.setIdentity();
    pipeMatrix17.translate( width + pipeXoffset2 + pipeGapX * 3, -5 - gapYarr[9], 1.1);
    pipeMatrix17.scale(0.04, 0.08, 0.04);

    pipeMatrix18.setIdentity();
    pipeMatrix18.rotate(180, 0, 0, 1);
    pipeMatrix18.translate( -width -1.8 - pipeXoffset2 - pipeGapX * 3, -5 + gapYarr[9], 1.1);
    pipeMatrix18.scale(0.04, 0.08, 0.04);

    pipeMatrix19.setIdentity();
    pipeMatrix19.translate( width + pipeXoffset2 + pipeGapX * 4, -5 - gapYarr[0], 1.1);
    pipeMatrix19.scale(0.04, 0.08, 0.04);

    pipeMatrix20.setIdentity();
    pipeMatrix20.rotate(180, 0, 0, 1);
    pipeMatrix20.translate( -width -1.8 - pipeXoffset2 - pipeGapX * 4, -5 + gapYarr[0], 1.1);
    pipeMatrix20.scale(0.04, 0.08, 0.04);


}

function drawBird() {
    drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    for( var i = 1; i <= 8 ; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i, birdY + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    }

    for( var i = 1; i <= 8 ; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i, birdY + birdYoffset, birdScale * 8);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    }

}

function drawRobot() {
    drawObjectWithTexture(cube, mdlMatrix, 0.0, 0.0, 0.0, "ballTex", false);

    //celing and floor
    gl.uniform1f(program.u_textureScale, 35.0);
    drawObjectWithTexture(cube, gndMdlMatrix, 0.0, 0.0, 0.0, "groundTex", false);
    gl.uniform1f(program.u_textureScale, 1.0);
    // gndMdlMatrix.translate(0, 100, 0);
    // drawObjectWithTexture(cube, gndMdlMatrix, 0.0, 0.0, 0.0, "groundTex", false);
    
    //bird
    drawBird();

    //pipe
    drawObjectWithTexture(pipe, pipeMatrix, 0.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix2, 0.0, 0.0, 0.0, "pipeTex", false);
    
    drawObjectWithTexture(pipe, pipeMatrix3, 0.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix4, 0.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix5, 0.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix6, 0.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix7, 0.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix8, 0.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix9, 0.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix10, 0.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix11, 1.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix12, 1.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix13, 1.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix14, 1.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix15, 1.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix16, 1.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix17, 1.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix18, 1.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix19, 1.0, 0.0, 0.0, "pipeTex", false);

    drawObjectWithTexture(pipe, pipeMatrix20, 0.0, 0.0, 0.0, "pipeTex", false);

    for( var i = 0; i < 10 ; i++){
        pipeMatrix.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix2.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix2, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix3.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix3, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix4.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix4, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix5.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix5, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix6.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix6, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix7.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix7, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix8.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix8, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix9.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix9, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix10.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix10, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix11.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix11, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix12.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix12, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix13.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix13, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix14.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix14, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix15.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix15, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix16.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix16, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix17.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix17, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix18.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix18, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix19.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix19, 0.0, 0.0, 0.0, "pipeTex", false);

        pipeMatrix20.translate(0, -38, 0);
        drawObjectWithTexture(pipe, pipeMatrix20, 0.0, 0.0, 0.0, "pipeTex", false);
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