const canvas = document.getElementById("gameCanvas");
const canvasContext = canvas.getContext("2d");

const pacmanFrame = document.getElementById("animations");
const ghostFrame = document.getElementById("ghosts");
const spriteSheet = document.getElementById("sprites");

let fps = 30;
let oneBlockSize = 20;
let wallColor = "#342DCA";
let wallSpaceWidth = oneBlockSize / 1.5;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";
let foodColor = "#FEB897";
let ghosts = [];
let ghostCount = 4;
let isScatter = true;

let scatterDuration = 7000; // 7 seconds for scatter mode
let chaseDuration = 20000; // 20 seconds for chase mode
let frightenDuration = 5000; // 5 seconds for frighten mode
let isDebug = false;
let ghostImageLocations = [
  { x: 0, y: 0 }, //red
  { x: 176, y: 0 }, //orange
  { x: 0, y: 121 }, // pink
  { x: 176, y: 121 }, //cyan
];
let createRect = (x, y, w, h, c) => {
  canvasContext.fillStyle = c;
  canvasContext.fillRect(x, y, w, h);
};
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_DOWN = 1;

// if 1 wall, if 0 not wall
// 21 columns // 23 rows
let score = 0;
let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  [6, 6, 6, 6, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 6, 6, 6, 6],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 0, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [6, 6, 6, 6, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 6, 6, 6, 6],
  [6, 6, 6, 6, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 6, 6, 6, 6],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
list_food = []

list_fruit = [];

for (let i = 0;i < map.length ; i++){
    for(let j = 0; j < map[i].length; j++){
        if(map[i][j] == 2){
            list_food.push({x: j, y: i});
        }
    }
}
for (let i =0;i<4;i++){
    let randomIndex = Math.floor(Math.random() * list_food.length);
    let randomFood = list_food[randomIndex];
    list_fruit.push(randomFood);
    list_food.splice(randomIndex, 1); // Remove the selected food from the list
    map[randomFood.y][randomFood.x] = 5; // Set the food position to 0 in the map
}

let ghostFrighten = [false, false, false, false]; // 4 ghosts

let ghostTargets = [
  { x: map[0].length - 1 - 1, y: 0 + 1, c: "255,0,0" }, // top left corner
  { x: 0 + 1, y: map.length - 1 - 1, c: "255,127,80" }, // bottom left corner
  { x: 0 + 1, y: 0 + 1, c: "255,192,203" }, // top right corner
  { x: map[0].length - 1 - 1, y: map.length - 1 - 1, c: "0,255,255" }, // bottom right corner
];
let ghostName = [
  "Blinky", // red
  "Clyde", // orange
  "Pinky", // pink
  "Inky", // cyan
];

