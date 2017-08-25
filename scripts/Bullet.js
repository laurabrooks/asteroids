function Bullet(x, y, theta) {
  this.position = createVector(x, y);
  this.velocity = createVector(1, 0);
  this.theta = theta;
  this.diameter = 2;
  this.active = true;

  // initial fire
  // set up this bullet's vectors based on ship position at fire time
  this.fire = function() {
    this.velocity.rotate(this.theta);
    this.velocity.setMag(8);
  };

  // update bullet position
  this.move = function() {
    this.position.add(this.velocity);
  };

  // draw bullet on canvas
  this.display = function() {
    if (this.active) {
      (brightMode) ? stroke(0,255,0) : stroke(255);
      noFill();
      ellipse(this.position.x, this.position.y, this.diameter);
    }
  };
}
