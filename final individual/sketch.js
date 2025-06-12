let img;            // Current drawing image (copy original image each time)
let dots = [];      // Stores all Dot instances
let xStep = 10;     // Lateral pixel spacing
let yStep = 10;     // Vertical pixel spacing
let imgScale = 1;   // Image zoom ratio
let imgXOffset = 0; // Image center offset
let imgYOffset = 0; // Reserve the vertical offset

let player;  
let food;
let blocks = [];
let score = 0; 
let gameOver = false;    //after touching the blocks iwill be true
let highScore = 0;

let blockSlider;        //changing block quantity
let previousBlockNumber = 10;     // usual number of blocks

let foodTimer;
let foodTimerLimit = 3500;       //time to reach to the food

function preload() {
  // Load the original image only once
  imgOriginal = loadImage("assets/Piet_Mondrian Broadway_Boogie_Woogie.jpeg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  calculateImageAndDots(); // Initialize the image and Dot data
  player = new Player(); // create player
  food = createFood();

  blockSlider = createSlider(5,15,10);   // blocks from 5 to 10
  blockSlider.position(1150,550);
  blockSlider.style('width', '150px');

  // Create some blocks
  for (let i = 0; i < blockSlider.value(); i++) {
    blocks.push(createBlock());
  }
}

function draw() {
  background(237, 225, 162);

 
//game over page
  if (gameOver) {
    textSize(28);
    text("Game Over! Press R to restart.", width / 3, windowHeight / 2);
    
    //theslider wouldnt go when gameover screen came and I tried many thing and it didnt work so I used AI for this part
     blockSlider.hide();  
    return;
  } else {
    blockSlider.show();  
  }
  

    //used p5.js website fo this part
    if (millis() - foodTimer > foodTimerLimit) { // If more than 3.5 seconds have passed
    food = createFood(); // Move food to a new position
    foodTimer = millis(); // Reset the timer
  }

  let currentBlockNumber = blockSlider.value();

  if (currentBlockNumber !== previousBlockNumber) {   //create blocks according to the slider
    let newBlocks = [];
    for (let i = 0; i < currentBlockNumber; i++) {
      newBlocks.push(createBlock());
    }
    blocks = newBlocks;
    previousBlockNumber = currentBlockNumber;
  }

   fill(219, 150, 19);
  
   //the texts in screen
   rect(1120, 250, 200,70 , 10);
  textSize(30);
  textStyle(BOLD);
  fill(0,0,0);
  text("Score", 1180, 220)
  text(score , 1210, 295);

  textSize(20);
  textStyle(NORMAL);
  text("High Score: " + highScore, 1160, 370);

  textSize(22);
  textStyle(BOLD);
  fill(10, 13, 89);
  text("EAT THE RED DOT AND", 44, 300);
  text("DON'T TOUCH BLOCKS!", 40, 330); 


  // Draw the dots
  for (let dot of dots) {
    dot.display();
  }

  // Draw the faded overlay
  fill(237, 225, 162, 80);  // Semi-transparent square to make more contrast between background and elements
  rect(0, 0, width, height);  

  player.update(); // Update player position
  player.display();

  food.display();
  
  // Display blocks
  for (let block of blocks) {
    block.display();
  }

  checkCollisions();
  checkFoodCollision();


}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateImageAndDots(); // Reconstruct the image with dots each time the window changes
}

function calculateImageAndDots() {
  dots = [];

  // Each time a new image object is copied from the original image, it is used for scaling
  img = imgOriginal.get();
  img.resize(0, height); // Scale by height, keeping the aspect ratio

  imgScale = height / img.height;
  imgXOffset = (width - img.width)/2 ;
  imgYOffset = 0; 

  for (let i = 0; i < img.width; i += xStep) {
    for (let j = 0; j < img.height; j += yStep) {
      let pixelColor = img.get(i, j);
      let bri = brightness(pixelColor);
      let size = map(bri, 0, 255, 20, 0);
      dots.push(new Dot(i + imgXOffset, j + imgYOffset, pixelColor, size));
    }
  }
}

class Player {
  constructor() {
    this.x = windowWidth/2;  // Start in the middle of the canvas (but within the image boundaries)
    this.y = windowHeight / 2;
    this.size = 20;
    this.speed = 5;
  }

  update() {
    // This method handles the movement of the player based on key presses

    // Move left
    if (keyIsDown(LEFT_ARROW) && this.x - this.size / 2 > imgXOffset-20) {
      this.x -= this.speed;
    }
    // Move right
    if (keyIsDown(RIGHT_ARROW) && this.x + this.size / 2 < imgXOffset + img.width +20) {
      this.x += this.speed;
    }
    // Move up
    if (keyIsDown(UP_ARROW) && this.y - this.size / 2 > imgYOffset-20) {
      this.y -= this.speed;
    }
    // Move down
    if (keyIsDown(DOWN_ARROW) && this.y + this.size / 2 < imgYOffset + img.height +20) {
      this.y += this.speed;
    }

    // Wrap player within image boundaries (left-right and top-bottom) and let the player get out but come back from the other side
    if (this.x > imgXOffset + img.width) {
      this.x = imgXOffset; // Wrap to the left edge of the image
    }
    if (this.x < imgXOffset) {
      this.x = imgXOffset + img.width; // Wrap to the right edge of the image
    }
    if (this.y > imgYOffset + img.height) {
      this.y = imgYOffset; // Wrap to the top edge of the image
    }
    if (this.y < imgYOffset) {
      this.y = imgYOffset + img.height; // Wrap to the bottom edge of the image
    }
  }

