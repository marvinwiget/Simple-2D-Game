// board 
let boardWidth = 960;
let boardHeight = 768;
let ctx;

// player
let playerX = 300;
let playerY = 700;
let playerWidth = 64;
let playerHeight = 64;
let playerSpeed = 8;
let playerImg;

let dashX;
let dashY;

const player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight,
    health: 100,
    onDashCooldown: false,
    dashActive: false,
    direction: {up: false, down: true, left: false, right: false}
}

const keys = {
    w: false, // up
    a: false, // left
    s: false, // down
    d: false, // right
    f: false, // attack
    q: false // dash
}
const pressedKeys = new Set();


// weapon
let weaponWidth = 64;
let weaponHeight = 64;
let weapon = {
    x: boardWidth,
    y: boardHeight,
    width: weaponWidth,
    height: weaponHeight,
    active: false,
    onCooldown: false
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
        if (Object.keys(keys).includes(e.key)) {
            if (e.key != "q") {
                keys[e.key] = true;
                pressedKeys.add(e.key);
            }
        }
    });
    document.addEventListener("keyup", (e) => {
        keys[e.key] = false;
        pressedKeys.delete(e.key);
    });

    document.addEventListener("keypress", (e) => {
        if (e.key == "q") keys[e.key] = true;
    });

    setInterval(fps, 15);
}   

// every tick
function update() {
    ctx.clearRect(0,0,boardWidth,boardHeight);
    // moving
    drawPlayer();
    drawPlayerDash(dashX, dashY);
    drawWeapon();
    drawEnemy();
    displayHealthbar();
    displayCooldown();
    requestAnimationFrame(update);
}

function fps() {
    movePlayer();
    useWeapon();
}



function drawPlayer() {
    ctx.drawImage(playerImg,player.x,player.y,player.width,player.height);
}

function drawEnemy() {
    if (enemy.health > 0) ctx.drawImage(enemyImg,enemy.x,enemy.y,enemy.width,enemy.height);
}

function displayCooldown() {
    ctx.fillStyle = "red";
    ctx.font="32px sans-serif";
    ctx.textAlign = "left";

    if (player.onDashCooldown) ctx.fillStyle = "red";
    else ctx.fillStyle = "green";
    ctx.fillText("Dash Cooldown", boardWidth/7*5.15, boardHeight/30*27.5);

    if (weapon.onCooldown) ctx.fillStyle = "red";
    else ctx.fillStyle = "green";
    ctx.fillText("Attack Cooldown", boardWidth/7*5.15, boardHeight/30*29);
}

function displayHealthbar() {
    ctx.fillStyle = "red";
    ctx.font="32px sans-serif";
    ctx.textAlign = "center";
    if (enemy.health > 0) ctx.fillText(enemy.health + " health",enemy.x+enemy.width/2,enemy.y-enemy.height/4);
    ctx.fillText(player.health + " health",player.x+player.width/2,player.y-player.height/4);
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
    playerSpeed = 8;
    playerDash();
}

function playerDash() {
    if (keys.q && !player.onDashCooldown) {
        dashX = player.x;
        dashY = player.y;
        player.onDashCooldown = true;
        player.dashActive = true;
        if (pressedKeys.size > 1) playerSpeed *= 9;
        else playerSpeed *= 12;
        setTimeout(() => {player.dashActive = false}, 200); 
        setTimeout(() => {player.onDashCooldown = false}, 1000);
    }
}


function drawPlayerDash(dashX, dashY) {
    if (player.dashActive) {
        ctx.globalAlpha = 0.25;
        ctx.drawImage(playerImg,dashX,dashY,player.width,player.height);
        ctx.globalAlpha = 1;
    }
}


function useWeapon() {
    if (keys.f && !weapon.onCooldown) {
        weapon.onCooldown = true;
        weapon.active = true;
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
        setTimeout(() => {weapon.active = false}, 100); 
        setTimeout(() => {weapon.onCooldown = false}, 700); 
    }
}

function drawWeapon() {
    if (weapon.active) ctx.drawImage(weaponImg,weapon.x,weapon.y,weapon.width,weapon.height);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}