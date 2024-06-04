
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
     //if up arrow key is pressed
     var flapSound = document.getElementById('flap-sound');
    flapSound.playbackRate = 1.0;

     if( event.key == 'ArrowUp'){
        console.log('up')
        isFlapping = true;
        flapSound.play();
        draw_all()
     } 
     else if( event.key == 'a' || event.key == 'A'){
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
          thirdcameraX += newViewDir.elements[0] * 0.02;
          thirdcameraY += newViewDir.elements[1] * 0.02;
          thirdcameraZ += newViewDir.elements[2] * 0.02;
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
          third_view = 0;
          draw_all()
      } else if ( event.key == '3' ){  
          console.log('3')
          third_view = 1;
          draw_all();
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
  
  