const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const ui = document.querySelector(".ui");

/** IMPORTANT MEASUREMENTS
 * Canvas width:"500" height="600"
 * Character width,height ="60"
 * Platforms width:"80" height="15"
 */
const canvasWidth = 500;
const canvasHeight = 620;
const characterWidth = 60;
const characterHeight = 60;
const platformWidth = 80;
const platformHeight = 15;
const gap = canvasHeight / 5;
/** end of Important Measurements */

// Minh

const initCharacter = {
  characterX: Math.round(canvasWidth / 2),
  characterY: Math.round(canvasHeight / 2),
  speed: 5,
};
let score = 0;
let level = 0;
const initPlatforms = [
  {
    platformX: Math.floor(Math.random() * (canvasWidth - platformWidth)),
    platformY: 0,
    speed: 1,
  },
  {
    platformX: Math.floor(Math.random() * (canvasWidth - platformWidth)),
    platformY: gap,
    speed: 1,
  },
  {
    platformX: Math.floor(Math.random() * (canvasWidth - platformWidth)),
    platformY: 2 * gap,
    speed: 1,
  },
  {
    platformX: Math.floor(Math.random() * (canvasWidth - platformWidth)),
    platformY: 3 * gap,
    speed: 1,
  },
  {
    platformX: Math.floor(Math.random() * (canvasWidth - platformWidth)),
    platformY: 4 * gap,
    speed: 1,
  },
  {
    platformX: Math.floor(Math.random() * (canvasWidth - platformWidth)),
    platformY: 5 * gap,
    speed: 1,
  },
];
let character = initCharacter;
let platforms = initPlatforms;

function drawPlatforms() {
  for (let index = 0; index < platforms.length; index++) {
    const platform = platforms[index];
    //draw shape
    // ctx.fillStyle = "rgba(156, 217, 107, 1)";
    // ctx.fillRect(
    //   platform.platformX,
    //   platform.platformY,
    //   platformWidth,
    //   platformHeight
    // );
    //draw image
    if (platformReady) {
      ctx.drawImage(
        platformImage,
        platform.platformX,
        platform.platformY,
        platformWidth,
        platformHeight
      );
    }
  }
}

function drawCharacter() {
  ctx.fillStyle = "rgba(217,156,107, 1)";
  //shape
  // ctx.fillRect(
  //   character.characterX,
  //   character.characterY,
  //   characterWidth,
  //   characterHeight
  // );
  //image
  if (characterReady) {
    ctx.drawImage(
      characterImage,
      character.characterX,
      character.characterY,
      characterWidth,
      characterHeight
    );
  }
}

let jumpTime = 30;
let isGameOver = false;

function intro() {
  let button = document.createElement("button");
  ui.appendChild(button);
  button.classList.add("intro");
  button.addEventListener("click", function () {
    main();
    button.style.display = "none";
  });
}

function update() {
  if (isGameOver === true) {
    let text = document.createElement("H1");
    let context = document.createTextNode("GAME OVER");
    text.appendChild(context);
    text.classList.add("reset");
    ui.appendChild(text);

    return;
  }

  if (37 in keysDown) {
    // Player is holding left key

    character.characterX -= 10;
  }
  if (39 in keysDown) {
    // Player is holding right key
    character.characterX += 10;
  }
  //border detection
  if (character.characterX < -characterWidth) {
    character.characterX = canvasWidth;
  } else if (character.characterX > canvasWidth) {
    character.characterX = -characterWidth / 2;
  }
  if (character.characterY > canvasHeight) {
    //gameover logic
    isGameOver = true;
  }
  // detection of the jump
  for (let index = 0; index < platforms.length; index++) {
    const platform = platforms[index];
    if (
      character.characterY + characterHeight >= platform.platformY &&
      character.characterY + characterHeight <
        platform.platformY + platformHeight &&
      character.characterX >= platform.platformX - platformWidth / 2 &&
      character.characterX <= platform.platformX + platformWidth
    ) {
      jumpTime = 30;
      score++;

      if (score % 15 === 0) {
        level++;
        character.speed += level / 3;
      }
      if (score >= 100) {
        isGameOver = true;
      }
    }
  }
  if (jumpTime > 0) {
    character.characterY -= character.speed;
    jumpTime -= 1;
  } else {
    character.characterY += character.speed * 1.25;
  }
  for (let index = 0; index < platforms.length; index++) {
    const platform = platforms[index];
    platform.platformY += platform.speed;
    if (platform.platformY >= canvasHeight) {
      platform.platformY = 0;

      platform.speed += level / 3;
      platform.platformX = Math.floor(
        Math.random() * (canvasWidth - platformWidth)
      );
    }
  }
}

//keyboard listener
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  addEventListener(
    "keydown",
    function (key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function (key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}
setupKeyboardListeners();
//Extras load image
let characterImage, platformImage;
let characterReady, platformReady;
// Setup + load image
function loadImages() {
  //load platforms image
  platformImage = new Image();
  platformImage.onload = function () {
    platformReady = true;
  };
  platformImage.src =
    "https://raw.githubusercontent.com/kubowania/Doodle-Jump/master/platform.png";

  // show the hero image
  characterImage = new Image();
  characterImage.onload = function () {
    characterReady = true;
  };
  characterImage.src =
    "https://raw.githubusercontent.com/JasonMize/coding-league-assets/master/doodle-jump-doodler.png";
}

//3.2 introducing Main function
function main() {
  //clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  requestAnimationFrame(main);
  drawPlatforms();
  drawCharacter();
  document.getElementById("score").innerHTML = score;
  document.getElementById("level").innerHTML = level;
}
loadImages();
intro();
//request animation frame
let w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;
