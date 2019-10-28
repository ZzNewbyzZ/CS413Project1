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

var lastHorizDir;
var lastVertDir;
var count = 0;
var ballReady = 1;

var hero;
var runner;
var world;
var grass;

text = new PIXI.Text('Score: ' + count,{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
stage.addChild(text);

winningText = new PIXI.Text('You Won!!',{fontFamily : 'Arial', fontSize: 72, fill : 0xff1010, align : 'center'});
winningText.position.x = 250;
winningText.position.y = 250;
winner.addChild(winningText);

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

  if (water[(hero.gy+dy-1)*12 + (hero.gx+dx)] != 0) {
    hero.moving = false;
    return;
  }

  hero.gx += dx;
  hero.gy += dy;

  hero.moving = true;
  
  createjs.Tween.get(hero).to({x: hero.gx*DIM, y: hero.gy*DIM}, 250).call(move);

}

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add("assets.json")
  .add("MainMusic.wav")
  .add("Pickup_Coin.wav")
  .add("Left_Foot.wav")
  .add("Right_Foot.wav")
  .add("winner.wav")
  .add("map.json")
  .add("map.png")
  .load(ready);
  


function ready() {
	
  createjs.Ticker.setFPS(60);
  
  var tu = new TileUtilites(PIXI);
  world = tu.makeTileWorld("map.json", "map.png");
  stage.addChild(world);
	
  music = PIXI.audioManager.getAudio("MainMusic.wav");
  music.loop = true;
  music.play();
  
  winMusic = PIXI.audioManager.getAudio("winner.wav");
  winMusic.loop = true;
  
  coinUp = PIXI.audioManager.getAudio("Pickup_Coin.wav");
  
  leftFoot = PIXI.audioManager.getAudio("Left_Foot.wav");
  rightFoot = PIXI.audioManager.getAudio("Right_Foot.wav");
	
  ball = new PIXI.Sprite(PIXI.Texture.fromImage("ball.png"));
  ball.position.y = Math.floor(Math.random() * 300) + 50;
  ball.position.x = Math.floor(Math.random() * 300) + 50;
  stage.addChild(ball);
	
  hero = new PIXI.Sprite(PIXI.Texture.fromFrame("MyDude2.png"));
  hero.gx = 9;
  hero.gy = 5;
  hero.x = hero.gx*DIM;
  hero.y = hero.gy*DIM;
  hero.anchor.x = 0.0;
  hero.anchor.y = 1.0;
  
  /*hero.scale.x = 2;
  hero.scale.y = 2;
  hero.position.x = 200;
  hero.position.y = 200;
  hero.anchor.x = .5;
  stage.addChild(hero);
  
  var frames = [];

  for (var i=1; i<=4; i++) {
    frames.push(PIXI.Texture.fromFrame('MyDude' + i + '.png'));
  }

  runner = new PIXI.extras.MovieClip(frames);
  runner.gx = 9;
  runner.gy = 5;
  runner.x = runner.gx*DIM;
  runner.y = runner.gy*DIM;
  runner.anchor.x = 0.0;
  runner.anchor.y = 1.0;
  
  runner.scale.x = 2;
  runner.scale.y = 2;
  runner.position.x = 200;
  runner.position.y = 200;
  runner.anchor.x = .5;
  runner.animationSpeed = 0.1;
  runner.play();*/
  
  var entities = world.getObject("Entities");
  entities.addChild(hero);
  
  grass = world.getObject("Grass").data;
  
  
  document.addEventListener('keydown', keydownEventHandler);
  document.addEventListener('keyup', keyupEventHandler);
}

function keydownEventHandler(e)
{
  e.preventDefault();
  if (!hero) return;
  if (hero.moving) return;
  
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
}
/*{
	if (e.keyCode == 87) // W Key
	{
		stage.removeChild(hero);
		stage.addChild(runner);
		leftFoot.play();
		rightFoot.play();
		lastVertDir = "Up";
		if(contain(runner, {x:50, y:20, width: 490, height:490}) == "top")
		{
			if(lastHorizDir == "Left")
			{
				runner.position.x -= 5;
			}
			else
			{
				runner.position.x += 5;
			}
		}
		else
		{
			runner.position.y -= 10;
		}
		collision(runner, ball);
	}
	
	if(e.keyCode == 83) // S Key
	{
		stage.removeChild(hero);
		stage.addChild(runner);
		leftFoot.play();
		rightFoot.play();
		lastVertDir = "Down";
		if(contain(runner, {x:32, y:32, width: 490, height:490}) == "bottom")
		{
			if(lastHorizDir == "Left")
			{
				runner.position.x -= 5;
			}
			else
			{
				runner.position.x += 5;
			}
		}
		else
		{
			runner.position.y += 10;
		}
		collision(runner, ball);
	}
	
	if(e.keyCode == 65) // A Key
	{
		runner.scale.x = -2;
		stage.removeChild(hero);
		stage.addChild(runner);		
		leftFoot.play();
		rightFoot.play();
		lastHorizDir = "Left";
		if(contain(runner, {x:50, y:32, width: 490, height:490}) == "left")
		{
			if(lastVertDir == "Up")
			{
				runner.position.y -= 5;
			}
			else
			{
				runner.position.y += 5;
			}
		}
		else
		{
			runner.position.x -= 10;
		}
		collision(runner, ball);
	}
	
	if(e.keyCode == 68) // D Key
	{
		runner.scale.x = 2;	
		stage.removeChild(hero);
		stage.addChild(runner);
		leftFoot.play();
		rightFoot.play();
		lastHorizDir = "Right";
		if(contain(runner, {x:32, y:32, width: 540, height:490}) == "right")
		{
			if(lastVertDir == "Up")
			{
				runner.position.y -= 5;
			}
			else
			{
				runner.position.y += 5;
			}
		}
		else
		{
			runner.position.x += 10;
		}
		collision(runner, ball);
	}
}*/
	
function keyupEventHandler(e)
{
	hero.position.x = runner.position.x;
	hero.position.y = runner.position.y;
	hero.scale.x = runner.scale.x;
	stage.addChild(hero);
	stage.removeChild(runner);
}

function collision(a, b)
{
  var ab = a.getBounds();
  var bb = b.getBounds();
  if(ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height)
  {
	if(ballReady == 1)
	{
		coinUp.play();
		count+=1;
		ballReady = 0;
		text.text = 'Score: ' + count
		var new_x = Math.floor(Math.random() * GAME_HEIGHT - 100) + 50;
		var new_y = Math.floor(Math.random() * GAME_WIDTH - 100) + 50;
		createjs.Tween.get(ball.position).to({x: new_x, y: new_y}, 500, createjs.Ease.easeOutInCirc).call(tweenComplete);
	}
  }
}

function tweenComplete()
{
	ballReady = 1;
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

function animate() {
  requestAnimationFrame(animate);
  
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

function start() {
	renderer.render(menu);
}
start();
