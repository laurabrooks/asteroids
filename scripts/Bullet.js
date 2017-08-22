function Bullet(x, y, theta) {
  this.position = createVector(x, y);
  this.velocity = createVector(1, 0);
  this.theta = theta;

  // initial fire
  // set up this bullet's vectors based on ship position at fire time
  this.fire = function() {
      this.velocity.rotate(this.theta);
      this.velocity.setMag(8);
      console.log(this.position.toString());
      console.log('theta '+ degrees(this.theta));
  };

  // update bullet position
  this.move = function() {
    this.position.add(this.velocity);
  };

  // draw bullet on canvas
  this.display = function() {
    stroke(255);
    noFill();
    ellipse(this.position.x, this.position.y, 2);
  };
}
