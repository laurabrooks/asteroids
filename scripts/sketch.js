var position;
var velocity;
var acceleration;

function setup() {
  var asteroidCanvas = createCanvas(600, 400); // create game canvas
  asteroidCanvas.parent('canvas-container');   // append game canvas to DOM container

  position = createVector(0, 0);
  velocity = createVector(0, 0);
  acceleration = createVector(0, 0);
}

function draw() {
  background(200);

  Ship.position = position;
  Ship.render();

  if (keyIsDown(UP_ARROW)) { // thrust forward if arrow is pressed
    Ship.thrust(true);
  } else {                   // stop thrusting when arrow is released
    Ship.thrust(false);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    console.log('right arrow');
    Ship.rotate('right');
  }
  if (keyIsDown(LEFT_ARROW)) {
    console.log('left arrow');
    Ship.rotate('left');
  }
}
