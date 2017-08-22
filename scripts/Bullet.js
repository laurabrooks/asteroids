function Bullet(x, y, theta) {
  this.position = createVector(x, y);
  this.velocity = createVector(1, 0);
  this.theta = theta;

  // initial fire
  this.fire = function() {
      this.velocity.rotate(this.theta);
      this.velocity.setMag(8);
      console.log(this.position.toString());
      console.log('theta '+ degrees(this.theta));
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
//    translate(width / 2, height / 2); // make these calculations relative to the center of canvas
    // rotate(this.theta + HALF_PI);
    ellipse(this.position.x, this.position.y, 2);
    pop();
  };
}
