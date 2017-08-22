var game;
var myShip;
var asteroids = [];
const NUM_AST = 50;
var hits = []; // should get rid of this with better life tracking

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

  myShip.move();
  myShip.display();

  for (let i = 0; i < NUM_AST; i++) {
    asteroids[i].move();
    asteroids[i].display();
  }

  steerShip();
  checkCollisions();

  if (game.getLives() === 0) {
    reset();
  }
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
  if (keyIsDown(DOWN_ARROW)) console.log(`mouseX ${mouseX} mouseY ${mouseY}`);
}

// uses p5 collide2d library to check if ship is colliding with asteroids
function checkCollisions() {
  triPoly = [createVector(myShip.position.x-10, myShip.position.y+10), createVector(myShip.position.x+0, myShip.position.y-20), createVector(myShip.position.x+10, myShip.position.y+10) ];
  var hit = false;

  for (var i = 0; i < NUM_AST; i++) {
    if (i === hits[0] || i === hits[1] || i === hits[2]) { //if we already hit this asteroid
      continue;
    }
    // collide functions return a bool for whether these objects are colliding
    hit = collideCirclePoly(asteroids[i].position.x - width/2,asteroids[i].position.y - height/2,asteroids[i].diameter, triPoly)
    if (hit) {
      hits.push(i); // move index of hit asteroid to hit list
      game.loseLife();
      console.log('HIT ' + i + ' lives' + game.getLives() );
      hit = false;
    }
  }
}

function reset() {
  game.reset();
  hits = [];
}
