var position;
var velocity;
var acceleration;

function setup() {
  var asteroidCanvas = createCanvas(window.innerWidth, window.innerHeight); // create game canvas
  asteroidCanvas.parent('canvas-container');   // append game canvas to DOM container

  position = createVector(0, 0);
  velocity = createVector(0, 0);
  acceleration = createVector(0, 0);
}

function draw() {
  background(0);

  Ship.position = position; // this seems weird...
  Ship.render();

  steerShip();
}

function steerShip() {

  if (keyIsDown(UP_ARROW)) { // thrust forward if arrow is pressed
    Ship.thrust(true);
  } else {                   // stop thrusting when arrow is released
    Ship.thrust(false);
  }
  if (keyIsDown(RIGHT_ARROW)) Ship.rotate('right');
  if (keyIsDown(LEFT_ARROW)) Ship.rotate('left');
}
