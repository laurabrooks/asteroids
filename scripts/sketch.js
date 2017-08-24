var game;
var myShip;
var asteroids = [];
var initialNumAst;
const COLLISION_PTS = 20;
var pixelated;
var tutorialEnded = false;
var tutorialTimerStarted = false;
var tutorialCounter = 0;
var tutorialMode = 0;
var brightMode = false;

var shootSound, thrustSound, bangSmall, bangMedium, bangLarge;

function preload() {
  pixelated = loadFont('assets/pixelated_font/pixelated.ttf');
  soundFormats('wav');
  shootSound = loadSound('assets/sounds/fire.wav');
  thrustSound = loadSound('assets/sounds/thrust.wav');
  bangSmall = loadSound('assets/sounds/bangSmall.wav');
  bangMedium = loadSound('assets/sounds/bangMedium.wav');
  bangLarge = loadSound('assets/sounds/bangLarge.wav');
}

function setup() {
  var asteroidCanvas = createCanvas(window.innerWidth, window.innerHeight); // create game canvas
  asteroidCanvas.parent('canvas-container');   // append game canvas to DOM container

  initialNumAst = Math.floor(Math.max(width, height)/100);
  asteroidCap = 2*initialNumAst;

  // create game, ship and asteroids
  game = new Game();
  myShip = new Ship();
  for (let i = 0; i < initialNumAst; i++) {
    asteroids[i] = new Asteroid();
  }
}

function draw() {
  background(0);

  switch (game.state) {
    case 0: // start screen
      start();
      break;
    case 1: // instructions
      tutorial();
      break;
    case 2: // playing
      gamePlay();
      break;
    case 3: // game over
      gameOver();
      break;
  }
}

function start() {
  displayBeginGame();
  if (keyIsDown(ENTER)) {
    game.state++; // go to tutorial
  }
}

function displayBeginGame() {
  background(0);
  textAlign(CENTER);
  fill(255);
  stroke(255);
  if (frameCount%45 > 22) fill(0); // make text flash
  else fill(255);
  if (width > 1200) textFont(pixelated, 200);
  else textFont(pixelated, 100);
  text('ASTEROIDS', width/2, height/2-100);

  textFont('monospace', 40);
  fill(255);
  text("press 'enter' to play", width/2, height/2+40);
}

function tutorial() {

  displayScore();
  displayLives();

  myShip.move();
  myShip.display();
  steerShip();

  if (tutorialMode === 2) game.state = 2; // enter play mode after tutorial
  else {
    if (!tutorialEnded) {
      if (tutorialMode === 0) displayDirectionKeys();
      else if (tutorialMode === 1) displaySpace();
    }

    if ( (!tutorialTimerStarted) && tutorialMode === 0) {
      if (keyIsDown(UP_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW)) {
        tutorialTimerStarted = true;
        tutorialCounter = frameCount;
      }
    }
    else if ( (!tutorialTimerStarted) && tutorialMode === 1) {
      if (keyIsDown(32)) {
        tutorialTimerStarted = true;
        tutorialCounter = frameCount;
      }
    }

    if ((tutorialCounter) && (frameCount - (frameRate()*5) > tutorialCounter)) {
      tutorialEnded = true;
      tutorialMode++;
      tutorialEnded = false;
      tutorialCounter = 0;
      tutorialTimerStarted = false;
    }
  }
}

