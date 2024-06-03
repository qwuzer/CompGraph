let cube = [];
let tire = [];
let soccer = [];
let sphere = [];
let pipe = [];
let boo = [];

async function load_all_model() {
    cube = await load_one_model("./object/cube.obj");
    tire = await load_one_model("./object/tire.obj");
    soccer = await load_one_model("./object/soccer.obj");
    sphere = await load_one_model("./object/sphere.obj");
    pipe = await load_one_model("./object/pipe.obj");
    boo = await load_one_model("./object/boo.obj");
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

//long part of the pipe, I am def going to regret this naming convention ==
var pipeBottom = new Matrix4();
var pipe2Bottom = new Matrix4();
var pipe3Bottom = new Matrix4();
var pipe4Bottom = new Matrix4();
var pipe5Bottom = new Matrix4();
var pipe6Bottom = new Matrix4();
var pipe7Bottom = new Matrix4();
var pipe8Bottom = new Matrix4();
var pipe9Bottom = new Matrix4();
var pipe10Bottom = new Matrix4();
var pipe11Bottom = new Matrix4();
var pipe12Bottom = new Matrix4();
var pipe13Bottom = new Matrix4();
var pipe14Bottom = new Matrix4();
var pipe15Bottom = new Matrix4();
var pipe16Bottom = new Matrix4();
var pipe17Bottom = new Matrix4();
var pipe18Bottom = new Matrix4();
var pipe19Bottom = new Matrix4();
var pipe20Bottom = new Matrix4();


var pipeBottomFromLight = new Matrix4();
var pipe2BottomFromLight = new Matrix4();
var pipe3BottomFromLight = new Matrix4();
var pipe4BottomFromLight = new Matrix4();
var pipe5BottomFromLight = new Matrix4();
var pipe6BottomFromLight = new Matrix4();
var pipe7BottomFromLight = new Matrix4();
var pipe8BottomFromLight = new Matrix4();
var pipe9BottomFromLight = new Matrix4();
var pipe10BottomFromLight = new Matrix4();
var pipe11BottomFromLight = new Matrix4();
var pipe12BottomFromLight = new Matrix4();
var pipe13BottomFromLight = new Matrix4();
var pipe14BottomFromLight = new Matrix4();
var pipe15BottomFromLight = new Matrix4();
var pipe16BottomFromLight = new Matrix4();
var pipe17BottomFromLight = new Matrix4();
var pipe18BottomFromLight = new Matrix4();
var pipe19BottomFromLight = new Matrix4();
var pipe20BottomFromLight = new Matrix4();



//shadow matrix
var gndMd1FromLight = new Matrix4();
var pipeMdl1FromLight = new Matrix4();
var pipeMdl2FromLight = new Matrix4();
var pipeMdl3FromLight = new Matrix4();
var pipeMdl4FromLight = new Matrix4();
var pipeMdl5FromLight = new Matrix4();
var pipeMdl6FromLight = new Matrix4();
var pipeMdl7FromLight = new Matrix4();
var pipeMdl8FromLight = new Matrix4();
var pipeMdl9FromLight = new Matrix4();
var pipeMdl10FromLight = new Matrix4();
var pipeMdl11FromLight = new Matrix4();
var pipeMdl12FromLight = new Matrix4();
var pipeMdl13FromLight = new Matrix4();
var pipeMdl14FromLight = new Matrix4();
var pipeMdl15FromLight = new Matrix4();
var pipeMdl16FromLight = new Matrix4();
var pipeMdl17FromLight = new Matrix4();
var pipeMdl18FromLight = new Matrix4();
var pipeMdl19FromLight = new Matrix4();
var pipeMdl20FromLight = new Matrix4();

//boo 
var booMdlMatrix = new Matrix4();

//array of pipe mat
// var pipeGap = 0.5;

var birdScale = 0.05;

var booSize = 0.003;

var width = 5;
var pipeGapX = 4;



//generate an array of float between -2 and 2, whose size is 10
function randomPipeGapY(){
    var arr = [];
    for(var i = 0; i < 10; i++){
        arr.push(Math.random() * 4 - 2);
    }
    return arr;

}

//random number between 0 and 9
var booOffset = Math.random() * 9;

gapYarr = randomPipeGapY();


function init_mdl(){
    //set bird mdl
    if(isFlapping){
        birdYoffset += 0.5;
        firstcameraY += 0.5;
        isFlapping = false;
    } 

    birdMatrix.setIdentity();   
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // console.log("BirdY: " + (birdY + -birdScale * 11 * 2 + birdYoffset));

    //set gnd mdl
    gndMdlMatrix.setIdentity();
    gndMdlMatrix.translate(0, -5, 0);
    gndMdlMatrix.scale(100, 0.1, 100);

    //set pipe mdl
    pipeMatrix.setIdentity(); 
    pipeMatrix.translate( width + pipeXoffset, -5 - gapYarr[1], 1.1); // z off by 1.1 
    pipeMatrix.scale(0.04, 0.1, 0.04);
    // console.log("Y: " + (-5 - gapYarr[1] + 6 ));
    
    mdlMatrix.setIdentity();
    mdlMatrix.translate(width + pipeXoffset, -5 - gapYarr[1] + 3, 1.1);


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

        //boo
        booMdlMatrix.setIdentity();
        booMdlMatrix.translate (width + pipeXoffset + 0.8 + pipeGapX * 2 , -5 - gapYarr[3] + 2, 1.1 - 1.2);
        //if comes to birdX, ygoes up
        if(width + pipeXoffset + 0.8 + pipeGapX * 2 < 2.3 ){
            booMdlMatrix.translate(0, 1.4, 0);
        }
        booMdlMatrix.rotate(-90, 0,1,0);
        booMdlMatrix.scale(booSize, booSize, booSize);
    

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

    //lose
    for( var i = 1; i < 6; i++){
        var j = i - 1;
        if( (-5 - gapYarr[i] + 6.6 < birdY + birdYoffset && (width + pipeXoffset + pipeGapX * j  <= 0.05 && width + pipeXoffset + pipeGapX * j >= 0 )) 
            || (-5 - gapYarr[i] + 3.4 > birdY + -birdScale * 11 * 2 + birdYoffset  && (width + pipeXoffset + pipeGapX * j<= 0.05 && width + pipeXoffset + pipeGapX * j>= 0 ))){
            end = true;
        }
    }
    for( var i = 6; i < 11; i++){
        var j = 0;
        switch(i){
            case 6:
                j = 0;
                break;
            case 7:
                j = 1;
                break;
            case 8:
                j = 2;
                break;
            case 9:
                j = 3;
                break;
            case 10:
                j = 4;
                break;
            default:
                break;
        }
        if( i == 10 ) i = 0;
        if( (-5 - gapYarr[i] + 6.6 < birdY + birdYoffset && (width + pipeXoffset2 + pipeGapX * j <= 0.05 && width + pipeXoffset2 + pipeGapX * j >= 0 )) 
            || (-5 - gapYarr[i] + 3.4> birdY + -birdScale * 11 * 2 + birdYoffset  && (width + pipeXoffset2 + pipeGapX * j <= 0.05 && width + pipeXoffset2 + pipeGapX * j>= 0 ))){
            end = true;
        }
        if( i == 0 ) break;
    }


    //points
    for(var i = 0; i < 5; i++ ){
        if(width + pipeXoffset + pipeGapX * i <= 0.05 && width + pipeXoffset + pipeGapX * i >= 0){
            points += 1;
        }
    }

   for( var i = 0; i < 5; i++){
        if(width + pipeXoffset2 + pipeGapX * i <= 0.05 && width + pipeXoffset2 + pipeGapX * i >= 0){
            points += 1;
        }
    }


    //set pipe mdl for bottom part
    pipeBottom.setIdentity();
    pipeBottom.translate( width + pipeXoffset, -5 - gapYarr[1] - 39, 1.1);
    pipeBottom.scale(0.04, 1, 0.04);

    pipe2Bottom.setIdentity();
    pipe2Bottom.rotate(180, 0, 0, 1); 
    pipe2Bottom.translate( -width - 1.8 - pipeXoffset, -5 + gapYarr[1] - 39, 1.1);
    pipe2Bottom.scale(0.04, 1, 0.04);

    pipe3Bottom.setIdentity();
    pipe3Bottom.translate( width + pipeXoffset + pipeGapX , -5 - gapYarr[2] - 39, 1.1);
    pipe3Bottom.scale(0.04, 1, 0.04);
    
    pipe4Bottom.setIdentity();
    pipe4Bottom.rotate(180, 0, 0, 1);
    pipe4Bottom.translate( -width -1.8 - pipeXoffset - pipeGapX, -5 + gapYarr[2] - 39, 1.1);
    pipe4Bottom.scale(0.04, 1, 0.04);

    pipe5Bottom.setIdentity();
    pipe5Bottom.translate( width + pipeXoffset + pipeGapX * 2, -5 - gapYarr[3] - 39, 1.1);
    pipe5Bottom.scale(0.04, 1, 0.04);

    pipe6Bottom.setIdentity();
    pipe6Bottom.rotate(180, 0, 0, 1);
    pipe6Bottom.translate( -width -1.8 - pipeXoffset - pipeGapX * 2, -5 + gapYarr[3] - 39, 1.1);
    pipe6Bottom.scale(0.04, 1, 0.04);

    pipe7Bottom.setIdentity();
    pipe7Bottom.translate( width + pipeXoffset + pipeGapX * 3, -5 - gapYarr[4] - 39, 1.1);
    pipe7Bottom.scale(0.04, 1, 0.04);

    pipe8Bottom.setIdentity();
    pipe8Bottom.rotate(180, 0, 0, 1);
    pipe8Bottom.translate( -width -1.8 - pipeXoffset - pipeGapX * 3, -5 + gapYarr[4] - 39, 1.1);
    pipe8Bottom.scale(0.04, 1, 0.04);

    pipe9Bottom.setIdentity();
    pipe9Bottom.translate( width + pipeXoffset + pipeGapX * 4, -5 - gapYarr[5] - 39, 1.1);
    pipe9Bottom.scale(0.04, 1, 0.04);

    pipe10Bottom.setIdentity();
    pipe10Bottom.rotate(180, 0, 0, 1);
    pipe10Bottom.translate( -width -1.8 - pipeXoffset - pipeGapX * 4, -5 + gapYarr[5] - 39, 1.1);
    pipe10Bottom.scale(0.04, 1, 0.04);

    pipe11Bottom.setIdentity();
    pipe11Bottom.translate( width + pipeXoffset2 , -5 - gapYarr[6] - 39, 1.1);
    pipe11Bottom.scale(0.04, 1, 0.04);

    pipe12Bottom.setIdentity();
    pipe12Bottom.rotate(180, 0, 0, 1);
    pipe12Bottom.translate( -width -1.8 - pipeXoffset2, -5 + gapYarr[6] - 39, 1.1);
    pipe12Bottom.scale(0.04, 1, 0.04);

    pipe13Bottom.setIdentity();
    pipe13Bottom.translate( width + pipeXoffset2 + pipeGapX, -5 - gapYarr[7] - 39, 1.1);
    pipe13Bottom.scale(0.04, 1, 0.04);

    pipe14Bottom.setIdentity();
    pipe14Bottom.rotate(180, 0, 0, 1);
    pipe14Bottom.translate( -width -1.8 - pipeXoffset2 - pipeGapX, -5 + gapYarr[7] - 39, 1.1);
    pipe14Bottom.scale(0.04, 1, 0.04);

    pipe15Bottom.setIdentity();
    pipe15Bottom.translate( width + pipeXoffset2 + pipeGapX * 2, -5 - gapYarr[8] - 39, 1.1);
    pipe15Bottom.scale(0.04, 1, 0.04);

    pipe16Bottom.setIdentity();
    pipe16Bottom.rotate(180, 0, 0, 1);
    pipe16Bottom.translate( -width -1.8 - pipeXoffset2 - pipeGapX * 2, -5 + gapYarr[8] - 39, 1.1);
    pipe16Bottom.scale(0.04, 1, 0.04);

    pipe17Bottom.setIdentity();
    pipe17Bottom.translate( width + pipeXoffset2 + pipeGapX * 3, -5 - gapYarr[9] - 39, 1.1);
    pipe17Bottom.scale(0.04, 1, 0.04);

    pipe18Bottom.setIdentity();
    pipe18Bottom.rotate(180, 0, 0, 1);
    pipe18Bottom.translate( -width -1.8 - pipeXoffset2 - pipeGapX * 3, -5 + gapYarr[9] - 39, 1.1);
    pipe18Bottom.scale(0.04, 1, 0.04);

    pipe19Bottom.setIdentity();
    pipe19Bottom.translate( width + pipeXoffset2 + pipeGapX * 4, -5 - gapYarr[0] - 39, 1.1);
    pipe19Bottom.scale(0.04, 1, 0.04);
    
    pipe20Bottom.setIdentity();
    pipe20Bottom.rotate(180, 0, 0, 1);
    pipe20Bottom.translate( -width -1.8 - pipeXoffset2 - pipeGapX * 4, -5 + gapYarr[0] - 39, 1.1);
    pipe20Bottom.scale(0.04, 1, 0.04);

}

function drawAllShadows(){
    gndMd1FromLight = drawOneObjectOnShadowfbo(cube, gndMdlMatrix);
    pipeMdl1FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix);
    pipeMdl2FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix2);
    pipeMdl3FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix3);
    pipeMdl4FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix4);
    pipeMdl5FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix5);
    pipeMdl6FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix6);
    pipeMdl7FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix7);
    pipeMdl8FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix8);
    pipeMdl9FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix9);
    pipeMdl10FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix10);
    pipeMdl11FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix11);
    pipeMdl12FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix12);
    pipeMdl13FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix13);
    pipeMdl14FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix14);
    pipeMdl15FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix15);
    pipeMdl16FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix16);
    pipeMdl17FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix17);
    pipeMdl18FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix18);
    pipeMdl19FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix19);
    pipeMdl20FromLight = drawOneObjectOnShadowfbo(pipe, pipeMatrix20);


    pipeBottomFromLight = drawOneObjectOnShadowfbo(pipe, pipeBottom);
    pipe2BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe2Bottom);
    pipe3BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe3Bottom);
    pipe4BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe4Bottom);
    pipe5BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe5Bottom);
    pipe6BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe6Bottom);
    pipe7BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe7Bottom);
    pipe8BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe8Bottom);
    pipe9BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe9Bottom);
    pipe10BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe10Bottom);
    pipe11BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe11Bottom);
    pipe12BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe12Bottom);
    pipe13BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe13Bottom);
    pipe14BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe14Bottom);
    pipe15BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe15Bottom);
    pipe16BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe16Bottom);
    pipe17BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe17Bottom);
    pipe18BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe18Bottom);
    pipe19BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe19Bottom);
    pipe20BottomFromLight = drawOneObjectOnShadowfbo(pipe, pipe20Bottom);
}


