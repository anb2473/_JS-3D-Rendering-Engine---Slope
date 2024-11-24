let gameWindow = document.getElementById("gameBoard");
let soundBtn = document.getElementById("music-btn")
let ctx = gameWindow.getContext('2d');
let running = true;
let fov = 500;
let boardBackground = "black";
let score = 0;
let highscore = 0;
let dropZ = 0;
let offsetX = 0;
let xVelocity = 0;
let blocks = [-1, -1, -1, -1, -1, -1, -1, -1];

let xOffsets = [];
let yOffsets = [];
let zOffsets = [];
let expandRate = 0.05;

let timoutDelay = 200;

let difficult = 6;

gameWindow.width = window.innerWidth;
gameWindow.height = window.innerHeight;

window.addEventListener("keydown", checkKeys);
window.addEventListener("keydown", checkRestart);

soundBtn.addEventListener("click", startMusic);

gameLoop();

function startMusic(event){
    const audio = new Audio('BackgroundAudio.mp3');
    audio.play();
    soundBtn.remove();
}

function gameLoop(){
    if (running){
        setTimeout(() => {
            clearBoard();

            offsetX += xVelocity;

            renderDropFloor();
            renderDropLeftSide();
            renderDropRightSide();
            renderDropRoof();

            drawBlocks();

            resizeWindow();

            drawUI();

            reduceVelocity();

            reduceDropZ();

            checkWallCollision();

            gameLoop();

            if (difficult > 1){
                difficult -= 0.0001;
            }
        }, 10)
    }
    else{
        setTimeout(() => {
            displayGameOver();
            gameLoop();
        });
    }
}

function resizeWindow(){
    if (gameWindow.width !== window.innerWidth){
        gameWindow.width = window.innerWidth;
    }
    if (gameWindow.height !== window.innerHeight){
        gameWindow.height = window.innerHeight;
    }
}

function setDiffFigures(){
    timoutDelay = 200;

    xOffsets = [];
    yOffsets = [];
    zOffsets = [];

    for (let i = 0; i < 6; i++){
        xOffsets.push(Math.floor(Math.random() * 10) - 5);
        yOffsets.push(Math.floor(Math.random() * 10) - 5);
        zOffsets.push(Math.floor(Math.random() * 10) - 5);
    }

    expandRate = 0.05;

    if (score > highscore){
        highscore = score;
    }

    difficult = 4;
}

function checkWallCollision(){
    if (-offsetX < -425 || -offsetX > 425){
        setDiffFigures();
        running = false;
    }
}

function roundToTenth(num) {
    return Math.round(num * 10);
}