// Helper function to convert hex color to RGB
let hexToRgb = (hex) => {
  let bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

let update = () => {
  pacman.moveProcess();
  pacman.eat();
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].moveProcess();
  }
};
let drawScore = () => {
  canvasContext.font = "15px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Score: " + score, 0, oneBlockSize * (map.length + 1));
};
let drawFood = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] == 2) {
        createRect(
          j * oneBlockSize + oneBlockSize / 2.5,
          i * oneBlockSize + oneBlockSize / 2.5,
          oneBlockSize / 5,
          oneBlockSize / 5,
          foodColor
        );
      }
      // draw fruit
      if (map[i][j] == 5){
        createRect(
            j * oneBlockSize + oneBlockSize / 4,
            i * oneBlockSize + oneBlockSize / 4,
            oneBlockSize / 2,
            oneBlockSize / 2,
            foodColor
          );
      }
    }
  }
};
let drawGhosts = () => {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].draw();
  }
};
let drawPinkyTarget = () => {
  canvasContext.fillStyle = `rgba(255,192,203,0.75)`;

  if (pacman.direction == DIRECTION_RIGHT) {
    canvasContext.fillRect(
      (pacman.getMapX() + 2) * oneBlockSize,
      pacman.getMapY() * oneBlockSize,
      oneBlockSize,
      oneBlockSize
    );
  } else if (pacman.direction == DIRECTION_LEFT) {
    canvasContext.fillRect(
      (pacman.getMapX() - 2) * oneBlockSize,
      pacman.getMapY() * oneBlockSize,
      oneBlockSize,
      oneBlockSize
    );
  } else if (pacman.direction == DIRECTION_UP) {
    canvasContext.fillRect(
      (pacman.getMapX() - 2) * oneBlockSize,
      (pacman.getMapY() - 2) * oneBlockSize,
      oneBlockSize,
      oneBlockSize
    );
  } else if (pacman.direction == DIRECTION_DOWN) {
    canvasContext.fillRect(
      pacman.getMapX() * oneBlockSize,
      (pacman.getMapY() + 2) * oneBlockSize,
      oneBlockSize,
      oneBlockSize
    );
  }
};
let drawClydeTarget = () => {
  canvasContext.strokeStyle = `rgba(255,127,80,0.5)`; // Set the color and opacity for the outline
  canvasContext.lineWidth = 2; // Set the thickness of the outline
  canvasContext.beginPath();
  canvasContext;
  canvasContext.arc(
    pacman.getMapX() * oneBlockSize + oneBlockSize / 2, // X-coordinate of the center
    pacman.getMapY() * oneBlockSize + oneBlockSize / 2, // Y-coordinate of the center
    oneBlockSize * 8, // Radius of the circle
    0, // Start angle (e.g., 45 degrees)
    2 * Math.PI // End angle (e.g., 135 degrees)
  );
  canvasContext.stroke(); // Draw the outline
};
let drawInkyTarget = () => {
  // draw Inky target when chase mode
  canvasContext.fillStyle = `rgba(0,255,255,0.5)`;
  // Calculate Inky's target based on Pacman's position and direction
  let pacmanTargetX = pacman.getMapX();
  let pacmanTargetY = pacman.getMapY();

  if (pacman.direction == DIRECTION_RIGHT) {
    pacmanTargetX += 2; // Two tiles ahead of Pacman
  } else if (pacman.direction == DIRECTION_LEFT) {
    pacmanTargetX -= 2;
  } else if (pacman.direction == DIRECTION_UP) {
    pacmanTargetY -= 2;
  } else if (pacman.direction == DIRECTION_DOWN) {
    pacmanTargetY += 2;
  }
  // Calculate the vector from Blinky to Pacman's target
  let blinky = ghosts.find((ghost) => ghost.name === "Blinky");
  if (blinky) {
    let targetX = pacmanTargetX + (pacmanTargetX - blinky.getMapX());
    let targetY = pacmanTargetY + (pacmanTargetY - blinky.getMapY());

    // Draw Inky's target
    canvasContext.fillRect(
      targetX * oneBlockSize,
      targetY * oneBlockSize,
      oneBlockSize,
      oneBlockSize
    );
  }
};

