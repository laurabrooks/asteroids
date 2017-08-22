var position;
var velocity;
var acceleration;
var asteroids = [];
const NUM_AST = 50;

function setup() {
  var asteroidCanvas = createCanvas(window.innerWidth, window.innerHeight); // create game canvas
  asteroidCanvas.parent('canvas-container');   // append game canvas to DOM container

  position = createVector(0, 0);
  velocity = createVector(0, 0);
  acceleration = createVector(0, 0);
  for (let i = 0; i < NUM_AST; i++) {
    asteroids[i] = Asteroid();
  }
  collideDebug(true);
}

function draw() {
  background(0);

  Ship.position = position; // this seems weird...
  Ship.render();

  steerShip();

  for (let i = 0; i < NUM_AST; i++) {
    asteroids[i].render();
  }

  checkCollisions();
}

function steerShip() {

  if (keyIsDown(UP_ARROW)) { // thrust forward if arrow is pressed
    Ship.thrust(true);
  } else {                   // stop thrusting when arrow is released
    Ship.thrust(false);
  }
  if (keyIsDown(RIGHT_ARROW)) Ship.rotate('right');
  if (keyIsDown(LEFT_ARROW)) Ship.rotate('left');
  if (keyIsDown(DOWN_ARROW)) console.log(`mouseX ${mouseX} mouseY ${mouseY}`);
}

function checkCollisions() {
  triPoly = [createVector(Ship.position.x-10, Ship.position.y+10), createVector(Ship.position.x+0, Ship.position.y-20), createVector(Ship.position.x+10, Ship.position.y+10) ];
  let hit = false;

  // test code with circle on mouse
  // if (hit) fill(255, 0, 0);
  // else fill(0, 0, 255);
  // ellipse(mouseX,mouseY,20,20);
  // hit = collideCirclePoly(mouseX, mouseY, 20, triPoly)


  for (var i = 0; i < NUM_AST; i++) {
    // hit = collideCircleCircle(mouseX, mouseY, 20, asteroids[i].position.x,asteroids[i].position.y,asteroids[i].diameter)

    hit = collideCirclePoly(asteroids[i].position.x - width/2,asteroids[i].position.y - height/2,asteroids[i].diameter, triPoly)
    if (hit) console.log('HIT ' + i);
  }

}
