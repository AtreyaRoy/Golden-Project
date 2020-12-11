var ground,groundimg;
var mario,marioimg;
var clouds, cloudsimg;
var invisibleground;
var enemies,enemyimg;
var pipesGroup,cloudsGroup;
var START=2;
var PLAY =1;
var END = 0;
var gameState = START;
var score = 5;
var count = 0;
var coincount = 0;
var instruct;
var marioStanding;
var koopaImage;

function preload(){
  
  bg = loadImage("images/bg.png");
  groundimg = loadImage("images/ground.png");
  marioimg = loadAnimation("images/mario1.png","images/mario2.png");
  marioStanding = loadAnimation("images/mario_standing.png");
  pipesimg =loadImage("images/pipes.png");
  cloudsimg =loadImage("images/cloud.png");
  mario_deadimg = loadAnimation("images/mario_dead.png");
  gameoverimg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
  bulletimg = loadImage("images/bullet.png");
  enemyimg =loadAnimation("images/enemy1.png","images/enemy2.png");
	enemy_dieimg =loadAnimation("images/enemy1.png");
	marioheadimg = loadImage("images/mario-head.png");
	coinimg = loadImage("images/coin.png");
	textimg = loadImage("images/text.png");
}

function setup() { 
  createCanvas(1200, 400);
  ground = createSprite(600,390,1200,10);
  ground.addImage("ground",groundimg);
  ground.x = ground.width/2;

  mario = createSprite(50,335,10,10);
  mario.addAnimation("marioStand",marioStanding);
  mario.addAnimation("mario",marioimg);
  mario.addAnimation("mario_dead",mario_deadimg);
  mario.scale =0.3;


  invisibleground = createSprite(600,375,1200,10);
  invisibleground.visible = false;

 
  gameOver = createSprite(620,150);
  gameOver.addImage("gameover",gameoverimg);
  gameOver.scale = 0.5;

  restart = createSprite(1100,40);
  restart.addImage("restart",restartImg);
  restart.scale =0.15;

  gameOver.visible = false;
  restart.visible = false;

  pipesGroup = new Group();
  cloudsGroup = new Group();
  bulletGroup = new Group();
	enemyGroup = new Group();
	coinGroup = new Group();

	mariohead = createSprite(50,50,10,10);
	mariohead.addImage("mariohead",marioheadimg);
	mariohead.scale= 1.5;
	
	coin = createSprite(200,50,10,10);
	coin.addImage("coin",coinimg);

	instruct = createSprite(600,170);
	instruct.addImage("instruct",textimg);
	instruct.lifetime =200;


}

