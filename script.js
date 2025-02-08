// board 
let boardWidth = 960;
let boardHeight = 768;
let ctx;

// player
let playerX = 5;
let playerY = 700;
let playerWidth = 64;
let playerHeight = 64;
let playerSpeed = 8;
let playerImg;

const player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight,
    health: 100,
    direction: {up: false, down: true, left: false, right: false}
}

let keys = {
    w: false,
    a: false,
    s: false,
    d: false
}

// weapon
let weaponWidth = 64;
let weaponHeight = 64;
let weapon = {
    x: boardWidth,
    y: boardHeight,
    width: weaponWidth,
    height: weaponHeight,
    active: false
}
let weaponImg;

// enemy
let enemyX = 200;
let enemyY = 100;
let enemyWidth = 64;
let enemyHeight = 64;
let enemy = {
    x: enemyX,
    y: enemyY,
    width: enemyWidth,
    height: enemyHeight,
    health: 100
}
let enemyImg;


// on load function
window.onload = function() {
    const canvas = document.getElementById("board");
    ctx = canvas.getContext("2d");

    playerImg = new Image();
    playerImg.src = "./assets/player.png";

    weaponImg = new Image();
    weaponImg.src = "./assets/weapon.png";

    enemyImg = new Image();
    enemyImg.src = "./assets/enemy.png";

    requestAnimationFrame(update);

    // player movement
    document.addEventListener("keydown", (e) => {
        keys[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
        keys[e.key] = false;
    });

    // player combat
    document.addEventListener("keypress", (e) => {
        if (e.key == "f") weapon.active = true;
    });
}   

// every tick
function update() {
    ctx.clearRect(0,0,boardWidth,boardHeight);
    // moving
    movePlayer();

    drawPlayer();
    drawEnemy();

    useWeapon();
    displayHealthbar();

    requestAnimationFrame(update);
}

function drawPlayer() {
    ctx.drawImage(playerImg,player.x,player.y,player.width,player.height);
}

function drawEnemy() {
    if (enemy.health > 0) ctx.drawImage(enemyImg,enemy.x,enemy.y,enemy.width,enemy.height);
}


function displayHealthbar() {
    ctx.fillStyle = "red";
    ctx.font="32px sans-serif";
    if (enemy.health > 0) ctx.fillText(enemy.health + " health",enemy.x+enemy.width/2-72,enemy.y-enemy.height/4);
    ctx.fillText(player.health + " health",player.x+player.width/2-72,player.y-player.height/4);
}

function movePlayer() {
    if (keys.w) {
        player.direction.up = true;
        player.direction.down = false;
        player.direction.left = false;
        player.direction.right = false;
        player.y = Math.max(0, player.y - playerSpeed);
    }
    if (keys.a) {
        player.direction.up = false;
        player.direction.down = false;
        player.direction.left = true;
        player.direction.right = false;
        player.x = Math.max(0, player.x - playerSpeed);
    }
    if (keys.s) {
        player.direction.up = false;
        player.direction.down = true;
        player.direction.left = false;
        player.direction.right = false;
        player.y = Math.min(boardHeight-player.height, player.y + playerSpeed);
    }
    if (keys.d) {
        player.direction.up = false;
        player.direction.down = false;
        player.direction.left = false;
        player.direction.right = true;
        player.x = Math.min(boardWidth-player.width, player.x + playerSpeed);
    }
}

function useWeapon() {
    if (weapon.active) {
        if (player.direction.up) {
            weapon.x = player.x;
            weapon.y = player.y - player.height;
        }
        if (player.direction.down) {
            weapon.x = player.x;
            weapon.y = player.y + player.height;
        }
        if (player.direction.left) {
            weapon.x = player.x - player.width;
            weapon.y = player.y;
        }
        if (player.direction.right) {
            weapon.x = player.x + player.width;
            weapon.y = player.y;
        }

        if (detectCollision(weapon,enemy)) enemy.health -= 10;

        ctx.drawImage(weaponImg,weapon.x,weapon.y,weapon.width,weapon.height);
        weapon.active = false;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}