function drawBlocks(){
    let depth = 9;
    for (let block of blocks){
        if (depth === 2){
            draw3dCube(-offsetX, 200, 1000, 125, 125, 125, 0, -xVelocity / 2, 0, "rgba(100, 255, 100)");
        }

        if (block === -1){
            depth--;
            continue;
        }

        if (check3dCollision(-offsetX - 18.75, 200 - 18.75, 1000 - 18.75, 75, 75, 75, -600 + (block * 200) - 50, 50, (depth * 500) - dropZ - 125, 200, 200, 500)){
            setDiffFigures();
            running = false;
        }

        draw3dCube(-600 + (block * 200), 100, (depth * 500) - dropZ, 200, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

        depth--;
    }
}

function drawBlocksWithoutCheck(){
    let depth = 9;
    for (let block of blocks){
        if (depth === 2){
            draw3dExtrapolatedCube(-offsetX, 200, 1000, 125, 125, 125, 0, -xVelocity / 2, 0, "rgba(100, 255, 100)");
        }

        if (block === -1){
            depth--;
            continue;
        }

        draw3dCube(-600 + (block * 200), 100, (depth * 500) - dropZ, 200, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

        depth--;
    }
}

function check3dCollision(x1, y1, z1, width1, height1, depth1, x2, y2, z2, width2, height2, depth2) {
    if (x1 + width1 < x2 || x1 > x2 + width2) {
        return false;
    }

    if (y1 + height1 < y2 || y1 > y2 + height2) {
        return false;
    }

    return !(z1 + depth1 < z2 || z1 > z2 + depth2);
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadBlocks(){
    if (randint(0, difficult) === 0){
        return randint(1, 5);
    }

    return -1;
}

function reduceDropZ(){
    dropZ += 20;

    if (dropZ >= 500) {
        score++;
        blocks.pop();
        blocks.unshift(loadBlocks());
        dropZ = 0;
    }
}

function reduceVelocity(){
    if (xVelocity >= 0.25){
        xVelocity -= 0.25;
    }
    else if (xVelocity <= -0.25){
        xVelocity += 0.25;
    }
}

function checkKeys(event){
    const keyPressed = event.keyCode;
    const left = 65;
    const right = 68;

    if (keyPressed === left){
        xVelocity += 1.5;
    }
    else if (keyPressed === right){
        xVelocity -= 1.5;
    }

    if (xVelocity > 10){
        xVelocity = 10;
    }

    if (xVelocity < -10){
        xVelocity = -10;
    }
}

function renderDropLeftSide(){
    draw3dSide(-500, 100, 500 - dropZ / 2, 0, 200, 500 - dropZ / 2, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -100, 500 - dropZ / 2, 0, 200, 500 - dropZ / 2, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -300, 500 - dropZ / 2, 0, 200, 500 - dropZ / 2, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -500, 500 - dropZ / 2, 0, 200, 500 - dropZ / 2, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(-500, 100, 1000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -100, 1000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -300, 1000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -500, 1000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(-500, 100, 1500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -100, 1500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -300, 1500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -500, 1500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(-500, 100, 2000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -100, 2000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -300, 2000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -500, 2000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(-500, 100, 2500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -100, 2500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -300, 2500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -500, 2500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(-500, 100, 3000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -100, 3000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -300, 3000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -500, 3000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(-500, 100, 3500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -100, 3500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -300, 3500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -500, 3500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(-500, 100, 4000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -100, 4000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -300, 4000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(-500, -500, 4000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
}

function renderDropRightSide(){
    draw3dSide(500, 100, 500 - dropZ / 2, 0, 200, 500 - dropZ / 2, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -100, 500 - dropZ / 2, 0, 200, 500 - dropZ / 2, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -300, 500 - dropZ / 2, 0, 200, 500 - dropZ / 2, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -500, 500 - dropZ / 2, 0, 200, 500 - dropZ / 2, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(500, 100, 1000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -100, 1000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -300, 1000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -500, 1000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(500, 100, 1500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -100, 1500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -300, 1500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -500, 1500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(500, 100, 2000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -100, 2000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -300, 2000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -500, 2000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(500, 100, 2500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -100, 2500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255,50, 50)");
    draw3dSide(500, -300, 2500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -500, 2500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(500, 100, 3000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -100, 3000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -300, 3000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -500, 3000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(500, 100, 3500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -100, 3500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -300, 3500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -500, 3500 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");

    draw3dSide(500, 100, 4000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -100, 4000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -300, 4000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
    draw3dSide(500, -500, 4000 - dropZ, 0, 200, 500, 0, 0, 0, "rgba(255, 50, 50)");
}

function renderDropFloor(){
    draw3dTop(-400, 300, 500 - dropZ / 2, 200, 200, 500 - dropZ, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, 300, 500 - dropZ / 2, 200, 200, 500 - dropZ, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, 300, 500 - dropZ / 2, 200, 200, 500 - dropZ, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, 300, 500 - dropZ / 2, 200, 200, 500 - dropZ, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, 300, 500 - dropZ / 2, 200, 200, 500 - dropZ, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, 300, 1000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, 300, 1000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, 300, 1000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, 300, 1000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, 300, 1000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, 300, 1500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, 300, 1500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, 300, 1500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, 300, 1500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, 300, 1500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, 300, 2000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, 300, 2000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, 300, 2000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, 300, 2000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, 300, 2000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, 300, 2500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, 300, 2500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, 300, 2500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, 300, 2500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, 300, 2500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, 300, 3000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, 300, 3000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, 300, 3000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, 300, 3000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, 300, 3000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, 300, 3500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, 300, 3500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, 300, 3500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, 300, 3500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, 300, 3500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, 300, 4000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, 300, 4000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, 300, 4000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, 300, 4000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, 300, 4000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    drawUI();
}

function renderDropRoof(){
    draw3dTop(-400, -500, 500 - dropZ / 2, 200, 200, 500 - dropZ, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, -500, 500 - dropZ / 2, 200, 200, 500 - dropZ, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, -500, 500 - dropZ / 2, 200, 200, 500 - dropZ, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, -500, 500 - dropZ / 2, 200, 200, 500 - dropZ, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, -500, 500 - dropZ / 2, 200, 200, 500 - dropZ, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, -500, 1000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, -500, 1000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, -500, 1000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, -500, 1000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, -500, 1000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, -500, 1500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, -500, 1500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, -500, 1500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, -500, 1500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, -500, 1500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, -500, 2000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, -500, 2000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, -500, 2000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, -500, 2000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, -500, 2000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, -500, 2500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, -500, 2500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, -500, 2500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, -500, 2500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, -500, 2500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, -500, 3000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, -500, 3000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, -500, 3000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, -500, 3000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, -500, 3000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, -500, 3500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, -500, 3500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, -500, 3500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, -500, 3500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, -500, 3500 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")

    draw3dTop(-400, -500, 4000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(-200, -500, 4000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(0, -500, 4000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(200, -500, 4000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    draw3dTop(400, -500, 4000 - dropZ, 200, 200, 500, 0, 0, 0, "rgba(100, 255, 100)")
    drawUI();
}

function drawUI(){
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 30, 30);
    ctx.fillText("Highscore: " + highscore, ctx.measureText("Score: " + score).width + 50, 30);
}

function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWindow.width, gameWindow.height);
}

function rad(degrees) {
    return degrees * (Math.PI / 180);
}

function drawFront(x, y, z, width, height, depth, xRad, yRad, zRad, color){
    let x1 = Math.cos(yRad) * (x - width / 2) + Math.sin(yRad) * (z - depth / 2);
    let y1 = y - height / 2;
    let z1 = Math.cos(yRad) * (z - depth / 2) - Math.sin(yRad) * (x - width / 2);

    let x2 = Math.cos(yRad) * (x + width / 2) + Math.sin(yRad) * (z - depth / 2);
    let y2 = y1;
    let z2 = Math.cos(yRad) * (z - depth / 2) - Math.sin(yRad) * (x + width / 2);

    let x3 = x2;
    let y3 = y + height / 2;
    let z3 = z2;

    let x4 = x1;
    let y4 = y3;
    let z4 = z2;

    drawRect(
        (x1 / z1) * fov + (window.innerWidth / 2),
        (y1 / z1) * fov + (window.innerHeight / 2),
        (x2 / z2) * fov + (window.innerWidth / 2),
        (y2 / z2) * fov + (window.innerHeight / 2),
        (x3 / z3) * fov + (window.innerWidth / 2),
        (y3 / z3) * fov + (window.innerHeight / 2),
        (x4 / z4) * fov + (window.innerWidth / 2),
        (y4 / z4) * fov + (window.innerHeight / 2),
        color);
}

function drawBack(x, y, z, width, height, depth, xRad, yRad, zRad, color){
    let x1 = Math.cos(yRad) * (x - width / 2) + Math.sin(yRad) * (z + depth / 2);
    let y1 = y - height / 2;
    let z1 = Math.cos(yRad) * (z + depth / 2) - Math.sin(yRad) * (x - width / 2);

    let x2 = Math.cos(yRad) * (x + width / 2) + Math.sin(yRad) * (z + depth / 2);
    let y2 = y1;
    let z2 = Math.cos(yRad) * (z + depth / 2) - Math.sin(yRad) * (x + width / 2);

    let x3 = x2;
    let y3 = y + height / 2;
    let z3 = z2;

    let x4 = x1;
    let y4 = y3;
    let z4 = z2;

    drawRect(
        (x1 / z1) * fov + (window.innerWidth / 2),
        (y1 / z1) * fov + (window.innerHeight / 2),
        (x2 / z2) * fov + (window.innerWidth / 2),
        (y2 / z2) * fov + (window.innerHeight / 2),
        (x3 / z3) * fov + (window.innerWidth / 2),
        (y3 / z3) * fov + (window.innerHeight / 2),
        (x4 / z4) * fov + (window.innerWidth / 2),
        (y4 / z4) * fov + (window.innerHeight / 2),
        color);
}

function drawLeft(x, y, z, width, height, depth, xRad, yRad, zRad, color) {
    let x1 = Math.cos(yRad) * (x - width / 2) + Math.sin(yRad) * (z - depth / 2);
    let y1 = y - height / 2;
    let z1 = Math.cos(yRad) * (z - depth / 2) - Math.sin(yRad) * (x - width / 2);

    let x2 = Math.cos(yRad) * (x - width / 2) + Math.sin(yRad) * (z + depth / 2);
    let y2 = y1;
    let z2 = Math.cos(yRad) * (z + depth / 2) - Math.sin(yRad) * (x - width / 2);

    let x3 = x2;
    let y3 = y + height / 2;
    let z3 = z2;

    let x4 = x1;
    let y4 = y3;
    let z4 = z1;

    drawRect(
        (x1 / z1) * fov + (window.innerWidth / 2),
        (y1 / z1) * fov + (window.innerHeight / 2),
        (x2 / z2) * fov + (window.innerWidth / 2),
        (y2 / z2) * fov + (window.innerHeight / 2),
        (x3 / z3) * fov + (window.innerWidth / 2),
        (y3 / z3) * fov + (window.innerHeight / 2),
        (x4 / z4) * fov + (window.innerWidth / 2),
        (y4 / z4) * fov + (window.innerHeight / 2),
        color);
}

function drawRight(x, y, z, width, height, depth, xRad, yRad, zRad, color){
    let x1 = Math.cos(yRad) * (x + width / 2) + Math.sin(yRad) * (z - depth / 2);
    let y1 = y - height / 2;
    let z1 = Math.cos(yRad) * (z - depth / 2) - Math.sin(yRad) * (x + width / 2);

    let x2 = Math.cos(yRad) * (x + width / 2) + Math.sin(yRad) * (z + depth / 2);
    let y2 = y1;
    let z2 = Math.cos(yRad) * (z + depth / 2) - Math.sin(yRad) * (x + width / 2);

    let x3 = x2;
    let  y3 = y + height / 2;
    let z3 = z2;

    let x4 = x1;
    let y4 = y3;
    let z4 = Math.cos(yRad) * (z - depth / 2) - Math.sin(yRad) * (x + width / 2);

    drawRect(
        (x1 / z1) * fov + (window.innerWidth / 2),
        (y1 / z1) * fov + (window.innerHeight / 2),
        (x2 / z2) * fov + (window.innerWidth / 2),
        (y2 / z2) * fov + (window.innerHeight / 2),
        (x3 / z3) * fov + (window.innerWidth / 2),
        (y3 / z3) * fov + (window.innerHeight / 2),
        (x4 / z4) * fov + (window.innerWidth / 2),
        (y4 / z4) * fov + (window.innerHeight / 2),
        color);
}

function drawTop(x, y, z, width, height, depth, xRad, yRad, zRad, color){
    let x1 = Math.cos(yRad) * (x - width / 2) + Math.sin(yRad) * (z - depth / 2);
    let y1 = y - height / 2;
    let z1 = Math.cos(yRad) * (z - depth / 2) - Math.sin(yRad) * (x - width / 2);

    let x2 = Math.cos(yRad) * (x + width / 2) + Math.sin(yRad) * (z - depth / 2);
    let y2 = y1;
    let z2 = Math.cos(yRad) * (z - depth / 2) - Math.sin(yRad) * (x + width / 2);

    let x3 = Math.cos(yRad) * (x + width / 2) + Math.sin(yRad) * (z + depth / 2);
    let y3 = y1;
    let z3 = Math.cos(yRad) * (z + depth / 2) - Math.sin(yRad) * (x + width / 2);

    let x4 = Math.cos(yRad) * (x - width / 2) + Math.sin(yRad) * (z + depth / 2);
    let y4 = y1;
    let z4 = Math.cos(yRad) * (z + depth / 2) - Math.sin(yRad) * (x - width / 2);

    drawRect(
        (x1 / z1) * fov + (window.innerWidth / 2),
        (y1 / z1) * fov + (window.innerHeight / 2),
        (x2 / z2) * fov + (window.innerWidth / 2),
        (y2 / z2) * fov + (window.innerHeight / 2),
        (x3 / z3) * fov + (window.innerWidth / 2),
        (y3 / z3) * fov + (window.innerHeight / 2),
        (x4 / z4) * fov + (window.innerWidth / 2),
        (y4 / z4) * fov + (window.innerHeight / 2),
        color);
}

function drawBottom(x, y, z, width, height, depth, xRad, yRad, zRad, color){
    x1 = Math.cos(yRad) * (x - width / 2) + Math.sin(yRad) * (z - depth / 2);
    y1 = y + height / 2;
    z1 = Math.cos(yRad) * (z - depth / 2) - Math.sin(yRad) * (x - width / 2);

    x2 = Math.cos(yRad) * (x + width / 2) + Math.sin(yRad) * (z - depth / 2);
    y2 = y + height / 2;
    z2 = Math.cos(yRad) * (z - depth / 2) - Math.sin(yRad) * (x + width / 2);

    x3 = Math.cos(yRad) * (x + width / 2) + Math.sin(yRad) * (z + depth / 2);
    y3 = y + height / 2;
    z3 = Math.cos(yRad) * (z + depth / 2) - Math.sin(yRad) * (x + width / 2);

    x4 = Math.cos(yRad) * (x - width / 2) + Math.sin(yRad) * (z + depth / 2);
    y4 = y + height / 2;
    z4 = Math.cos(yRad) * (z + depth / 2) - Math.sin(yRad) * (x - width / 2);

    drawRect(
        (x1 / z1) * fov + (window.innerWidth / 2),
        (y1 / z1) * fov + (window.innerHeight / 2),
        (x2 / z2) * fov + (window.innerWidth / 2),
        (y2 / z2) * fov + (window.innerHeight / 2),
        (x3 / z3) * fov + (window.innerWidth / 2),
        (y3 / z3) * fov + (window.innerHeight / 2),
        (x4 / z4) * fov + (window.innerWidth / 2),
        (y4 / z4) * fov + (window.innerHeight / 2),
        color);
}

function draw3dCube(x, y, z, width, height, depth, xRot, yRot, zRot, color){
    x += offsetX;

    let xRad = rad(xRot);
    let yRad = rad(yRot);
    let zRad = rad(zRot);

    drawBack(x, y, z, width, height, depth, xRad, yRad, zRad, color);

    drawBottom(x, y, z, width, height, depth, xRad, yRad, zRad, color);

    drawLeft(x, y, z, width, height, depth, xRad, yRad, zRad, color);

    drawRight(x, y, z, width, height, depth, xRad, yRad, zRad, color);

    drawTop(x, y, z, width, height, depth, xRad, yRad, zRad, color);

    drawFront(x, y, z, width, height, depth, xRad, yRad, zRad, color);
}

function draw3dTop(x, y, z, width, height, depth, xRot, yRot, zRot, color){
    x += offsetX;

    let xRad = rad(xRot);
    let yRad = rad(yRot);
    let zRad = rad(zRot);

    drawTop(x, y, z, width, height, depth, xRad, yRad, zRad, color);
}

function draw3dSide(x, y, z, width, height, depth, xRot, yRot, zRot, color){
    x += offsetX;

    let xRad = rad(xRot);
    let yRad = rad(yRot);
    let zRad = rad(zRot);

    drawLeft(x, y, z, width, height, depth, xRad, yRad, zRad, color);
}

function drawRect(x1, y1, x2, y2, x3, y3, x4, y4, color){
    let path = new Path2D();

    path.moveTo(x1, y1);
    path.lineTo(x2, y2);
    path.lineTo(x3, y3);
    path.lineTo(x4, y4);
    path.lineTo(x1, y1);

    ctx.fillStyle = "black";
    ctx.fill(path);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.stroke(path);
}

function displayGameOver(){
    timoutDelay--;

    clearBoard();

    resizeWindow();

    renderDropFloor();
    renderDropLeftSide();
    renderDropRightSide();
    renderDropRoof();

    drawBlocksWithoutCheck();

    drawUI();

    if (timoutDelay <= 0){
        ctx.fillStyle = "rgba(0, 0, 0, " + (Math.max(Math.abs(timoutDelay / 100), 0)) + ")";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        ctx.fillStyle =  "rgba(100, 255, 100, " + (Math.max(Math.abs(timoutDelay / 100), 0)) + ")";
        ctx.font = "50px Arial";
        ctx.fillText("Slope", window.innerWidth / 2 - 100, window.innerHeight / 2 - 100);
        ctx.fillText("Press R to Play Again", window.innerWidth / 2 - 250, window.innerHeight / 2);

        ctx.font = "30px Arial";
        ctx.fillText("Score: " + score + "   |", window.innerWidth / 2 - ctx.measureText("Score: " + score + "   |").width - 35, window.innerHeight / 2 + 75);
        ctx.fillText("Highscore: " + highscore, window.innerWidth / 2 - 25, window.innerHeight / 2 + 75);

        ctx.font = "15px Arial";
        ctx.fillText("Created by Austin Blass", window.innerWidth / 2 - 100, window.innerHeight / 2 + 300);
    }

    expandRate++;
}

function draw3dExtrapolatedCube(x, y, z, width, height, depth, xRot, yRot, zRot, color){
    x += offsetX;

    let xRad = rad(xRot);
    let yRad = rad(yRot);
    let zRad = rad(zRot);

    drawBack(x - xOffsets[0] * expandRate, y - yOffsets[0] * expandRate, z - zOffsets[0] * expandRate, width + xOffsets[0] * expandRate, height + yOffsets[0] * expandRate, depth + zOffsets[0] * expandRate, xRad, yRad, zRad, color);

    drawBottom(x - xOffsets[1] * expandRate, y - yOffsets[1] * expandRate, z - zOffsets[1] * expandRate, width + xOffsets[1] * expandRate, height + yOffsets[1] * expandRate, depth + zOffsets[1] * expandRate, xRad, yRad, zRad, color);

    drawLeft(x - xOffsets[2] * expandRate, y - yOffsets[2] * expandRate, z - zOffsets[2] * expandRate, width + xOffsets[2] * expandRate, height + yOffsets[2] * expandRate, depth + zOffsets[2] * expandRate, xRad, yRad, zRad, color);

    drawRight(x - xOffsets[3] * expandRate, y - yOffsets[3] * expandRate, z - zOffsets[3] * expandRate, width + xOffsets[3] * expandRate, height + yOffsets[3] * expandRate, depth + zOffsets[3] * expandRate, xRad, yRad, zRad, color);

    drawTop(x - xOffsets[4] * expandRate, y - yOffsets[4] * expandRate, z - zOffsets[4] * expandRate, width + xOffsets[4] * expandRate, height + yOffsets[4] * expandRate, depth + zOffsets[4] * expandRate, xRad, yRad, zRad, color);

    drawFront(x - xOffsets[5] * expandRate, y - yOffsets[5] * expandRate, z - zOffsets[5] * expandRate, width + xOffsets[5] * expandRate, height + yOffsets[5] * expandRate, depth + zOffsets[5] * expandRate, xRad, yRad, zRad, color);
}

function checkRestart(event){
    const keyPressed = event.keyCode;
    const r = 82;

    if (keyPressed === r){
        offsetX = 0;
        xVelocity = 0;
        blocks = [3, -1, -1, -1, -1, -1, -1, -1];
        dropZ = 0;
        running = true;
        score = 0;
    }
}