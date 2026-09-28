p5.disableFriendlyErrors = true; // Disables the Friendly Error System


let ptCentre;
let goldenAngle = 137.507764;

let w;
let h;

function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h);
  
  ptCentre = createVector(w/2, h/2);
  pt = new Phyllotaxis(ptCentre, goldenAngle, 10, 8, 20000);
  
  lj = new Lissajous(w, h);
}

function draw() {
  background(200, 0, 200);
  pt.update();
  lj.update();
}

// Lissajous.js

// in the form:
// x = cos(a*t)
// y = sin(b*t)

class Lissajous {
  constructor(w, h) { 
    this.w = w;
    this.h = h;
    
    // Lissajous params
    this.a = 3;
    this.b = 2;
    this.delta = HALF_PI;
    this.scaleX = 300;
    this.scaleY = 250;
 
    // MOUSE POSITIONS
    this.history = [];
    this.maxHistory = 6;
    this.prevX = null;
    this.prevY = null;
    
    // CAT POSITIONS
    this.catHistory = [];
    this.maxCatHistory = 10;
    this.catPrevX = null;
    this.catPrevY = null;
  }
  
  update() {
    let t = frameCount * 1.5;
    
    let x = this.w/2 + this.scaleX * sin(this.a * t + this.delta);
    let y = this.h/2 + this.scaleY * sin(this.b * t);
    
    this.history.push({x: x, y: y});
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    
    t = frameCount * 1.25;
    let xCat = this.w/2 + this.scaleX * sin(this.a * t + this.delta);
    let yCat = this.h/2 + this.scaleY * sin(this.b * t);
    
    this.catHistory.push({x: xCat, y: yCat});
    if (this.catHistory.length > this.maxCatHistory) {
      this.catHistory.shift();
    }
    
    this.drawTrail("mouse");
    this.drawMouse(x, y);
    
    this.drawTrail("cat");
    this.drawCat(xCat, yCat);
  }
  
  drawTrail(creature) {
    let alpha;
    let p;
    
    if (creature == "mouse") {
      noFill();
      strokeWeight(10);
      
      beginShape();
      for (let i = 0; i < this.history.length; i++) {
        p = this.history[i];
        alpha = map(i, 0, this.history.length, 0, 255);
        stroke(255, 255, 255, alpha);
        vertex(p.x, p.y);
      }
      endShape();
    }
    
    else if (creature == "cat") {
      noFill();
      strokeWeight(10);
      
      beginShape();
      for (let i = 0; i < this.catHistory.length; i++) {
        p = this.catHistory[i];
        alpha = map(i, 0, this.catHistory.length, 0, 255);
        stroke(255, 255, 255, alpha);
        vertex(p.x, p.y);
      }
      endShape();
    }
  }
  
  drawMouse(x, y) {
    var angle = 0;
    
    if (this.prevX !== null && this.prevY !== null) {
      var dx = x - this.prevX;
      var dy = y - this.prevY;
      angle = atan2(dy, dx);
    }
    
    push();
    
    translate(x, y);
    rotate(angle);
    scale(1.5);
    
    // Body
    fill(200);
    stroke(100);
    strokeWeight(3);
    ellipse(0, 0, 40, 30);
    
    // Nose
    fill(219, 156, 180);
    stroke(171, 92, 122);
    ellipse(20, 0, 7, 9);
    
    // Ears
    circle(0, -12, 15);
    circle(0, 12, 15);
    
    // Eyes
    fill(0);
    noStroke();
    circle(10, -5, 5);
    circle(10, 5, 5);
    
    // Tail using Bezier Curve
    noFill();
    stroke(0);
    bezier(-20, 0, -30, 10, -35, -20, -40, 0)
    
    pop();
    
    this.prevX = x;
    this.prevY = y;
  }
  
  drawCat(x, y) {
    var angle = 0;
    
    if (this.catPrevX !== null && this.catPrevY !== null) {
      var dx = x - this.catPrevX;
      var dy = y - this.catPrevY;
      angle = atan2(dy, dx);
    }
    
    push();
    
    translate(x, y);
    rotate(angle);
    scale(1.5);
    
    // Head
    fill(0);
    strokeWeight(3);
    stroke(0);
    ellipse(0, 0, 30, 30);
    
    // Nose
    ellipse(13, 0, 12, 12);
    
    // Body
    ellipse(-20, 0, 35, 20);
    ellipse(-40, 0, 45, 30);
    ellipse(-55, 0, 40, 35);
    
    // Whiskers
    line(0, -25, 0, 25);
    line(5, -5, 18, 18); 
    line(0, 0, 11, 26); 
    line(5, 5, 18, -18); 
    line(0, 0, 11, -26); 
    
    // Tail using Beizer Curve
    noFill();
    strokeWeight(8);
    bezier(-75, 0, -95, -40, -97, 30, -140, 0);
    
    pop();
    
    this.catPrevX = x;
    this.catPrevY = y;
  }
}

// Phyllotaxis.js

class Phyllotaxis {
  constructor(centreVector, angle, amt, radius, size) {
    this.centreVector = centreVector; // Centre of spiral
    this.angle = angle; // Degree of rotation
    this.amt = amt; // Increasing amount
    this.radius = radius; // Radius of shape
    this.size = size; // Size of canvas
    
    angleMode(DEGREES);
  }
  
  update() {
    var initCol = 0;
    
    for (var i = 0; i < this.size; i+= this.amt) {
      var currentAng = i * this.angle;
      var scalingFactor = 4;
      var currentRad = scalingFactor * sqrt(i);
      
      var x = this.centreVector.x + currentRad * cos(currentAng);
      var y = this.centreVector.y + currentRad * sin(currentAng);
      
      var col1 = sin(initCol + i * 0.1);
      col1 = map(col1, -1, 1, 155, 255);
      
      var col2 = sin(initCol + i * 0.1);
      col2 = map(col2, -1, 1, 155, 255);
      
      fill(col1, 0, col2, 200);
      noStroke();
      circle(x, y, this.radius);
    }
  }
}
