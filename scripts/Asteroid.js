var Asteroid = (function() {
  return {
    position: p5.Vector.random2D().mult(width),
    velocity: p5.Vector.random2D(),
    diameter: Math.random()*100,

    // draw asteroid on canvas
    render: function() {

      this.position.add(this.velocity);

      stroke(255);
      noFill();
      ellipse(this.position.x, this.position.y, 50, 50);
    }
  }
});
