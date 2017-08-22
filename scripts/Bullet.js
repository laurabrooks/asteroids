function Bullet(theta) {
  this.position = createVector(0, 0);
  this.velocity = createVector(0, 1);
  this.acceleration = createVector(0, 0);
  this.theta = theta;
  this.magnitude = 200;

  this.fire = function() {
      // this.acceleration = createVector(this.accelIncr*cos(this.theta), this.accelIncr*sin(this.theta), 0);
      this.velocity.rotate(this.theta);
      this.velocity.setMag(10);
  };

  // update bullet position
  this.move = function() {
    this.position.add(this.velocity);
    // this.velocity.add(this.acceleration);
  };

  // draw ship on canvas
  this.display = function() {
    stroke(255);
    noFill();
    push();
    translate(width / 2, height / 2); // make these calculations relative to the center of canvas
    // translate(this.position.x, this.position.y); // then ship's position
    //rotate(this.theta + HALF_PI);
    ellipse(0, 0, 2);
    pop();
  };
}
