let cube = [];
let tire = [];
let soccer = [];

async function load_all_model() {
    cube = await load_one_model("./object/cube.obj");
    tire = await load_one_model("./object/tire.obj");
    soccer = await load_one_model("./object/soccer.obj");
}

let mdlMatrix = new Matrix4();
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

var clawCorner = new Vector4([0.0, 0.0, 0.0, 1.0]);
var objVer = new Vector4([-0.5 * 5, 0.2 * 5, 0.0, 1.0]);
var grab = 2; //grab: 1, not grab: -1, init: 2
var distance = 0;

var QuadMdlMatrix = new Matrix4();

function drawRobot() {
    QuadMdlMatrix.setIdentity();
    QuadMdlMatrix.translate(-3, 1.2, 3);
    QuadMdlMatrix.scale(0.5, 0.5, 0.5);
    

    //ground
    mdlMatrix.setIdentity();
    mdlMatrix.scale(4, 0.2, 4);
    drawObjectWithTexture(cube, mdlMatrix, 0.0, 0.0, 0.0, "groundTex", false);


    //light
    mdlMatrix.setIdentity();
    mdlMatrix.translate(3,3,2);
    mdlMatrix.scale(0.1, 0.1, 0.1);
    drawOneObject(cube, mdlMatrix, 1.0, 1.0, 0.0);


    //robot
    mdlMatrix.setIdentity();
    mdlMatrix.scale(0.4, 0.4, 0.4);
    mdlMatrix.rotate(rotateAngle1, 0, 1, 0);
    
    mdlMatrix.translate(2.0 + bodyXMove, 2, 0 - bodyYMove);
    pushMatrix();
    mdlMatrix.scale(1, 1, 1);
    drawOneObject(cube, mdlMatrix, 0.0 , 0.4, 0.0);
    popMatrix();

    // #region ------------------------ tires ------------------------ 
    pushMatrix();//1
    pushMatrix();//2
    pushMatrix();//3
    pushMatrix();//4
    mdlMatrix.translate(1.2, -1.5, 1);
    pushMatrix();
    // mdlMatrix.rotate(bodyXMove * 100, 0, 1, 0);
    mdlMatrix.scale(0.6, 0.6, 0.6);
    drawObjectWithTexture(tire, mdlMatrix, 0.0, 0.0, 0.0, "tireTex");
    popMatrix();
    popMatrix();//1
    mdlMatrix.translate(1.2, -1.5, -1);
    pushMatrix();
    mdlMatrix.scale(0.6, 0.6, 0.6);
    drawObjectWithTexture(tire, mdlMatrix, 0.0, 0.0, 0.0, "tireTex");
    popMatrix();
    popMatrix();//2
    mdlMatrix.translate(-1.2, -1.5, -1);
    pushMatrix();
    mdlMatrix.scale(0.6, 0.6, 0.6);
    drawObjectWithTexture(tire, mdlMatrix, 0.0, 0.0, 0.0, "tireTex");
    popMatrix();
    popMatrix();//3
    mdlMatrix.translate(-1.2, -1.5, 1);
    pushMatrix();
    mdlMatrix.scale(0.6, 0.6, 0.6);
    drawObjectWithTexture(tire, mdlMatrix, 0.0, 0.0, 0.0, "tireTex");
    popMatrix();
    popMatrix();//4
    //#endregion ------------------------ tires ------------------------ 

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


    //#region ------------------------ claws ------------------------ 
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
    //#region ------------------------ claws ------------------------ 

    distance = Math.sqrt(Math.pow(clawCorner.elements[0] - objVer.elements[0], 2) + Math.pow(clawCorner.elements[1] - objVer.elements[1], 2) + Math.pow(clawCorner.elements[2] - objVer.elements[2], 2));


    if( grab == 1 ){
        mdlMatrix.translate(0.0, -2.5, 0.0);
        var objPos = new Vector4([-0.5, 0.2, 0.0, 1.0]);
        objVer = mdlMatrix.multiplyVector4(objPos);
        pushObj();
        mdlMatrix.rotate(rotateAngle2, 0, 1, 0);
        pushMatrix();
        mdlMatrix.scale(2.5, 2.5, 2.5);
        mdlMatrix.scale(5,5,5);
        drawObjectWithTexture(soccer, mdlMatrix, 0.0, 0.0, 0.0, "goldTex", false);
        popMatrix();
    } else{
      if( distance < 0.8 ){
          console.log("objstack length: " + objStack.length)
          console.log("distance: " + distance)
          if( objStack.length != 0){
              console.log("pop");
              popObj();
              pushObj();
              mdlMatrix.scale(2.5, 2.5, 2.5);
              mdlMatrix.scale(5,5,5);
          } else{
                mdlMatrix.setIdentity();
                mdlMatrix.translate(-0.5, 0.2, 0);
                mdlMatrix.scale(5,5,5);
          }

          mdlMatrix.rotate(rotateAngle2, 0, 1, 0);
          console.log(objVer.elements);
          drawObjectWithTexture(soccer, mdlMatrix, 0.0, 0.0, 0.0, "goldTex", false);
      } else {
          if( grab == 2 ){
              mdlMatrix.setIdentity();
              mdlMatrix.translate(-0.5, 0.2, 0);
              mdlMatrix.scale(5,5,5);
              mdlMatrix.rotate(rotateAngle2, 0, 1, 0);
              pushMatrix();
              drawObjectWithTexture(soccer, mdlMatrix, 0.0, 0.0, 0.0, "ballTex", false);
              popMatrix();
          } else {
              mdlMatrix.setIdentity();
              // mdlMatrix.translate(objVer.elements[0], objVer.elements[1], objVer.elements[2]);
              // mdlMatrix.scale(0.4, 0.4, 0.4);
              console.log("grab: " + grab);
              popObj();
              pushObj();
              mdlMatrix.rotate(rotateAngle2, 0, 1, 0);
              pushMatrix();
                mdlMatrix.scale(2.5, 2.5, 2.5);
                mdlMatrix.scale(5,5,5);
                drawObjectWithTexture(soccer, mdlMatrix, 0.0, 0.0, 0.0, "ballTex", false);
              popMatrix();
          }
      }
    }
}

