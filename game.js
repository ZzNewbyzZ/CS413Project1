var GAME_WIDTH = 720;
var GAME_HEIGHT = 400;
var GAME_SCALE = 4;
var DIM = 16;


var gameport = document.getElementById("gameport");
var renderer = new PIXI.autoDetectRenderer(GAME_WIDTH,
                                           GAME_HEIGHT,
                                           {backgroundColor: 0x99D5FF});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;

var winner = new PIXI.Container();
winningText = new PIXI.Text('You Won!!',{fontFamily : 'Arial', fontSize: 72, fill : 0xff1010, align : 'center'});
winningText.position.x = 250;
winningText.position.y = 250;
winner.addChild(winningText);

// Scene objects get loaded in the ready function
var hero;
var world;
var water;

// Game variables
var count = 0;
var size = 12;

// Character movement constants:
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

// The move function starts or continues movement
function move() {
  if (hero.direction == MOVE_NONE) {
    hero.moving = false;
    return;
  }

  var dx = 0;
  var dy = 0;

  if (hero.direction == MOVE_LEFT) dx -= 1;
  if (hero.direction == MOVE_RIGHT) dx += 1;
  if (hero.direction == MOVE_UP) dy -= 1;  
  if (hero.direction == MOVE_DOWN) dy += 1;

  if (water[(hero.gy+dy-1)*size + (hero.gx+dx)] != 0) {
    hero.moving = false;
    wall.play();
    collision(ball, hero);
    return;
  }

  hero.gx += dx;
  hero.gy += dy;

  hero.moving = true;
  
  createjs.Tween.get(hero).to({x: hero.gx*DIM, y: hero.gy*DIM}, 175).call(move);
  leftFoot.play();
  rightFoot.play();
  
  collision(ball, hero);
}

// Keydown events start movement
window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (!hero) return;
  if (hero.moving) return;
  if (e.repeat == true) return;
  
  hero.direction = MOVE_NONE;

  if (e.keyCode == 87)
    hero.direction = MOVE_UP;
  else if (e.keyCode == 83)
    hero.direction = MOVE_DOWN;
  else if (e.keyCode == 65)
    hero.direction = MOVE_LEFT;
  else if (e.keyCode == 68)
    hero.direction = MOVE_RIGHT;

  move();
});

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add('map0.json')
  .add('map1.json')
  .add('map2.json')
  .add('map3.json')
  .add('map4.json')
  .add('map5.json')
  .add('map6.json')
  .add('map7.json')
  .add('map8.json')
  .add('map9.json')
  .add('tileset.png')
  .add('hero.png')
  .add('ball.png')
  .add('Left_Foot.wav')
  .add('Right_foot.wav')
  .add('MainMusic.wav')
  .add('Pickup_Coin.wav')
  .add('Wall.wav')
  .add('winner.wav')
  .load(ready);

function ready() {
  createjs.Ticker.setFPS(60);
  var tu = new TileUtilities(PIXI);
  var map = "map" + count + ".json";
  world = tu.makeTiledWorld(map, "tileset.png");
  stage.addChild(world);
  
  wall = PIXI.audioManager.getAudio("Wall.wav");
  
  music = PIXI.audioManager.getAudio("MainMusic.wav", volume = 50);
  music.loop = true;
  music.play();
  
  winMusic = PIXI.audioManager.getAudio("winner.wav", volume = 50);
  winMusic.loop = true;
  
  coin = PIXI.audioManager.getAudio("Pickup_Coin.wav");
  
  leftFoot = PIXI.audioManager.getAudio("Left_Foot.wav", volume = 50);
  rightFoot = PIXI.audioManager.getAudio("Right_foot.wav", volume = 50);

  hero = new PIXI.Sprite(PIXI.loader.resources["hero.png"].texture);
  if(count==0)
  {
    hero.gx = 2;
    hero.gy = 6;
  }
  else if(count==5)
  {
    hero.gx = 2;
    hero.gy = 3;
  }
  else if(count==6)
  {
    hero.gx = 5;
    hero.gy = 5;
  }
  else if(count==7)
  {
    hero.gx = 1;
    hero.gy = 11;
  }
  else if(count==8)
  {
    hero.gx = 2;
    hero.gy = 3;
    size = 20;
  }
  else if(count == 9)
  {
    hero.gx = 17;
    hero.gy = 19;
  }
  else
  {
    hero.gx = 9;
    hero.gy = 5;
  }
  hero.x = hero.gx*DIM;
  hero.y = hero.gy*DIM;
  hero.anchor.x = 0.0;
  hero.anchor.y = 1.0;
  
  ball = new PIXI.Sprite(PIXI.loader.resources["ball.png"].texture);
  if(count == 0)
  {
    ball.gx = 9;
    ball.gy = 6;
  }
  else if(count==4)
  {
    ball.gx = 4;
    ball.gy = 2;
  }
  else if(count==5)
  {
    ball.gx = 9;
    ball.gy = 3;
  }
  else if(count==6)
  {
    ball.gx = 10;
    ball.gy = 5;
  }
  else if(count==7)
  {
    ball.gx = 7;
    ball.gy = 5;
  }
  else if(count == 8)
  {
    ball.gx = 6;
    ball.gy = 3;
  }
  else if(count == 9)
  {
    ball.gx = 17;
    ball.gy = 17;
  }
  else
  {
    ball.gx = 3;
    ball.gy = 8;
  }
  ball.x = ball.gx*DIM;
  ball.y = ball.gy*DIM;
  ball.anchor.x = 0.0;
  ball.anchor.y = 1.0;

  // Find the entity layer
  var entities = world.getObject("Entities");
  entities.addChild(hero);
  entities.addChild(ball);

  water = world.getObject("Water").data;
  
  hero.direction = MOVE_NONE;
  hero.moving = false;
  animate();
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  update_camera();
  if(count < 10)
  {
    renderer.render(stage);
  }
  else
  {
    music.stop();
    winMusic.play();
    renderer.render(winner);
  }
}

function update_camera() {
  stage.x = -hero.x*GAME_SCALE + GAME_WIDTH/2 - hero.width/2*GAME_SCALE;
  stage.y = -hero.y*GAME_SCALE + GAME_HEIGHT/2 + hero.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}

function collision(a, b)
{
  var ab = a.getBounds();
  var bb = b.getBounds();
  if(ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height)
  {
    if(count < 10)
    {
      music.stop();
      coin.play();
      count+=1;
      ready();
    }
  }
}
