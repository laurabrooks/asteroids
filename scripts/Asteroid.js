var Asteroid = (function() {
  return {
    position: p5.Vector.random2D().mult(width),
    velocity: p5.Vector.random2D(),
    diameter: Math.floor(Math.random()*80) + Math.floor(Math.random()*20), //random diameter between 20 and 80

    // draw asteroid on canvas
    render: function() {

      this.position.add(this.velocity);

      stroke(255);
      noFill();
      // push();
      // translate(width/2, height/2);
      ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
      // pop();
    }
  }
});