function draw() {
  background("skyblue");
	drawSprites();
	
  
	fill("black");
	textSize(35);
	textFont("monospace");
	text(" x ",70,60)
	text(score,120,60);
	
	textSize(35);
	text("SCORE:"+Math.round(count),320,60);
	text(coincount,250,60);
  text(" x ",200,60);
  mario.collide(invisibleground);

  if(gameState===START){
    mario.addAnimation("marioStand",marioStanding);
    ground.velocityX=0; 
   mario.x=50;
   mario.y=335;
   instruct = createSprite(600,170);
	 instruct.addImage("instruct",textimg);
   instruct.lifetime =150;
   
	  fill("RED");
	  textSize(32);
    text("Press S to Start the Game",100,100);
    if(keyDown("s")){
      gameState=PLAY;
      mario.changeAnimation("mario",marioimg);
    }
  }
  if(gameState === PLAY){
    ground.velocityX = -7;
		count= count +0.1;
    if(ground.x<0){
      ground.x = ground.width/2;
    }

    if(keyDown("UP_ARROW") && mario.y>329){ 
      mario.velocityY = -20;
    }

    if(keyWentDown("space")){
      bullet = createSprite(mario.x,mario.y);
      bullet.addImage("bullet",bulletimg);
      bullet.velocityX= 4;
      bulletGroup.add(bullet);

    }

    mario.velocityY = mario.velocityY + 1;
    spawnPipes();
    spawnClouds();
    spawnEnemies();
		spawnCoins();
    if(pipesGroup.isTouching(mario)){
			score=score-1;
      count = count-5;
      mario.velocityY=0;
      gameState = END;
    }
    if(enemyGroup.isTouching(mario)){
			score=score-1;
			count = count-5;
      gameState = START;
    }
  
    if(bulletGroup.isTouching(enemyGroup)){
      enemyGroup.destroyEach();
      bulletGroup.destroyEach();
      
		}
		for(var j =0; j<coinGroup.length;j++){
			if(coinGroup.isTouching(mario)){
				coinGroup.get(j).destroy();
				coincount =coincount +1 ;
			}
		}
		
  }
  else if(gameState === END){
    ground.velocityX = 0;
    mario.velocityY=0;
    cloudsGroup.setVelocityXEach(0);
    pipesGroup.setVelocityXEach(0);
    enemyGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    pipesGroup.setLifetimeEach(-1);
		enemyGroup.destroyEach();
		coinGroup.setVelocityXEach(0);
		coinGroup.setLifetimeEach(-1);
    mario.velocityY = 0;
    mario.changeAnimation("mario_dead",mario_deadimg);
    gameOver.visible = true;
    restart.visible = true; 
    
  }

  if(gameState === END && score>0){
    mario.addAnimation("marioStand",marioStanding);
    reset();
		
  }
  if(score===0){
    mario.addAnimation("marioStand",marioStanding); 
    gameState = END;
  }

  if(mousePressedOver(restart)){
	 reset();
	 count = 0;
	 score = 5;
	 coincount = 0;
	 coinGroup.destroyEach();
	 instruct = createSprite(600,170);
	 instruct.addImage("instruct",textimg);
   instruct.lifetime =150;
   mario.addAnimation("marioStand",marioStanding);
  }
  
}
function spawnPipes(){
  if(frameCount %90  === 0){
    pipes = createSprite(1200,320,10,10);
    pipes.addImage("pipes",pipesimg);
    pipes.velocityX = -5;
    pipes.scale = 0.5;
    pipes.lifetime = 240;
    pipesGroup.add(pipes);
  
  }
}
function spawnClouds(){
  if(frameCount %100  === 0){
    clouds = createSprite(1200,random(50,150),10,10);
    clouds.addImage("clouds",cloudsimg);
    clouds.velocityX = -3;
    clouds.scale = 2;
    clouds.lifetime = 420;
    cloudsGroup.add(clouds);
    clouds.depth=restart.depth;
    restart.depth += 1;

    coin.depth= restart.depth;
    coin.depth += 1;

    mariohead.depth = restart.depth;
    mariohead.depth += 1;


  }
}
function spawnEnemies(){
  if(frameCount % 300 === 0){
    enemies = createSprite(1200,330,10,20);
    
    enemies.addAnimation("enemy",enemyimg);
    enemies.scale=0.15;
    enemies.velocityX =-6;
    enemies.lifetime = 200;
    enemyGroup.add(enemies);
  }
  
}
function reset(){
  gameState = START;
  pipesGroup.destroyEach();
  cloudsGroup.destroyEach();
	enemyGroup.destroyEach();
	coinGroup.destroyEach();
  gameOver.visible = false;
	restart.visible = false;
//	mario.changeAnimation("marioStand",marioStanding);
	//mario.changeAnimation("mario",marioimg);
	
}

function spawnCoins(){
	if(frameCount%200 === 0){
		for(var i=0 ; i<5 ;i++){
			coin = createSprite(1200+i*20,200 ,10,10);
			coin.addImage("coin",coinimg);
			coin.velocityX = -4;
			coin.lifetime = 1000;
			coinGroup.add(coin);
		}
	}
}