  display() {
    fill(0);
    ellipse(this.x, this.y, this.size, this.size);
  }
}


// Dot class to represent each dot in the grid
class Dot {
  constructor(x, y, color, size) {
    this.x = x;
    this.y = y;
    this.originalColor = color;
    this.color = color;
    this.size = size;
  }

  display() {
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }
}


// Food class
class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 25;
  }

  display() {
    fill(173, 21, 39);  // Red color for food
    ellipse(this.x, this.y, this.size, this.size);
  }
}

function createFood() {
  let foodX, foodY;
  let foodOverlaps = true;

  // Keep generating food position until it doesn't overlap with any block
  while (foodOverlaps) {
    foodX = random(imgXOffset, imgXOffset + img.width - 20);  // Horizontal position 
    foodY = random(imgYOffset, imgYOffset + img.height - 20); // Vertical position
    foodOverlaps = false;

    // Check for overlap with any block
    for (let block of blocks) {
      let d = dist(foodX, foodY, block.x + block.size , block.y + block.size);
      if (d < (block.size / 2 + 20 / 2)) {  // 20 is the food size
        foodOverlaps = true;
        break; // If it overlaps, break the loop and generate a new position
      }
    }
  }

  // Return a new food object with the valid position
  return new Food(foodX, foodY);
}


function createBlock() {
  let blockX, blockY;
  let overlap = true;


  while (overlap) {
    // creating random position for block inside image bounds, considering the block size
    blockX = random(imgXOffset, imgXOffset + img.width - 20); 
    blockY = random(imgYOffset, imgYOffset + img.height - 20); 

    overlap = false;

    // Check if the block overlaps with any existing blocks
    for (let block of blocks) {
      let d = dist(blockX, blockY, block.x, block.y);
      if (d < block.size) {  // If distance between blocks is too small, they overlap
        overlap = true;
        break;
      }
    }
  }

  // Return a new block object at a random position inside the image bounds
  return new Block(blockX, blockY);
}


// Block class
class Block {
  constructor(blockX, blockY) {
    this.x = blockX;
    this.y = blockY;
    this.size = 40;
    this.cornerRadius = 10;
  }

  display() {
    fill(31, 15, 102); 
    rect(this.x, this.y, this.size, this.size,  this.cornerRadius);
  }
}

// Change block positions after food is eaten
function changeBlockPositions() {
  for (let block of blocks) {
    let overlap = true;

    // Keep repositioning the block until it doesn't overlap with the player or food
    while (overlap) {
      block.x = random(imgXOffset, imgXOffset + img.width - block.size);  
      block.y = random(imgYOffset, imgYOffset + img.height - block.size); 

      overlap = false;
    

      //used Ai in this part because it had a bug that when I restarted the game sometimes the block was on the player or when in the game 
      //when the food was eaten the new block was created on top of  the player so it will be a game over and I tried to solve this but Icould not so I 
      //asked AI about this probelm.

      // Check if the block overlaps with the player
      let d = dist(block.x + block.size / 2, block.y + block.size / 2, player.x, player.y);
      if (d < (block.size / 2 + player.size / 2)) {  // If distance between block and player is too small, overlap
        overlap = true;
      }

      // Check if the block overlaps with the food
      let foodDist = dist(block.x + block.size / 2, block.y + block.size / 2, food.x, food.y);
      if (foodDist < (block.size / 2 + food.size / 2)) {  // If distance between block and food is too small, overlap
        overlap = true;
      }
    }
  }
}



function checkFoodCollision() {
  let d = dist(player.x, player.y, food.x, food.y);
  if (d < (player.size / 2 + food.size / 2)) {
    score++;
    food = createFood();  // Spawn new food 
     foodTimer = millis(); 
    changeBlockPositions(); // Move blocks when food is eaten
  }
}


function checkCollisions() {
  for (let block of blocks) {
    let d = dist(player.x, player.y, block.x + block.size / 2, block.y + block.size / 2);
    if (d < (player.size / 2 + block.size / 2)) {
      gameOver = true;
    if (score > highScore) {
        highScore = score;  // Update the high score
      }
    }
  }
}

// Restart the game
function keyPressed() {
  if (key === 'r' || key === 'R') {
    gameOver = false;
    score = 0;
    player.x = width / 2;
    player.y = height / 2;
    blocks = []; 
    // Recreate blocks
    for (let i = 0; i < 10; i++) {
      blocks.push(createBlock());
    }
    food = createFood();     // Reset food position
  }
}