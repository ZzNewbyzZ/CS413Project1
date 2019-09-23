var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer({width: 400, height: 400, backgroundColor: 0x4dff4d});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

var hero = new PIXI.Sprite(PIXI.Texture.fromImage("MyDude.png"));
var lastHorizDir;
var lastVertDir;

hero.position.x = 100;
hero.position.y = 100;
stage.addChild(hero);

function mouseHandler(e)
{
	var new_x = Math.floor(Math.random() * 300) + 50;
	var new_y = Math.floor(Math.random() * 300) + 50;
	createjs.Tween.get(hero.position).to({x: new_x, y: new_y}, 500, createjs.Ease.easeOutInCirc);
}

hero.interactive = true;
hero.on('mousedown', mouseHandler);

function keydownEventHandler(e)
{
	if (e.keyCode == 87) // W Key
	{
		lastVertDir = "Up";
		if(contain(hero, {x:32, y:32, width: 390, height:390}) == "top")
		{
			if(lastHorizDir == "Left")
			{
				hero.position.x -= 5;
			}
			else
			{
				hero.position.x += 5;
			}
		}
		else
		{
			hero.position.y -= 10;
		}
	}
	
	if(e.keyCode == 83) // S Key
	{
		lastVertDir = "Down";
		if(contain(hero, {x:32, y:32, width: 390, height:390}) == "bottom")
		{
			if(lastHorizDir == "Left")
			{
				hero.position.x -= 5;
			}
			else
			{
				hero.position.x += 5;
			}
		}
		else
		{
			hero.position.y += 10;
		}
	}
	
	if(e.keyCode == 65) // A Key
	{
		lastHorizDir = "Left";
		if(contain(hero, {x:32, y:32, width: 390, height:390}) == "left")
		{
			if(lastVertDir == "Up")
			{
				hero.position.y -= 5;
			}
			else
			{
				hero.position.y += 5;
			}
		}
		else
		{
			hero.position.x -= 10;
		}
	}
	
	if(e.keyCode == 68) // D Key
	{
		lastHorizDir = "Right";
		if(contain(hero, {x:32, y:32, width: 390, height:390}) == "right")
		{
			if(lastVertDir == "Up")
			{
				hero.position.y -= 5;
			}
			else
			{
				hero.position.y += 5;
			}
		}
		else
		{
			hero.position.x += 10;
		}
	}
}

document.addEventListener('keydown', keydownEventHandler);

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

function animate()
{
	requestAnimationFrame(animate);
	renderer.render(stage);
}
animate();