let drawGhostsTarget = () => {
  // draw ghost targets when dead
  for (let i = 0; i < ghosts.length; i++) {
    if (ghosts[i].isDead){
      canvasContext.fillStyle = `rgba(${ghostTargets[i].c}, 1)`;
      canvasContext.fillRect(
        (9 * oneBlockSize) + oneBlockSize,
        (10 * oneBlockSize) + oneBlockSize,
        oneBlockSize,
        oneBlockSize
      );
    }
  }
  if (isScatter) {
    for (let i = 0; i < ghosts.length; i++) {
      if (ghosts[i].isDead) continue;
      canvasContext.fillStyle = `rgba(${ghostTargets[i].c}, 0.75)`;
      canvasContext.fillRect(
        ghostTargets[i].x * oneBlockSize,
        ghostTargets[i].y * oneBlockSize,
        oneBlockSize,
        oneBlockSize
      );
    }
  } else {
    drawPinkyTarget();
    drawClydeTarget();
    drawInkyTarget();
  }
  // draw ghost targets

  // draw ghost directions
  for (let i = 0; i < ghosts.length; i++) {
    if (ghosts[i].moveSet.length > 0) {
      let currentGhostPosX = ghosts[i].getMapX();
      let currentGhostPosY = ghosts[i].getMapY();
      for (let j = 0; j < ghosts[i].moveSet.length; j++) {
        canvasContext.fillStyle = `rgba(${ghostTargets[i].c}, 0.25)`;
        if (ghosts[i].moveSet[j] == DIRECTION_RIGHT) {
          canvasContext.fillRect(
            (currentGhostPosX + 1) * oneBlockSize,
            currentGhostPosY * oneBlockSize,
            oneBlockSize,
            oneBlockSize
          );
          currentGhostPosX += 1;
        }
        if (ghosts[i].moveSet[j] == DIRECTION_LEFT) {
          canvasContext.fillRect(
            (currentGhostPosX - 1) * oneBlockSize,
            currentGhostPosY * oneBlockSize,
            oneBlockSize,
            oneBlockSize
          );
          currentGhostPosX -= 1;
        }
        if (ghosts[i].moveSet[j] == DIRECTION_UP) {
          canvasContext.fillRect(
            currentGhostPosX * oneBlockSize,
            (currentGhostPosY - 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize
          );
          currentGhostPosY -= 1;
        }
        if (ghosts[i].moveSet[j] == DIRECTION_DOWN) {
          canvasContext.fillRect(
            currentGhostPosX * oneBlockSize,
            (currentGhostPosY + 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize
          );
          currentGhostPosY += 1;
        }
        // canvasContext.fillRect(ghost)
        // canvasContext.fillRect(ghosts[i].getMapX()*oneBlockSize,
        //     ghosts[i].getMapY()*oneBlockSize,
        //     oneBlockSize,
        //     oneBlockSize);
      }
    }
  }
};
let draw = () => {
  createRect(0, 0, canvas.width, canvas.height, "black"); // clear canvas
  drawWall();
  drawFood();
  pacman.draw();
  drawScore();
  drawGhosts();
  // draw scatter
  canvasContext.font = "15px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(
    "Scatter: " + isScatter,
    oneBlockSize * (map[0].length / 2),
    oneBlockSize * (map.length + 1)
  );
  if (isDebug) {
    drawGhostsTarget();
  }
};

let gameLoop = () => {
  update();
  draw();
};

let gameInterval = setInterval(gameLoop, 1000 / fps); // 30 FPS

let drawWall = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] == 1) {
        createRect(
          j * oneBlockSize,
          i * oneBlockSize,
          oneBlockSize,
          oneBlockSize,
          wallColor
        );
      }
      if (j > 0 && map[i][j - 1] == 1) {
        createRect(
          j * oneBlockSize,
          i * oneBlockSize + wallOffset,
          wallSpaceWidth + wallOffset,
          wallSpaceWidth,
          wallInnerColor
        );
      }
      if (j < map[0].length - 1 && map[i][j + 1] == 1) {
        createRect(
          j * oneBlockSize + wallOffset,
          i * oneBlockSize + wallOffset,
          wallSpaceWidth + wallOffset,
          wallSpaceWidth,
          wallInnerColor
        );
      }

      if (i > 0 && map[i - 1][j] == 1) {
        createRect(
          j * oneBlockSize + wallOffset,
          i * oneBlockSize,
          wallSpaceWidth,
          wallSpaceWidth + wallOffset,
          wallInnerColor
        );
      }
      if (i < map.length - 1 && map[i + 1][j] == 1) {
        createRect(
          j * oneBlockSize + wallOffset,
          i * oneBlockSize + wallOffset,
          wallSpaceWidth,
          wallSpaceWidth + wallOffset,
          wallInnerColor
        );
      }
    }
  }
};
let createNewPacman = () => {
  pacman = new Pacman(
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 5
  );
};
let createGhosts = () => {
  ghosts = [];
  for (let i = 0; i < ghostCount; i++) {
    let newGhost = new Ghost(
      9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      pacman.s / 2,
      ghostImageLocations[i % 4].x,
      ghostImageLocations[i % 4].y,
      124,
      116,
      6 + i,
      ghostTargets[i % 4],
      ghostName[i % 4]
    );
    ghosts.push(newGhost);
  }
};
let toggleScatterChase = () => {
  isScatter = !isScatter;
  setTimeout(toggleScatterChase, isScatter ? scatterDuration : chaseDuration);
};

// Start the scatter-chase timer
setTimeout(toggleScatterChase, scatterDuration);
createNewPacman();
createGhosts();
gameLoop();
window.addEventListener("keydown", (event) => {
  let k = event.keyCode;
  setTimeout(() => {
    if (k == 37 || k == 65) {
      pacman.nextDirection = DIRECTION_LEFT;
    } else if (k == 38 || k == 87) {
      pacman.nextDirection = DIRECTION_UP;
    } else if (k == 39 || k == 68) {
      pacman.nextDirection = DIRECTION_RIGHT;
    } else if (k == 40 || k == 83) {
      pacman.nextDirection = DIRECTION_DOWN;
    }
  });
});

// listen to toggle debug mode for input
checkbox = document.getElementById("isDebug");

checkbox.addEventListener("change", (event) => {
  isDebug = event.target.checked;
});
