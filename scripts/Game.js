//should initialize everything
// keep score
// win state/lose state
// reset
// lives
// essentially just keeps state of the game

function Game() {
  this.score = 0;
  this.lives = 3;

  this.getLives = function() {
    return this.lives;
  };
  this.loseLife = function() {
    this.lives--;
  };
  this.getScore = function() {
    return this.lives;
  };
  this.addScore = function() {
    this.score++;
  };
  this.reset = function() {
    this.score = 0;
    this.lives = 3;
  }
}
