// p5 class for user's ship
function Ship() {
  this.position = createVector(0, 0);
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);
  this.theta = 3*PI / 2;
  this.accelIncr = 0.1;
  this.thetaIncr = 0.1;
  this.drag = 0.995;
  this.bullets = [];
  this.scaleFactor = Math.min(width, height)/50;

  this.turn = function(direction) {
    if (direction === 'right') this.theta += this.thetaIncr;
    else this.theta -= this.thetaIncr;
  };

  // acceleration force at angle of ship
  this.thrust = function(starting) {
    if (starting) {
      this.acceleration = createVector(this.accelIncr*cos(this.theta), this.accelIncr*sin(this.theta), 0);
      this.displayThrust();
    }
    else { //key up, stopping motion
      this.acceleration = createVector(0,0);
    }
  };
  this.checkWrap = function() {
    if (Math.abs(this.position.y) > Math.abs(height/2) ) {
      this.position.y *= -1;
    }
    if (Math.abs(this.position.x) > Math.abs(width/2)) {
      this.position.x *= -1;
    }
  };

  // update ship position
  this.move = function() {
    this.checkWrap();

    this.position.add(this.velocity);
    this.velocity.mult(this.drag);
    this.velocity.add(this.acceleration);
  };

  // draw ship on canvas
  this.display = function() {
    (brightMode) ? stroke(0,0,255) : stroke(255);
    noFill();
    push(); // creating new coordinate matrix
    translate(width / 2, height / 2); // make these calculations relative to the center of canvas
    translate(this.position.x, this.position.y); // then ship's position
    rotate(this.theta + HALF_PI);
    triangle(
      -this.scaleFactor, this.scaleFactor,
      0, -2*this.scaleFactor,
      this.scaleFactor, this.scaleFactor);
    // triangle(-10, 10, 0, -20, 10, 10);
    pop();
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].move();
      this.bullets[i].display();
    }
  };

  this.displayThrust = function() {
    push(); // creating new coordinate matrix
    translate(width / 2, height / 2); // make these calculations relative to the center of canvas
    translate(this.position.x, this.position.y); // then ship's position
    rotate(this.theta + HALF_PI);
    if (frameCount%(frameRate()*4) > frameRate()*2) noStroke(); // make trail flash
    else (brightMode) ? stroke(255,99,71) : stroke(255);
    triangle(
      -this.scaleFactor/2, this.scaleFactor,
      0, 2*this.scaleFactor,
      this.scaleFactor/2, this.scaleFactor);
    pop();
    stroke(255);
    this.display(); //hacky way to make sure trail is behind ship
  }

  this.shoot = function() {
    this.bullets[this.bullets.length] = new Bullet(
      (this.position.x + 2*this.scaleFactor * cos(this.theta))+width/2,
      (this.position.y + 2*this.scaleFactor * sin(this.theta))+height/2,

      this.theta); // add a bullet
    this.bullets[this.bullets.length-1].fire();
  }
}
