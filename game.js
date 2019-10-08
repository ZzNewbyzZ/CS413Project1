var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(500, 500, {backgroundColor: 0x330033});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
var winner = new PIXI.Container();
var lastHorizDir;
var lastVertDir;
var count = 0;
var ballReady = 1;


text = new PIXI.Text('Score: ' + count,{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
stage.addChild(text);

winningText = new PIXI.Text('You Won!!',{fontFamily : 'Arial', fontSize: 72, fill : 0xff1010, align : 'center'});
winningText.position.x = 250;
winningText.position.y = 250;
winner.addChild(winningText);

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add("assets.json")
  .add("MainMusic.wav")
  .add("Pickup_Coin.wav")
  .add("Left_Foot.wav")
  .add("Right_Foot.wav")
  .load(ready);
  


function ready() {
	
  music = PIXI.audioManager.getAudio("MainMusic.wav");
  music.loop = true;
  music.play();
  
  coinUp = PIXI.audioManager.getAudio("Pickup_Coin.wav");
  
  leftFoot = PIXI.audioManager.getAudio("Left_Foot.wav");
  rightFoot = PIXI.audioManager.getAudio("Right_Foot.wav");
	
  ball = new PIXI.Sprite(PIXI.Texture.fromImage("ball.png"));
  ball.position.y = Math.floor(Math.random() * 300) + 50;
  ball.position.x = Math.floor(Math.random() * 300) + 50;
  stage.addChild(ball);
	
  standing = new PIXI.Sprite(PIXI.Texture.fromFrame("MyDude2.png"));
  standing.scale.x = 2;
  standing.scale.y = 2;
  standing.position.x = 200;
  standing.position.y = 200;
  standing.anchor.x = .5;
  stage.addChild(standing);
  
  var frames = [];

  for (var i=1; i<=4; i++) {
    frames.push(PIXI.Texture.fromFrame('MyDude' + i + '.png'));
  }

  runner = new PIXI.extras.MovieClip(frames);
  runner.scale.x = 2;
  runner.scale.y = 2;
  runner.position.x = 200;
  runner.position.y = 200;
  runner.anchor.x = .5;
  runner.animationSpeed = 0.1;
  runner.play();
  
  
  document.addEventListener('keydown', keydownEventHandler);
  document.addEventListener('keyup', keyupEventHandler);
}

function keydownEventHandler(e)
{
	if (e.keyCode == 87) // W Key
	{
		stage.removeChild(standing);
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
		stage.removeChild(standing);
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
		stage.removeChild(standing);
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
		stage.removeChild(standing);
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
}
	
function keyupEventHandler(e)
{
	standing.position.x = runner.position.x;
	standing.position.y = runner.position.y;
	standing.scale.x = runner.scale.x;
	stage.addChild(standing);
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
		var new_x = Math.floor(Math.random() * 400) + 50;
		var new_y = Math.floor(Math.random() * 400) + 50;
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
  renderer.render(stage);
}
animate();