function displayDirectionKeys() {
  stroke(255);
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

function displaySpace() {
  stroke(255);  
  rectMode(CENTER);
  rect(width/2, height-(height*0.1), 400, 50);

  push()
  translate(width/2, height-(height*0.1));
  fill(255);
  textAlign(CENTER);
  textFont('monospace', 16);
  text('space to shoot', 0, 6);
  pop()
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

  if (game.getLives() < 1) gameOver();
}

// takes user input for arrow keys and steers the ship
function steerShip() {

  if (keyIsDown(UP_ARROW)) { // thrust forward if arrow is pressed
    myShip.thrust(true);
    thrustSound.setVolume(2);
    thrustSound.play();
  } else {                   // stop thrusting when arrow is released
    myShip.thrust(false);
  }
  if (keyIsDown(RIGHT_ARROW)) myShip.turn('right');
  if (keyIsDown(LEFT_ARROW)) myShip.turn('left');
}

// uses p5 collide2d library to check if ship is colliding with asteroids
function checkShipCollisions() {
  // finding ship's vertices by pretending the vertex is a point on a circle
  // rotating around center point of ship
  // see algorithm at https://stackoverflow.com/questions/839899/how-do-i-calculate-a-point-on-a-circle-s-circumference
  triPoly = [
    // front vertex
    createVector(
      (myShip.position.x + 2*myShip.scaleFactor * cos(myShip.theta)),
      (myShip.position.y + 2*myShip.scaleFactor * sin(myShip.theta)) ),
    // bottom left
    createVector(
      (myShip.position.x + -myShip.scaleFactor*Math.sqrt(2) * cos(myShip.theta+PI/4)),
      (myShip.position.y + -myShip.scaleFactor*Math.sqrt(2) * sin(myShip.theta+PI/4)) ),
    // bottom right
    createVector(
      (myShip.position.x + -myShip.scaleFactor*Math.sqrt(2) * cos(myShip.theta-PI/4)),
      (myShip.position.y + -myShip.scaleFactor*Math.sqrt(2) * sin(myShip.theta-PI/4)) )
  ];

  var hit = false;

  for (var i = 0; i < asteroids.length; i++) {
    if ((frameCount - asteroids[i].timeStart) > asteroids[i].timeOffset) {
    // collide functions return a bool for whether these objects are colliding
      hit = collideCirclePoly(asteroids[i].position.x - width/2,asteroids[i].position.y - height/2,asteroids[i].diameter, triPoly)

      if (hit) {
        explodeAsteroid(i);
        game.addScore(COLLISION_PTS);
        game.loseLife();
        centerShip();
        hit = false;
        var size = '';
        if (asteroids[i].diameter > 233) size = 'Large';
        else if (asteroids[i].diameter > 166) size = 'Medium';
        else size = 'Small';
        playHitSound(size);
      }
    }
  }
}

// uses p5 collide2d library to check if ship's bullets are colliding with asteroids
function checkBulletCollisions() {
  var hit = false;

  for (var i = 0; i < myShip.bullets.length; i++) {
    if (myShip.bullets[i].active) {
      for (var j = 0; j < asteroids.length; j++) {

        // collide functions return a bool for whether these objects are colliding
        hit = collideCircleCircle(
          asteroids[j].position.x, asteroids[j].position.y,
          asteroids[j].diameter,
          myShip.bullets[i].position.x, myShip.bullets[i].position.y,
          myShip.bullets[i].diameter
        )
        if (hit) {
          explodeAsteroid(j);
          game.addScore(100 + asteroids[j].diameter - asteroids[j].diameter%20);
          hit = false;
          var size = '';
          if (asteroids[j].diameter > 233) size = 'Large';
          else if (asteroids[j].diameter > 166) size = 'Medium';
          else size = 'Small';
          playHitSound(size);
          // remove bullet so it doesn't hit another
          myShip.bullets[i].active = false;
          break;
        }
      }
    }
  }
}

function playHitSound(size) {
  var filename = `bang${size}`
  window[filename].setVolume(2);
  window[filename].play();
}

// called when there is a bullet or ship collision with an asteroid
// if the asteroid is below a certain size, it just is regenerated as a new, random asteroid in start position
// if it is large enough, it gets split into two asteroids of half diameter
function explodeAsteroid(index) {
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
    var newAst = new Asteroid();
    delete asteroids[index];
    asteroids[index] = newAst;
  }
}

// handles space bar shooting
function keyPressed() {
  // if we're in play mode or tutorial mode but at second part
  if ( (game.state === 2) || (game.state === 1 && tutorialMode === 1) ) {
    if (keyCode === 32) { // space bar
      shootSound.setVolume(2);
      shootSound.play();
      myShip.shoot();
      return false;
    }
  }
  // toggle brightMode (colored shapes)
  if (keyCode === 67) {
    brightMode = (brightMode) ? false : true;
  }
}

function handleAsteroids() {
  // don't go off in random directions forever
  for (var i = 0; i < asteroids.length; i++) {
    if ( (asteroids[i].position.x > (width+asteroids[i].diameter/2) || asteroids[i].position.x < -(asteroids[i].diameter/2))  //off in x direction
      || (asteroids[i].position.y > (height+asteroids[i].diameter/2) || asteroids[i].position.y < -(asteroids[i].diameter/2)) //off in y direction
       ) {
      asteroids[i] = new Asteroid();
      // don't make a new one if asteroid cap has been reached
      // this is not the best way to handle keeping a reasonable number of asteroids
      if (i >= asteroidCap) {
        asteroids.splice(i, 1);
      }
    }
  }
}

function displayScore() {
  (brightMode) ? fill(200,255,200) : fill(255);
  textAlign(LEFT);
  textFont('monospace', 40);
  text(game.score, 40, 40);

  textAlign(RIGHT);
  textFont('monospace', 20);

  if (localStorage.getItem('highScore') === null) {
    localStorage.setItem('highScore', 0);
  }
  else if (game.score > localStorage.getItem('highScore')) {
    localStorage.setItem('highScore', game.score);
  }
  text(`HIGH SCORE: ${localStorage.getItem('highScore')}`, width-40, 30);

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
  game.state = 3;

  displayGameOver();

  console.log(localStorage.getItem('highScore'));

  if (keyIsDown(ENTER)) {
    game.reset();
    game.state = 2;
    for (let i = 0; i < initialNumAst; i++) {
      delete asteroids[i];
      asteroids[i] = new Asteroid();
    }
    asteroids.length = initialNumAst;
  }
}

function displayGameOver() {
  background(0);
  textAlign(CENTER);
  fill(255);
  if (width > 1200) textFont(pixelated, 200);
  else textFont(pixelated, 100);
  if (frameCount%45 > 22) fill(0); // make text flash
  else fill(255);
  text('GAMEOVER', width/2, height/2-100);

  fill(255);
  textFont('monospace', 40);
  textAlign(LEFT);
  text(`YOUR SCORE: ${game.score}`, width/2 - 230, height/2-25);
  text(`HIGH SCORE: ${localStorage.getItem('highScore')}`, width/2 - 230, height/2+10);
  textAlign(CENTER);
  if (frameCount%45 > 22) fill(0); // make text flash
  else fill(255);
  text("press 'enter' to play again", width/2, height/2+90);
}
