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
  sprites,
  char,
  state,
  foodSrc,
  foods = [],
  foodsCaught = 0,
  score = 0,
  missed = 0,
  scoreDisp = new Text(`Score: ${score}`),
  missedDisp = new Text(`Missed food: ${missed}/10`),
  left = keyboard(37),
  right = keyboard(39);

function setup() {
  sprites = PIXI.loader.resources["img/sprites.json"].textures;
  let background = new Sprite(resources["img/Background.png"].texture);
  foodsSrc = ["Apple", "Bacon", "Brownie", "Cherry", "Chicken", "Cookie", "Honey", "Jam", "Jerky", ]
  background.x = 0;
  background.y = 0;
  app.stage.addChild(background);

  char = new Sprite(sprites["char_idle_0"]);
  char.x = app.stage.width / 2 - char.width / 2;
  char.y = app.stage.height - bottomPlane - char.height;
  char.vx = 0;

  scoreDisp.x = 20;
  scoreDisp.y = 20;
  missedDisp.x = 20;
  missedDisp.y = 50;

  app.stage.addChild(background);
  app.stage.addChild(char);
  app.stage.addChild(scoreDisp);
  app.stage.addChild(missedDisp);

  state = play;

  (function timeout() {
    setTimeout(function() {
      var randomFood = randomInt(0, foodsSrc.length);
      createFood(foodsSrc[randomFood]);
      timeout();
    }, 5000);
  })();


  app.ticker.add(delta => gameLoop(delta));
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
      app.stage.removeChild(food);
      food.y = -1000;
      food.vy = 0;
      score += 1;
      scoreDisp.text = `Score: ${score}`;
    } else {
      if (food.y > app.stage.height - bottomPlane) {
        app.stage.removeChild(food);
        food.y = -1000;
        food.vy = 0;
        missed += 1;
        missedDisp.text = `Missed food: ${missed}/10`;
      }
    }
  });
}

function end(){}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
  food.x = randomInt(10, app.stage.width - food.width - 10);
  food.y = -150;
  food.vy = randomInt(2, 4);
  foods.push(food);
  app.stage.addChild(food);
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