function drawRobot( vpMatrix ) {
    gl.useProgram(program); 
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

    //center 
    // drawObjectWithTexture( boo, booMdlMatrix, vpMatrix, gndMd1FromLight, cur_cameraX, cur_cameraY, cur_cameraZ, "booTex")

    //floor
    gl.uniform1f(program.u_textureScale, 35.0);
    drawObjectWithTexture(cube, gndMdlMatrix, vpMatrix, gndMd1FromLight, cur_cameraX, cur_cameraY, cur_cameraZ, "groundTex");
    gl.uniform1f(program.u_textureScale, 1.0);

    
    //bird1
    drawBird( vpMatrix, birdMatrix, cur_cameraX, cur_cameraY, cur_cameraZ);
    
    //test
    // drawObjectWithTexture(cube, mdlMatrix, vpMatrix, pipeMdl1FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");

    //pipe
    drawObjectWithTexture(pipe, pipeMatrix, vpMatrix, pipeMdl1FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeBottom, vpMatrix, pipeBottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix2, vpMatrix, pipeMdl2FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe2Bottom, vpMatrix, pipe2BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix3, vpMatrix, pipeMdl3FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe3Bottom, vpMatrix, pipe3BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix4, vpMatrix, pipeMdl4FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe4Bottom, vpMatrix, pipe4BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix5, vpMatrix, pipeMdl5FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe5Bottom, vpMatrix, pipe5BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix6, vpMatrix, pipeMdl6FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe6Bottom, vpMatrix, pipe6BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix7, vpMatrix, pipeMdl7FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe7Bottom, vpMatrix, pipe7BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix8, vpMatrix, pipeMdl8FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe8Bottom, vpMatrix, pipe8BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix9, vpMatrix, pipeMdl9FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe9Bottom, vpMatrix, pipe9BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix10, vpMatrix, pipeMdl10FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe10Bottom, vpMatrix, pipe10BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix11, vpMatrix, pipeMdl11FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe11Bottom, vpMatrix, pipe11BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix12, vpMatrix, pipeMdl12FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe12Bottom, vpMatrix, pipe12BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix13, vpMatrix, pipeMdl13FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe13Bottom, vpMatrix, pipe13BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix14, vpMatrix, pipeMdl14FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe14Bottom, vpMatrix, pipe14BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix15, vpMatrix, pipeMdl15FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe15Bottom, vpMatrix, pipe15BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix16, vpMatrix, pipeMdl16FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe16Bottom, vpMatrix, pipe16BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix17, vpMatrix, pipeMdl17FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe17Bottom, vpMatrix, pipe17BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix18, vpMatrix, pipeMdl18FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe18Bottom, vpMatrix, pipe18BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix19, vpMatrix, pipeMdl19FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe19Bottom, vpMatrix, pipe19BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipeMatrix20, vpMatrix, pipeMdl20FromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");
    drawObjectWithTexture(pipe, pipe20Bottom, vpMatrix, pipe20BottomFromLight, cur_cameraX, cur_cameraY, cur_cameraZ,"pipeTex");


    QuadMdlMatrix.setIdentity();
    QuadMdlMatrix.translate(-3, 1.2, 3);
    QuadMdlMatrix.scale(0.5, 0.5, 0.5);
    
}

var birdCollisionMat = new Matrix4();

function drawBird( vpMatrix, birdMatrix, cur_cameraX, cur_cameraY, cur_cameraZ) {
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    // drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);
    


    //first row
    for( var i = 0; i <= 5 ; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2, birdY + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
        drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    //second row
    for( var i = 1; i <= 2 ; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(-birdScale * i * 2,birdY + -birdScale * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
        drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    for( var i = 0; i <= 2 ; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 1,1,0, false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 3 * 2, birdY + -birdScale * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = 4; i <= 5 ; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 1,1,1 ,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,1, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 6* 2, birdY + -birdScale * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);


    //thrid row
    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * -3 * 2, birdY + -birdScale * 2 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);


    for( var i = -2; i <= 1 ; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 2 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 1,1,0 ,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 2 * 2, birdY + -birdScale * 2 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = 3; i <= 6 ; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 2 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 1,1,1 ,false);   
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,1, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 7 * 2, birdY + -birdScale * 2 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    //fourth row
    for( var i = -2; i >= -5 ; i--){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 3 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    for( var i = -1; i <= 1; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 3 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,1,1,0,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 2 * 2, birdY + -birdScale * 3 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = 3; i <= 5; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 3 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,1,1,1,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,1, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 6 * 2, birdY + -birdScale * 3 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0,0,0.2, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0,0,0.2, cur_cameraX, cur_cameraY, cur_cameraZ);

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 7 * 2, birdY + -birdScale * 3 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 1,1,1, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 1,1,1, cur_cameraX, cur_cameraY, cur_cameraZ);

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 8 * 2, birdY + -birdScale * 3 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    //fifth row
    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * -6 * 2, birdY + -birdScale * 4 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = -1; i >= -5; i--){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 4 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,1,1,0,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * -1 * 2, birdY + -birdScale * 4 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = 0; i <= 1; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 4 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,1,1,0,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 2 * 2, birdY + -birdScale * 4 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = 3; i <= 5; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 4 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,1,1,1,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,1, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 6 * 2, birdY + -birdScale * 4 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0,0,0.2, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0,0,0.2, cur_cameraX, cur_cameraY, cur_cameraZ);

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 7 * 2, birdY + -birdScale * 4 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 1,1,1, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 1,1,1, cur_cameraX, cur_cameraY, cur_cameraZ);

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 8 * 2, birdY + -birdScale * 4 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    //sixth row
    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * -6 * 2, birdY + -birdScale * 5 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = -1; i >= -5; i--){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 5 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,1,1,0,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 0 * 2, birdY + -birdScale * 5 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = 1; i <= 2; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 5 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,1,1,0,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 3 * 2, birdY + -birdScale * 5 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = 4; i <= 7; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 5 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,1,1,1,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,1, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 8 * 2, birdY + -birdScale * 5 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    //seventh row
    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * -6 * 2, birdY + -birdScale * 6 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = -1; i >= -5; i--){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 6 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,1,1,0,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 0 * 2, birdY + -birdScale * 6 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = 1; i <= 3; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 6 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,1,1,0,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    for( var i = 4; i <= 9; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 6 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
        drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    //eighth row
    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * -5 * 2, birdY + -birdScale * 7 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = -2; i >= -4; i--){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 7 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,1,1,0,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * -1 * 2, birdY + -birdScale * 7 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = 0; i <= 2; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 7 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,1,1,0,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 3 * 2, birdY + -birdScale * 7 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = 4; i <= 9; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 7 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 0.7,0,0, false);
        drawOneObject( cube, birdMatrix, vpMatrix, 0.7,0,0, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 10 * 2, birdY + -birdScale * 7 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    //ninth row
    for( var i = -2; i >= -4; i--){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 8 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    for( var i = 1; i >= -1; i--){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 8 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 1,1,0.5,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0.5, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 2 * 2, birdY + -birdScale * 8 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 3 * 2, birdY + -birdScale * 8 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 1,0,0 , false);
    drawOneObject( cube, birdMatrix, vpMatrix, 1,0,0, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = 4; i <= 9 ; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 8 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    //tenth row
    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * -4 * 2, birdY + -birdScale * 9 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);


    for( var i = 2; i >= -3; i--){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 9 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 1,1,0.5,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0.5, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 3 * 2, birdY + -birdScale * 9 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    for( var i = 4; i <= 9; i++){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 9 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 0.7,0,0, false);
        drawOneObject( cube, birdMatrix, vpMatrix, 0.7,0,0, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    birdMatrix.setIdentity();
    birdMatrix.translate(birdScale * 9 * 2, birdY + -birdScale * 9 * 2 + birdYoffset, 0);
    birdMatrix.scale(birdScale, birdScale, birdScale);
    // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078, false);
    drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);

    //eleventh row
    for( var i = -2; i >= -3; i--){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 10 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 0.4, 0.239, 0.078,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    for( var i = 3; i >= -1; i--){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 10 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix, 1,1,0.5,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 1,1,0.5, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

    for( var i = 8; i >= 4; i--){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 10 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,0.4, 0.239, 0.078,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);
        birdCollisionMat = birdMatrix
    }

    


    //twelfth row
    for( var i = 3; i >= -1; i--){
        birdMatrix.setIdentity();
        birdMatrix.translate(birdScale * i * 2,birdY + -birdScale * 11 * 2 + birdYoffset, 0);
        birdMatrix.scale(birdScale, birdScale, birdScale);
        // drawOneObject(cube, birdMatrix,0.4, 0.239, 0.078,false);
        drawOneObject( cube, birdMatrix, vpMatrix, 0.4, 0.239, 0.078, cur_cameraX, cur_cameraY, cur_cameraZ);
    }

}


