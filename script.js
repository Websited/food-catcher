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
  Rectangle = PIXI.Rectangle;

let app = new Application({
  width: 768,
  height: 768
});
app.renderer.backgroundColor = 0x061639;
document.body.appendChild(app.view);

loader
  .add("img/sprites.json")
  .load(setup)

function setup() {
  let id = resources["img/sprites.json"].textures;
  let apple = new Sprite(id["Apple"]);

  apple.x = 40;
  apple.y = 40;

  app.stage.addChild(apple);
}
