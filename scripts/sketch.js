var game;
var myShip;
var asteroids = [];
const NUM_AST = 10;
const COLLISION_PTS = 20;
var pixelated;
var tutorialStarted = false;
var tutorialCounter = 0;

function preload() {
  pixelated = loadFont('pixelated_font/pixelated.ttf');
}

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
    case 0: //instructions
      tutorial();
      break;
    case 1: //playing
      gamePlay();
      break;
    case 2: //game over
      gameOver();
      break;
  }
}

function tutorial() {

  displayScore();
  displayLives();

  myShip.move();
  myShip.display();
  steerShip();

  if ( (!tutorialStarted) &&
       (keyIsDown(UP_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW)) ) {
    tutorialStarted = true;
    tutorialCounter = frameCount;
    console.log(`tutorialStarted ${tutorialStarted}`);
  }
  if (tutorialStarted && (frameCount - tutorialCounter < 150) ) {
    directionKeys();
  }
}

function directionKeys() {
  rectMode(CENTER);
  // up arrow
  rect(width/2, height-(height*0.1) - 75, 50, 50);
  push()
  translate(width/2, height-(height*0.1) - 75);
  beginShape(TRIANGLES);
  vertex(0, -15);
  vertex(-15, 15);
  vertex(15, 15);
  endShape();
  fill(255);
  textAlign(CENTER);
  textFont('monospace', 16);
  text('accelerate', 0, -40);
  pop();
  // down arrow
  rect(width/2, height-(height*0.1), 50, 50);
  // left arrow
  rect(width/2 - 75, height-(height*0.1), 50, 50);
  push()
  translate(width/2 - 75, height-(height*0.1));
  fill(255);
  textAlign(RIGHT);
  textFont('monospace', 16);
  text('rotate', -40, 0);
  text('left', -40, 16);
  rotate(3*PI/2)
  noFill();
  beginShape(TRIANGLES);
  vertex(0, -15);
  vertex(-15, 15);
  vertex(15, 15);
  endShape();
  pop(); // rotation matrix
  pop(); // translation matrix
  // right arrow
  rect(width/2 + 75, height-(height*0.1), 50, 50);
  push()
  translate(width/2 + 75, height-(height*0.1));
  fill(255);
  textAlign(LEFT);
  textFont('monospace', 16);
  text('rotate', 40, 0);
  text('right', 40, 16);
  push()
  rotate(PI/2)
  noFill();
  beginShape(TRIANGLES);
  vertex(0, -15);
  vertex(-15, 15);
  vertex(15, 15);
  endShape();
  pop();
  pop();
}

function gamePlay() {
  displayScore();
  displayLives();

  myShip.move();
  myShip.display();

  // was constant NUM_AST - this kept only ten on screen, but made ones that
  // were on the screen disappear if others were appended in the middle
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].move();
    asteroids[i].display();
    // text(i, asteroids[i].position.x, asteroids[i].position.y); //fun for testing
  }

  steerShip();
  checkShipCollisions();
  checkBulletCollisions();
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
function checkShipCollisions() {
  triPoly = [createVector(myShip.position.x-10, myShip.position.y+10), createVector(myShip.position.x+0, myShip.position.y-20), createVector(myShip.position.x+10, myShip.position.y+10) ];
  var hit = false;

  for (var i = 0; i < asteroids.length; i++) { //NUM_AST
    if ((frameCount - asteroids[i].timeStart) > asteroids[i].timeOffset) {
    // collide functions return a bool for whether these objects are colliding
      hit = collideCirclePoly(asteroids[i].position.x - width/2,asteroids[i].position.y - height/2,asteroids[i].diameter, triPoly)
      if (hit) {
        explodeAsteroid(i);
        console.log('COLLIDE asteroid ' + i);
        game.addScore(COLLISION_PTS);
        game.loseLife();
        centerShip();
        hit = false;
      }
    }
  }
}

// uses p5 collide2d library to check if ship's bullets are colliding with asteroids
function checkBulletCollisions() {
  var hit = false;

  for (var i = 0; i < myShip.bullets.length; i++) {
    if (myShip.bullets[i].active) {
      for (var j = 0; j < asteroids.length; j++) { //NUM_AST

        // collide functions return a bool for whether these objects are colliding
        hit = collideCircleCircle(
          asteroids[j].position.x, asteroids[j].position.y,
          asteroids[j].diameter,
          myShip.bullets[i].position.x, myShip.bullets[i].position.y,
          myShip.bullets[i].diameter
        )
        if (hit) {
          console.log('SHOT asteroid ' + j);
          console.log('with bullet ' + i);
          explodeAsteroid(j);
          game.addScore(100 + asteroids[j].diameter - asteroids[j].diameter%20);
          hit = false;
          // remove bullet so it doesn't hit another
          myShip.bullets[i].active = false;
          break;
        }
      }
    }
  }
}

// called when there is a bullet or ship collision with an asteroid
// if the asteroid is below a certain size, it just is regenerated as a new, random asteroid in start position
// if it is large enough, it gets split into two asteroids of half diameter
function explodeAsteroid(index) {
  console.log(`index in explode function ${index}`);
  if (asteroids[index].diameter > 80) {
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
  else {
    console.log('diameter less than= 80');
    var newAst = new Asteroid();
    delete asteroids[index];
    asteroids[index] = newAst;
  }
  console.log('asteroids length '+ asteroids.length + ' end of explode function');
  console.log(asteroids);
}

// handles space bar shooting
function keyPressed() {
  if (game.state === 1) {
    if (keyCode === 32) { // space bar
      myShip.shoot();
      return false;
    }
  }
}

function handleAsteroids() {
  // don't go off in random directions forever
  for (var i = 0; i < asteroids.length; i++) { //NUM_AST
    if (asteroids[i].position.x > (width+asteroids[i].diameter/2) || asteroids[i].position.x < -(asteroids[i].diameter/2)) {
      asteroids[i] = new Asteroid();
      text(i, asteroids[i].position.x, asteroids[i].position.y);
    }
    if (asteroids[i].position.y > (height+asteroids[i].diameter/2) || asteroids[i].position.y < -(asteroids[i].diameter/2)) {
      asteroids[i] = new Asteroid();
      text(i, asteroids[i].position.x, asteroids[i].position.y);
    }
  }
}

function displayScore() {
  fill(255);
  textAlign(LEFT);
  textFont('monospace', 40);
  text(game.score, 40, 40);
}

function displayLives() {
  noFill();
  stroke(255);
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
  game.state = 2;

  background(0);
  textAlign(CENTER);
  fill(255);
  textFont(pixelated, 200);
  if (frameCount%45 > 22) fill(0); // make text flash
  else fill(255);
  text('GAMEOVER', width/2, height/2-150);

  fill(255);
  textFont('monospace', 40);
  text(`SCORE ${game.score}`, width/2, height/2-20);
  if (frameCount%45 > 22) fill(0); // make text flash
  else fill(255);
  text("press 'enter' to play again", width/2, height/2+40);

  if (keyIsDown(ENTER)) {
    game.reset();
    game.state = 1;
  }
}
