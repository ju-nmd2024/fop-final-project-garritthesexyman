function startScreen() {
  background(250, 247, 231);
  push();
  fill(200, 0, 0);
  rect(150, 200, 100, 50, 10);
  pop();
  textSize(20);
  fill(0);
  text("Start", 180, 230);
  textSize(17);
  text("There will be 100 platforms,", 100, 350);
  text("your goal is to jump as many times as possible", 20, 370);
}


function gameScreen() {
  background(250, 247, 231);
  text("Game", 187, 20);

  //show the character in gamescreen
  player.display();
  player.move();

  //for-loop for platform distance
  //our chatgpt conversation dissapeared because we werent signed in. the for-loop code was found by asking chatgpt and copied the code that it recomended
  for (let platta of platforms) {
    platta.display();
    platta.update();

    // calls the function from the platformclass
      if (platta.collision(x, jumperY) && player.velocityY > 0) {
        jumperY = platta.platformY - 50;
       player.velocityY = -8;

       //adds a point for every jump
       score += 1;
     }
    
     //displaying the score and highscore on gamescreen
     textSize(20);
     fill(0);
     text("Score: " + score, 10, 30);
     text("High Score:" + highscore, 10, 50);
  }
}

function resultScreenLoss() {
  background(250, 247, 231);
  push();
  fill(200, 0, 0);
  rect(150, 300, 100, 50, 10);
  pop();
  textSize(20);
  fill(0);
  text("You Lost", 160, 250);
  text("Play Again", 152, 330);
  text("Press ´R´ Key to reset or ´Play again´", 30, 500);

  //displaying the score and highscore on resultscreen
  textSize(20);
  fill(0);
  text("Score: " + score, 10, 30);
  text("High Score:" + highscore, 10, 50);
}

let player;
let speed = 0;
let x = 185;
let gravity = 0.3;
let jumperY = 200;
let platta;

//array
let platforms = [];
let startY = 500;
let state = "start";

let score = 0;
let highscore = 0;

class jumper {

  //defining variable
  constructor() {
    this.velocityY = 0;
  }


  display() {
    // display character
    push();
    textSize(40);
    text("🗿", x-5, jumperY+40); 
    pop();
  }
  
  //moves the player left and right
  move() {
    if (keyIsDown(39)) {
      speed = 7;
    } else if (keyIsDown(37)) {
      speed = -7;
    } else {
      speed = 0;
    }

    //if player goes to the right end of screen they will warp around to the other side
    if (x > 400) {
      x = 0;
    } else if (x < 0) {
      x = 400;
    }

    x += speed;

    //adding the velocity to the gravity and then uptading the player position
    this.velocityY += gravity;
    jumperY += this.velocityY;
  }
}

class platform {
  //defining variables
  constructor(x, y) {
    this.platformX = x;
    this.platformY = y;
  }

  display() {
    //displaying the platform
    fill(50, 200, 50);
    rect(this.platformX, this.platformY, 50, 10, 5);
  }

  update() {

    //new looped platforms dont move down at the same time as others 
  
    if (player.velocityY < 0) {
      this.platformY -= player.velocityY;
    }
    
    //calculate points for highscore
    let movement = this.prevY - this.platformY;
    if (movement >=100){
      score += Math.floor(movement / 100);
      this.prevY = this.platformY;
    }

    //stops the player from junmping over the screen too far
    if (jumperY <= -70){
      player.velocityY =0;
    }
  }

  //function that checks if the terms are fullfilled and then sends true or false to where this function is called
  collision(x, jumperY) {
    return (x + 20 > this.platformX && x + 15 < this.platformX + 50 && jumperY + 50 >= this.platformY && jumperY + 50 <= this.platformY + 15);
  }


}

function setup() {
  createCanvas(400, 550);
  frameRate(50);

  player = new jumper();

  //create 5 platforms
  for (let i = 0; i < 100; i++) {
    platforms.push(new platform(random(0, 350), startY));

    startY -= random(90, 120); //Next platform creates randomly between 90-120 pxl from the previouse one
  }
}

function draw() {
  //letting the game know when the start screen will change to gamescreen from startscreen
  if (state === "start") {
    startScreen();
    if (mouseIsPressed && mouseX > 150 && mouseX < 250 && mouseY > 200 && mouseY < 250) {
      state = "game";
    }
  } else if (state === "game") {
    gameScreen();
    if (jumperY > 500){
      
      state = "end";

      //if you break the highscore your new one will show
      if (score > highscore){
        highscore = score;
      }
      //resets the player
      jumperY = 200;
      x = 185;
      player.velocityY = 0;
      startY = random(500, 550);
      platforms = [];

      //Resetting the platforms to make a new pattern
      for (let i = 0; i < 100; i++) {
        platforms.push(new platform(random(0, 350), startY));
        startY -= random(90, 120); 
      }
      
    }
  } else if (state === "end") {
    //letting the game know when the start screen will change to gamescreen from resultscreen
    resultScreenLoss();
    if (mouseIsPressed && mouseX > 150 && mouseX < 250 && mouseY > 300 && mouseY < 350 || keyIsDown(82)) {
      state = "game";
      score = 0;
    }
  }
}