//should initialize everything
// keep score
// win state/lose state
// reset
// lives
// essentially just keeps state of the game

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
    // switch (type) {
    //   case 'collision':
    //     this.score += 20;
    //     break;
    //   case 'shot':
    //     this.score += 100;
    //     break;
    // }
    this.score += pts;
  };
  this.reset = function() {
    this.score = 0;
    this.lives = 3;
  }
}
