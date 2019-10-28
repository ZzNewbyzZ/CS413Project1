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

// Scene objects get loaded in the ready function
var hero;
var ball;
var world;
var water;

// Game variables
var count = 0;
var ballReady = 1;

// Character movement constants:
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

// Text to show in game
text = new PIXI.Text('Score: ' + count,{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
stage.addChild(text);

winningText = new PIXI.Text('You Won!!',{fontFamily : 'Arial', fontSize: 72, fill : 0xff1010, align : 'center'});
winningText.position.x = 250;
winningText.position.y = 250;
winner.addChild(winningText);


// The move function starts or continues movement
function move() {
	
  var speed;
  var dx = 0;
  var dy = 0;

  if (hero.direction == MOVE_NONE) {
    hero.moving = false;
    return;
  }
  
  if (water[(hero.gy+dy-1)*12 + (hero.gx+dx)] != 0) {
    speed = .5;
  }
  else
  {
    speed = 1;
  }

  if (hero.direction == MOVE_LEFT) dx -= speed;
  if (hero.direction == MOVE_RIGHT) dx += speed;
  if (hero.direction == MOVE_UP) dy -= speed;  
  if (hero.direction == MOVE_DOWN) dy += speed;

  hero.gx += dx;
  hero.gy += dy;

  hero.moving = true;
  
  createjs.Tween.get(hero).to({x: hero.gx*DIM, y: hero.gy*DIM}, 250).call(move);
  
  collision(hero, ball);
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

// Keyup events end movement
window.addEventListener("keyup", function onKeyUp(e) {
  e.preventDefault();
  if (!hero) return;
  hero.direction = MOVE_NONE;
});

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add('map.json')
  .add('tileset.png')
  .add('hero.png')
  .add('ball.png')
  .add('winner.wav')
  .add('MainMusic.wav')
  .load(ready);

function ready() {
  createjs.Ticker.setFPS(60);
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map.json", "tileset.png");
  stage.addChild(world);
  
  music = PIXI.audioManager.getAudio("MainMusic.wav", volume = 50);
  music.loop = true;
  music.play();
  
  winMusic = PIXI.audioManager.getAudio("winner.wav", volume = 50);
  winMusic.loop = true;

  hero = new PIXI.Sprite(PIXI.loader.resources["hero.png"].texture);
  hero.gx = 9;
  hero.gy = 5;
  hero.x = hero.gx*DIM;
  hero.y = hero.gy*DIM;
  hero.anchor.x = 0.0;
  hero.anchor.y = 1.0;
  
  ball = new PIXI.Sprite(PIXI.Texture.fromImage("ball.png"));
  ball.position.y = Math.floor(Math.random() * 100) + 50;
  ball.position.x = Math.floor(Math.random() * 100) + 50;
  stage.addChild(ball);

  // Find the entity layer
  var entities = world.getObject("Entities");
  entities.addChild(hero);

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
    renderer.render(winner);
	winMusic.play();
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
	if(ballReady == 1)
	{
		count+=1;
		ballReady = 0;
		text.text = 'Score: ' + count
		var new_x = Math.floor(Math.random() * 100) + 50;
		var new_y = Math.floor(Math.random() * 100) + 50;
		createjs.Tween.get(ball.position).to({x: new_x, y: new_y}, 500, createjs.Ease.easeOutInCirc).call(tweenComplete);
	}
  }
}

function tweenComplete()
{
	ballReady = 1;
}
