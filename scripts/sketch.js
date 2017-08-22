var game;
var myShip;
var asteroids = [];
const NUM_AST = 10;

function setup() {
  var asteroidCanvas = createCanvas(window.innerWidth, window.innerHeight); // create game canvas
  asteroidCanvas.parent('canvas-container');   // append game canvas to DOM container

  // create game, ship and asteroids
  game = new Game();
  myShip = new Ship();
  for (let i = 0; i < NUM_AST; i++) {
    asteroids[i] = new Asteroid();
  }

  collideDebug(true);
}

function draw() {
  background(0);

  switch (game.state) {
    case 0: //playing
      gamePlay();
      break;
    case 1: //game over
      gameOver();
      break;
  }
}

function gamePlay() {
  displayScore();
  displayLives();

  myShip.move();
  myShip.display();

  for (let i = 0; i < NUM_AST; i++) {
    asteroids[i].move();
    asteroids[i].display();
  }

  steerShip();
  checkCollisions();
  handleAsteroids();

  if (game.getLives() === 0) gameOver();
}

// takes user input for arrow keys and steers the ship
function steerShip() {

  if (keyIsDown(UP_ARROW)) { // thrust forward if arrow is pressed
    myShip.thrust(true);
  } else {                   // stop thrusting when arrow is released
    myShip.thrust(false);
  }
  if (keyIsDown(RIGHT_ARROW)) myShip.turn('right');
  if (keyIsDown(LEFT_ARROW)) myShip.turn('left');
}

// uses p5 collide2d library to check if ship is colliding with asteroids
function checkCollisions() {
  triPoly = [createVector(myShip.position.x-10, myShip.position.y+10), createVector(myShip.position.x+0, myShip.position.y-20), createVector(myShip.position.x+10, myShip.position.y+10) ];
  var hit = false;

  for (var i = 0; i < NUM_AST; i++) {
    // collide functions return a bool for whether these objects are colliding
    hit = collideCirclePoly(asteroids[i].position.x - width/2,asteroids[i].position.y - height/2,asteroids[i].diameter, triPoly)
    if (hit) {
      explodeAstroid(i);
      game.addScore('collision');
      game.loseLife();
      centerShip();
      console.log('HIT ' + i + ' lives' + game.getLives() );
      hit = false;
    }
  }
}

// uses p5 collide2d library to check if ship's bullets are colliding with asteroids
function checkCollisions() {
  triPoly = [createVector(myShip.position.x-10, myShip.position.y+10), createVector(myShip.position.x+0, myShip.position.y-20), createVector(myShip.position.x+10, myShip.position.y+10) ];
  var hit = false;

  for (var i = 0; i < NUM_AST; i++) {

    // collide functions return a bool for whether these objects are colliding
    hit = collideCirclePoly(asteroids[i].position.x - width/2,asteroids[i].position.y - height/2,asteroids[i].diameter, triPoly)
    if (hit) {
      explodeAstroid(i);
      game.addScore('collision');
      game.loseLife();
      centerShip();
      console.log('HIT ' + i + ' lives' + game.getLives() );
      hit = false;
    }
  }
}

function explodeAstroid(index) {
  var randomOffset = 15;
  var newAst1 = new Asteroid();
  newAst1.diameter = asteroids[index].diameter/2;
  newAst1.timeOffset = 0;
  newAst1.position.x = asteroids[index].position.x + random(-randomOffset, randomOffset);
  newAst1.position.y = asteroids[index].position.y + random(-randomOffset, randomOffset);
  var newAst2 = new Asteroid();
  newAst2.diameter = asteroids[index].diameter/2;
  newAst2.timeOffset = 0;
  newAst2.position.x = asteroids[index].position.x + random(-randomOffset, randomOffset);
  newAst2.position.y = asteroids[index].position.y + random(-randomOffset, randomOffset);

  asteroids.splice(index, 1, newAst1, newAst2);
}

function keyPressed() {
  ellipse(0,0, 50);
  if (game.state === 0) {
    if (keyCode === 32) { // space bar
      myShip.shoot();
      return false;
    }
  }
}

function handleAsteroids() {
  // don't go off in random directions forever
  for (var i = 0; i < NUM_AST; i++) {
    if (asteroids[i].position.x > (width+asteroids[i].diameter/2) || asteroids[i].position.x < -(asteroids[i].diameter/2)) {
      asteroids[i] = new Asteroid();
    }
    if (asteroids[i].position.y > (height+asteroids[i].diameter/2) || asteroids[i].position.y < -(asteroids[i].diameter/2)) {
      asteroids[i] = new Asteroid();
    }
  }
}

function displayScore() {
  fill(255);
  textFont('monospace', 40);
  text(game.score, 40, 40);
}

function displayLives() {
  noFill();
  var xOffset = 40;
  var yOffset = 80;
  for (var i = 0; i < game.lives; i++) {
    triangle(
      (xOffset*(i+1))-10, yOffset+10,
      (xOffset*(i+1))+0, yOffset-20,
      (xOffset*(i+1))+10, yOffset+10
    );
  }
}

function centerShip() {
  myShip.position = createVector(0,0);
  myShip.velocity = createVector(0,0);
  myShip.acceleration = createVector(0,0);
  myShip.theta = 3*PI / 2;
}

function gameOver() {
  hits = [];
  game.state = 1;

  background(0);
  textAlign(CENTER);
  fill(255);
  text('GAMEOVER', width/2, height/2-60);
  text(`SCORE ${game.score}`, width/2, height/2-20);
  if (frameCount%45 > 22) fill(0); // make text flash
  else fill(255);
  text("press 'enter' to play again", width/2, height/2+40);

  if (keyIsDown(ENTER)) {
    game.reset();
    game.state = 0;
  }
}
