let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}

PIXI.utils.sayHello(type)

let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite,
  TextureCache = PIXI.utils.TextureCache,
  Text = PIXI.Text,
  TextStyle = PIXI.TextStyle,
  Container = PIXI.Container,
  Rectangle = PIXI.Rectangle;

let app = new Application({
  width: 768,
  height: 656
});
app.renderer.backgroundColor = 0x061639;
document.body.appendChild(app.view);

loader
  .add("img/sprites.json")
  .add("img/Background.png")
  .load(setup)

let bottomPlane = 46,
  style = new TextStyle({
    fontSize: 30,
    fill: "#FFE44C",
  }),
  sprites,
  char,
  state,
  foodSrc,
  foods = [],
  foodsCaught = 0,
  score = 0,
  missed = 0,
  animations,
  gameScene = new Container(),
  endScene = new Container(),
  endMessage = new Text(`Game over!`, style),
  endScore = new Text(`Final score: ${score}`, style),
  scoreDisp = new Text(`Score: ${score}`, style),
  missedDisp = new Text(`Missed food: ${missed}/10`, style),
  left = keyboard(37),
  right = keyboard(39);

function setup() {
  state = play;
  animations = loader.resources["img/sprites.json"].data.animations;
  sprites = loader.resources["img/sprites.json"].textures;
  let background = new Sprite(resources["img/Background.png"].texture);
  foodsSrc = ["Apple", "Bacon", "Brownie", "Cherry", "Chicken", "Cookie", "Honey", "Jam", "Jerky"]
  background.x = 0;
  background.y = 0;
  gameScene.addChild(background);

  char = new Sprite(sprites["char_idle_0"]);
  char.x = gameScene.width / 2 - char.width / 2;
  char.y = gameScene.height - bottomPlane - char.height;
  char.vx = 0;

  console.log(animations);

  scoreDisp.x = 20;
  scoreDisp.y = 20;
  missedDisp.x = 20;
  missedDisp.y = 50;


  endMessage.x = 384 - endMessage.width / 2;
  endScore.x = 384 - endScore.width / 2;
  endMessage.y = 228;
  endScore.y = 428;

  app.stage.addChild(gameScene);
  app.stage.addChild(endScene);
  gameScene.addChild(background);
  gameScene.addChild(char);
  gameScene.addChild(scoreDisp);
  gameScene.addChild(missedDisp);
  endScene.addChild(endMessage);
  endScene.addChild(endScore);
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
  char.x += char.vx;
  contain(char, {
    x: -25,
    y: 0,
    width: 795,
    height: 656
  });

  foods.forEach(function(food) {
    food.y += food.vy
    if (hitTestRectangle(char, food)) {
      gameScene.removeChild(food);
      food.y = -1000;
      food.vy = 0;
      score += 1;
      scoreDisp.text = `Score: ${score}`;
    } else {
      if (food.y > gameScene.height - bottomPlane) {
        gameScene.removeChild(food);
        food.y = -1000;
        food.vy = 0;
        missed += 1;
        missedDisp.text = `Missed food: ${missed}/10`;

        if (missed >= 10) {
          food.y = -1000;
          food.vy = 0;
          end();
        }
      }
    }
  });
}

function end() {
  gameScene.visible = false;
  endScene.visible = true;
  endMessage.text = (`Game over!`);
  endScore.text = (`Final score: ${score}`);
}

function animateChar() {
  let animation = animations.char_idle;
  let frame = 0;
  let texture;
  let animSpeed = 150;
  setInterval(function() {
    if (char.vx > 0) {
      animation = animations.char_right;
      animSpeed = 50;
      frame = (frame + 1) % animation.length;
    } else if (char.vx < 0) {
      animation = animations.char_left;
      animSpeed = 50;
      frame = (frame + 1) % animation.length;
    } else {
      animation = animations.char_idle;
      animSpeed = 150;
      frame = (frame + 1) % animation.length;
    }
    texture = PIXI.Texture.fromFrame(`${animation[frame]}`);
    char.texture = texture;
  }, animSpeed);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function createFood(foodName) {
  let food = new Sprite(sprites[`${foodName}`]);
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
