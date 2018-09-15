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
    "img/Apple.png",
    "img/Bacon.png",
    "img/Brownie.png",
    "img/Cherry.png",
    "img/Chicken.png",
    "img/Cookie.png",
    "img/Honey.png",
    "img/Jam.png",
    "img/Jerky.png",
    "img/char_idle_0.png",
    "img/char_idle_1.png",
    "img/char_idle_2.png",
    "img/char_idle_3.png",
    "img/char_left_0.png",
    "img/char_left_1.png",
    "img/char_left_2.png",
    "img/char_left_3.png",
    "img/char_left_4.png",
    "img/char_left_5.png",
    "img/char_right_0.png",
    "img/char_right_1.png",
    "img/char_right_2.png",
    "img/char_right_3.png",
    "img/char_right_4.png",
    "img/char_right_5.png"

  ])
  .load(setup)

function setup() {
  let charIdle0 = new Sprite(resources["img/char_idle_0.png"].texture);
  let charIdle1 = new Sprite(resources["img/char_idle_1.png"].texture);
  let charIdle2 = new Sprite(resources["img/char_idle_2.png"].texture);
  let charIdle3 = new Sprite(resources["img/char_idle_3.png"].texture);
  let charLeft0 = new Sprite(resources["img/char_left_0.png"].texture);
  let charLeft1 = new Sprite(resources["img/char_left_1.png"].texture);
  let charLeft2 = new Sprite(resources["img/char_left_2.png"].texture);
  let charLeft3 = new Sprite(resources["img/char_left_3.png"].texture);
  let charLeft4 = new Sprite(resources["img/char_left_4.png"].texture);
  let charLeft5 = new Sprite(resources["img/char_left_5.png"].texture);
  let charRight0 = new Sprite(resources["img/char_right_0.png"].texture);
  let charRight1 = new Sprite(resources["img/char_right_1.png"].texture);
  let charRight2 = new Sprite(resources["img/char_right_2.png"].texture);
  let charRight3 = new Sprite(resources["img/char_right_3.png"].texture);
  let charRight4 = new Sprite(resources["img/char_right_4.png"].texture);
  let charRight5 = new Sprite(resources["img/char_right_5.png"].texture);
  let Bacon = new Sprite(resources["img/Bacon.png"].texture);
  let Brownie = new Sprite(resources["img/Brownie.png"].texture);
  let Cherry = new Sprite(resources["img/Cherry.png"].texture);
  let Chicken = new Sprite(resources["img/Chicken.png"].texture);
  let Cookie = new Sprite(resources["img/Cookie.png"].texture);
  let Honey = new Sprite(resources["img/Honey.png"].texture);
  let Jam = new Sprite(resources["img/Jam.png"].texture);
  let Jerky = new Sprite(resources["img/Jerky.png"].texture);

  app.stage.addChild(charIdle0);
  app.stage.addChild(charIdle1);
  app.stage.addChild(charIdle2);
  app.stage.addChild(charIdle3);
  app.stage.addChild(charLeft0);
  app.stage.addChild(charLeft1);
  app.stage.addChild(charLeft2);
  app.stage.addChild(charLeft3);
  app.stage.addChild(charLeft4);
  app.stage.addChild(charLeft5);
  app.stage.addChild(charRight0);
  app.stage.addChild(charRight1);
  app.stage.addChild(charRight2);
  app.stage.addChild(charRight3);
  app.stage.addChild(charRight4);
  app.stage.addChild(charRight5);
  app.stage.addChild(Bacon);
  app.stage.addChild(Brownie);
  app.stage.addChild(Cherry);
  app.stage.addChild(Chicken);
  app.stage.addChild(Cookie);
  app.stage.addChild(Honey);
  app.stage.addChild(Jam);
  app.stage.addChild(Jerky);

}
