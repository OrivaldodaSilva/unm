let ground;
let lander;
var lander_img;
var bg_img;
var fuel=100;
var d;
var vx = 0;
var g = 0.05;
var vy = 0;
var gameState="play";

function preload()
{
  lander_img = loadImage("normal.png");
  bg_img = loadImage("bg.png");
  thrust=loadAnimation("b_thrust_1.png","b_thrust_2.png","b_thrust_3.png")
  left=loadAnimation("left_1.png","left_2.png")
  right=loadAnimation("right_thruster_1.png","right_thruster_2.png")
  explosao=loadAnimation("game over.png")
  terra_a_vista=loadImage("terra_a_vista.png")
  land = loadAnimation("landing1.png" ,"landing2.png","landing_3.png");
  alienImg=loadImage("alien waking.png")
  thrust.playing=true
  thrust.looping=false
  left.looping=false
  right.looping=false
  land.looping=false
  explosao.looping=false
}

function setup() {
  createCanvas(1000,700);
  frameRate(80);
  timer=1500
  lander = createSprite(100,50,30,30);
  lander.addImage(lander_img);
  lander.scale = 0.1;
  lander.addAnimation("thrusting",thrust)
  lander.addAnimation("left",left)
  lander.addAnimation("right",right)
  lander.addAnimation("crashing",explosao)
  lander.addAnimation("landing",land)
  ground=createSprite(500,690,1000,20)
  terra_avistada=createSprite(800,610,50,30)
  terra_avistada.addImage(terra_a_vista)
  terra_avistada.scale=0.3
  terra_avistada.setCollider("rectangle",0,180,400,100)
  rectMode(CENTER);
  textSize(15);
  alienGroup=new Group()
}

function draw() 
{
  background(51);
  image(bg_img,0,0);
  push();
  fill(255);
  text("Velocidade Vertical: "+round(vy),800,75);
  text("Gasolina: "+fuel,800,25);
  text("Velocidade Horizontal: "+round(vx),800,50);
  pop();
  var d = dist(lander.position.x,lander.position.y,terra_avistada.position.x,terra_avistada.position.y)
  if (d<=35&&(vy<2&&vy>-2)&&(vx<2&&vx>-2)) {
    vx=0
    vy=0
    g=0
    lander.changeAnimation("landing")
  }
  if (lander.collide(terra_avistada)===true) {
    gamestate="win"
  }
  if (lander.collide(ground)==true) {
    lander.changeAnimation("crashing")
    vx = 0
    fuel = 0
    vy = 0
    g = 0
    alienGroup.destroyEach()
    gameState="end"
    setTimeout(()=>{
      lander.destroy()
    },2000)
  }
  if (alienGroup.isTouching(lander)) {
    for (var i=0;i<alienGroup.length;i++) {
      if (alienGroup[i].isTouching(lander)) {
        fuel-=50 
        alienGroup[i].destroy()
      }
    }
  }
  //summon()
  //descida
  vy +=g;
  lander.position.y+=vy;
  lander.position.x+=vx;
  drawSprites();
  if (gameState==="end") {
    textSize(100)
    fill ("yellow")
    text ("fim",300,400)
  }
  if (gameState==="win") {
    textSize(100)
    fill ("yellow")
    text ("missão cumprida",300,400)
  }
  
}
function keyPressed() {
  if (keyCode===UP_ARROW) {
    upward_thrust()
    lander.changeAnimation("thrusting")
    thrust.nextFrame()
  }
  if (keyCode===RIGHT_ARROW&&fuel>0) {
    lander.changeAnimation("left")
    right_thrust ()
  }
  if (keyCode===LEFT_ARROW&&fuel>0) {
    lander.changeAnimation("right")
    left_thrust ()
  }
}
function upward_thrust() {
  vy=-3
  fuel-=1
}
function right_thrust() {
  vx+=0.5
  fuel-=1
}
function left_thrust() {
  vx-=0.5
  fuel-=1
}
function summon() {
  if (frameCount%80==0){
  alien=createSprite(random(0,width),random(500,height),40,40)
  alien.velocityX=+6
  alien.addImage(alienImg)
  alien.scale=0.2
  alienGroup.add(alien)
  }
  if (lander.getAnimationLabel()==="crashing") {
    alien.destroy()
  }
}