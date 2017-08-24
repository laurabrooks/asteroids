function Asteroid() {
  this.diameter = random(100, 300); //random diameter between 20 and 80
  // this.diameter = random(20, 100); //random diameter between 20 and 80
  this.setStartPos = function() {
    var side = Math.round(Math.random()); //random either 0 or 1
    var offset = this.diameter/2; // amount to offset so asteroid start off screen

    if (side === 0) {
      var x = Math.round(Math.random());
      if (x === 0) offset *= -1;
      var startVector = createVector(x*width+offset, random(height));
    }
    else {
      var y = Math.round(Math.random());
      if (y === 0) offset *= -1;
      var startVector = createVector(random(width), y*height+offset);
    }
    return startVector;
  };

  this.position = this.setStartPos();
  this.velocity = p5.Vector.random2D();
  this.timeStart = frameCount;
  this.timeOffset = frameRate()*random(0, 5);

  // moves asteroid after its time offset
  this.move = function() {
    if ((frameCount - this.timeStart) > this.timeOffset) {
      this.position.add(this.velocity);
    }
  };

  // draw asteroid on canvas
  this.display = function() {
    if ((frameCount - this.timeStart) > this.timeOffset) {
      stroke(255);
      noFill();
      ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
    }
  };
}
