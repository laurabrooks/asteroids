# Asteroids
[play here](https://laurabrooks.github.io/asteroids/) (hint, press 'c' while playing)



## Rules
 * The player drives a ship using the arrow keys and can press space to shoot.
 * They must avoid running into asteroids and shoot asteroids to gain points.
 * The asteroids split in two when shot.
 * Players gain points based on the size of the asteroid they break.
 * The player has three lives and the game is over when all lives are lost.
 * see original game: http://www.freeasteroids.org/



## Technologies used
  * My game is made with p5.js. I render the entire browser window as a canvas and all UI and gameplay is handled in p5.js.
    * https://p5js.org/
  * 5.collide2d library to check for collisions with asteroids
    * https://github.com/bmoren/p5.collide2D
  * p5.sound library to play game sounds
    * https://p5js.org/reference/#/libraries/p5.sound
  * game sounds downloaded here: http://www.classicgaming.cc/classics/asteroids/



## Process/Approach.
I organized and prioritized my features using Trello (https://trello.com/b/JQpM1iHF/asteroids). The order of features I implemented was:
   * create p5.js canvas and add it to html file
   * create ship class and add physics to steer it
   * wrap ship around screen
   * create asteroid class as circles that move across the screen
   * in main file, create an array of asteroids
   * check for collisions
   * deal with asteroids going off the screen
   * make asteroids split in half
   * created a game class to hold game states
   * add bullet class and give ship an array of bullets
   * add same collision logic to bullets
   * add lives and game over screen
   * add tutorial mode
   * add animations for throttle
   * create color mode
   * fix lots of bugs along the way



  ## File Overviews


  * ship class
    * use vectors for theta, position, velocity, and acceleration
    * https://forum.processing.org/one/topic/move-rotate-paradox.html
    * display ship as a triangle
    * make the ship wrap around the edge of the screen
    * hold an array of bullets


  * bullet class
    * vector for theta, position and velocity
    * active attribute which is false after bullet collides with an asteroid
    * methods for displaying


  * asteroid class
    * create each asteroid at a random position just off the edge of the screen
    * give each a random diameter, position, velocity and time offset
    * after time offset, they move across the screen


  * game class
    * hold state of the game
      * score
      * lives
      * state (start screen, tutorial, play, game over)
      * reset method


  * main file / draw loop
    * draw loop is a switch on game state and calls appropriate functions:
      * creates a game, player's ship, and array of asteroids
      * displays start screen
        * waits for user input then begins tutorial mode
      * displays overlay of keys and waits for user to try the keys, then gives them 5 seconds to practice before moving on
      * asteroids enter screen as tutorial ends


  * check for collisions of ship or bullets and asteroid
    * check a circle in asteroid position with a triangle/polygon in ship's position using p5.collide2D
    * also check against all active bullets
    * explode asteroid
      * split in two if above a certain diameter
      * if not, delete this asteroid and regenerate it as a new starting asteroid
      * play sound based on asteroid size


  * after play loses a life:
    * recenter the ship
    * clear asteroids from center of screen so they don't immediately lose again


  * keep track of score
    * display game score, updating after every asteroid break
    * if game score is higher than high score, update high score


  * display game over screen when all three lives are gone
    * flash game over
    * display score and high score
    * restart game play on enter


  * on user input make sounds
    * fire sound on space bar
    * throttle sound on forward arrow


  * color mode
    * when the user toggles 'c' game enters color mode and everything has different colors instead of white strokes



## Future features

* better determine number of asteroids based on screen size
 * make a better way of capping number of asteroids
* make more game modes like color modes
* add an enemy ship that shoots at player
* more animations - ship falls apart after collision, ship flashes on new life, asteroids break apart with debris animating out
* make bullets wrap around screen like in original
* backend for global high score


## Any bugs
* score algorithm is not very robust
* asteroid generation and management should be implemented in a more thoughtful way
* bullets never get deleted, they just are marked inactive - works fine but not memory efficient


## Your biggest wins and challenges.
  * the physics was very hard!
    * I found resources to base the physics of the ship on
    * but I had to figure out the bullets on my own - make sure they have correct theta from ship at time of shot
    * for collision, I found that because the ship was drawn by pushing a new coordinate matrix and rotated the whole coordinate system to draw, the collision detection wasn't testing rotation.
      * see the debugging process in these videos: [debugging](https://github.com/laurabrooks/asteroids/blob/master/process/debug.mov) and [debugged](https://github.com/laurabrooks/asteroids/blob/master/process/debugged.mov)
  * for a while (seemingly) random asteroids would disappear when one asteroid was shot or collided with and it was really hard to debug because it was hard to know which were disappearing and how to make the bug happen
    * I ended up printing the asteroid array index on each circle on the screen and that helped me see that it was asteroids in the array above index 9 that disappeared
    * with this information, I knew to look at my loops that handle displaying asteroids and they only went up to the original number of asteroids, not the length of the array (after the asteroids break)



## Your process for turning that game into a web application (wireframes, blockers/issues that popped up).
* [Wireframe 1](https://github.com/laurabrooks/asteroids/blob/master/process/wireframe1)
* [Wireframe 2](https://github.com/laurabrooks/asteroids/blob/master/process/wireframes2)
