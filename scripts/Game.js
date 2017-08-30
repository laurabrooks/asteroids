// keeps track of the state of the game
function Game() {
  this.score = 0;
  this.lives = 3;
  this.state = 0;

  this.getLives = function() {
    return this.lives;
  };
  this.loseLife = function() {
    this.lives--;
  };
  this.getScore = function() {
    return this.lives;
  };
  this.addScore = function(pts) {
    this.score += pts;
  };
  this.reset = function() {
    this.score = 0;
    this.lives = 3;
  }
}
