let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}

PIXI.utils.sayHello(type)

let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite;

let app = new Application({
  width: 768,
  height: 768
});
app.renderer.backgroundColor = 0x061639;
document.body.appendChild(app.view);

loader
  .add([
    "img/char.png",
    "img/food.png"

  ])
  .load(setup)

function setup() {
  let char = new Sprite(resources["img/char.png"].texture);
  let food = new Sprite(resources["img/food.png"].texture);

  let textArr = [char,
    food
  ];

  for (i = 0; i < textArr.length; i++) {
    textArr[i].x = 35 * i;
    textArr[i].y = 35 * i;
    app.stage.addChild(textArr[i]);
  }

}
