function Asteroid() {
  this.position = p5.Vector.random2D().mult(width); //do better math/vector math?
  this.velocity = p5.Vector.random2D();
  this.diameter = Math.floor(Math.random()*80) + Math.floor(Math.random()*20); //random diameter between 20 and 80

  this.move = function() {
    this.position.add(this.velocity);
  };

  // draw asteroid on canvas
  this.display = function() {
    stroke(255);
    noFill();
    // push();
    // translate(width/2, height/2);
    ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
    // pop();
  };
}
