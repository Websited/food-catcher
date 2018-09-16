let app = new PIXI.Application({
  width: 768,
  height: 656
});
app.renderer.backgroundColor = 0x061639;
document.body.appendChild(app.view);

let style = new PIXI.TextStyle({
    fontSize: 30,
    fill: "#FFE44C",
  }),
  // plane for character to move
  bottomPlane = 46,
  score = 0,
  missed = 0,
  // variable for texture atlas
  sprites,
  // Scene for gameplay
  gameScene = new PIXI.Container(),
  // display current score
  scoreDisp = new PIXI.Text(`Score: ${score}`, style),
  //display missed foods count
  missedDisp = new PIXI.Text(`Missed food: ${missed}/10`, style),
  //end screen
  endScene = new PIXI.Container(),
  endMessage = new PIXI.Text(`Game over!`, style),
  // display score on end screen
  endScore = new PIXI.Text(`Final score: ${score}`, style),
  //character sprite
  char = new PIXI.Sprite(),
  // state defines which scene should be visible and runs some functions
  state = play,
  // hold names to display proper textures
  foodsSrc = ["Apple", "Bacon", "Brownie", "Cherry", "Chicken", "Cookie", "Honey", "Jam", "Jerky"],
  // will hold food added to scene to play
  foods = [],
  // will hold name of character movement animation
  animations,
  left = keyboard(37),
  right = keyboard(39);

PIXI.loader
  .add("img/sprites.json")
  .add("img/Background.png")
  .load(setup)

function setup() {
  // loads textures
  animations = PIXI.loader.resources["img/sprites.json"].data.animations;
  sprites = PIXI.loader.resources["img/sprites.json"].textures;
  let background = new PIXI.Sprite(PIXI.loader.resources["img/Background.png"].texture);

  //add elements to proper scenes
  app.stage.addChild(gameScene, endScene);
  gameScene.addChild(background, char, scoreDisp, missedDisp);
  endScene.addChild(endMessage, endScore);

  //position background
  background.x = 0;
  background.y = 0;

  //initial character position and velocity
  char.x = gameScene.width / 2 - char.width / 2;
  char.y = gameScene.height - bottomPlane - 84;
  char.vx = 0;

  //position score display on game scene
  scoreDisp.x = 20;
  scoreDisp.y = 20;
  missedDisp.x = 20;
  missedDisp.y = 50;

  //position game over messages on game over scene
  endMessage.x = 384 - endMessage.width / 2;
  endScore.x = 384 - endScore.width / 2;
  endMessage.y = 228;
  endScore.y = 428;

  // initially hides game over scene
  endScene.visible = false;

  app.ticker.add(delta => gameLoop(delta));

  if (state = play) {
    dropFood();
    animateChar();
  }
}

function gameLoop(delta) {
  state(delta);
}

function play(delta) {
  // character movement
  char.x += char.vx;

  //character boundaries
  contain(char, {
    x: -25,
    y: 0,
    width: 795,
    height: 656
  });

  foods.forEach(function(food) {
    // adds velocity to food
    food.y += food.vy
    //test collision of food with character
    if (hitTestRectangle(char, food)) {
      // adds score and removes food from game
      stopFood(food);
      score += 1;
      scoreDisp.text = `Score: ${score}`;
    } else {
      // add missed food count and removes food from game
      if (food.y > gameScene.height - bottomPlane) {
        stopFood(food);
        missed += 1;
        missedDisp.text = `Missed food: ${missed}/10`;

        if (missed >= 10) {
          // stops food and ends the game
          stopFood(food);
          end();
        }
      }
    }
  });
}

// ends the game
function end() {
  gameScene.visible = false;
  endScene.visible = true;
  endMessage.text = (`Game over!`);
  endScore.text = (`Final score: ${score}`);
  state = end;
}

//changing textures to animate character
function animateChar() {
  // holds one of texturepacker animations array to animate character
  let animation = animations.char_idle;
  // sets animation to first texture
  let frame = 0;
  // will hold current texture
  let texture;
  setInterval(function() {
    if (char.vx > 0) {
      animation = animations.char_right;
      frame = (frame + 1) % animation.length;
    } else if (char.vx < 0) {
      animation = animations.char_left;
      frame = (frame + 1) % animation.length;
    } else {
      animation = animations.char_idle;
      frame = (frame + 1) % animation.length;
    }
    texture = PIXI.Texture.fromFrame(`${animation[frame]}`);
    char.texture = texture;
  }, 80);
}

//helper function to randomize game
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// adds food to game scene
function dropFood() {
  if (missed >= 10) {
    return;
  } else {
    setTimeout(function() {
      var randomFood = randomInt(0, foodsSrc.length);
      createFood(foodsSrc[randomFood]);
      dropFood();
    }, 3000);
  }
};

// helper function to stop food from falling after collision
function stopFood(foodElem) {
  foodElem.y = -1000;
  foodElem.vy = 0;
}

// key input handler
function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

right.press = () => {
  char.vx += 10;
}

left.press = () => {
  char.vx -= 10;
}

right.release = () => {
  char.vx = 0;
}

left.release = () => {
  char.vx = 0;
}

// creates food to add to scene
function createFood(foodName) {
  let food = new PIXI.Sprite(sprites[`${foodName}`]);
  let dim = randomInt(12, 24);
  food.width = dim;
  food.height = dim;
  food.x = randomInt(20, 768 - food.width - 20);
  food.y = -150;
  if (state === play) {
    food.vy = randomInt(10, 15);
  }
  foods.push(food);
  gameScene.addChild(food);
}

// sets boundaries
function contain(sprite, container) {
  let collision = undefined;
  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }
  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }
  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }
  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }
  //Return the `collision` value
  return collision;
}

function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};
