var Ship = (function() {
  return {
    //position: createVector(300, 200),
    position: null,
    velocity: null,
    acceleration: null,
    theta: 0,
    accelIncr: 0.1,
    thetaIncr: 0.1,

    rotate: function(direction) {
      if (direction === 'right') this.theta += this.thetaIncr;
      else this.theta -= this.thetaIncr;
    },
    thrust: function(starting) {  // force is applied at an angle using vectors
      if (starting) {
        acceleration = createVector(this.accelIncr*cos(this.theta), this.accelIncr*sin(this.theta), 0);
      }
      else { //key up, stopping motion
        acceleration = createVector(0,0);
      }
    },

    // draw ship on canvas
    render: function() {

      position.add(velocity);
      velocity.add(acceleration);

      stroke(255);
      noFill();
      push();
      // centre screen
      translate(width / 2, height / 2);
      // position
      translate(this.position.x, this.position.y);
      // orientation
      rotate(this.theta + HALF_PI);
      triangle(-10, 10, 0, -20, 10, 10);
      pop();
    }
  }
})();
