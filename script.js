// board 
let boardWidth = 960;
let boardHeight = 768;
let ctx;

// sounds
const playerDashSound = new Audio("./assets/dash.wav");

// player
let playerX = 300;
let playerY = 600;
let playerWidth = 64;
let playerHeight = 64;
let playerSpeed = 8;

let dashX;
let dashY;
let firstDashVisible = false;

const player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight,
    speed: playerSpeed,
    health: 100,
    onDashCooldown: false,
    dashActive: false,
    isMoving: false,
    sprite: false,
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

let idle_down_1;
let idle_down_2;
let walk_down_1;
let walk_down_2;
let idle_up_1;
let idle_up_2;
let walk_up_1;
let walk_up_2;

let num = 500;
// weapon
let weaponWidth = 64;
let weaponHeight = 64;
const weapon = {
    x: boardWidth,
    y: boardHeight,
    width: weaponWidth,
    height: weaponHeight,
    active: false,
    onCooldown: false,
    damage: 10
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

    player.img = new Image();
    idle_down_1 = "./assets/player/idle_down_1.png";
    idle_down_2 = "./assets/player/idle_down_2.png";
    walk_down_1 = "./assets/player/walk_down_1.png";
    walk_down_2 = "./assets/player/walk_down_2.png";
    idle_up_1 = "./assets/player/idle_up_1.png";
    idle_up_2 = "./assets/player/idle_up_2.png";
    walk_up_1 = "./assets/player/walk_up_1.png";
    walk_up_2 = "./assets/player/walk_up_2.png";
    idle_left_1 = "./assets/player/idle_left_1.png";
    idle_left_2 = "./assets/player/idle_left_2.png";
    walk_left_1 = "./assets/player/walk_left_1.png";
    walk_left_2 = "./assets/player/walk_left_2.png";
    idle_right_1 = "./assets/player/idle_right_1.png";
    idle_right_2 = "./assets/player/idle_right_2.png";
    walk_right_1 = "./assets/player/walk_right_1.png";
    walk_right_2 = "./assets/player/walk_right_2.png"; 


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
    setInterval(spriteChange, 250);
    setInterval(fps, 15);
}   

// every tick
function update() {
    ctx.clearRect(0,0,boardWidth,boardHeight);

    drawPlayerDash(dashX, dashY);
    drawPlayer();
    drawWeapon();
    drawEnemy();

    displayHealthbar();
    displayCooldown();

    requestAnimationFrame(update);
}

function spriteChange() {
    player.sprite = !player.sprite;
}

function fps() {

    movePlayer();
    useWeapon();
}

function drawPlayer() {
    if (player.direction.up) {
        if (player.isMoving) {
            if (player.sprite) player.img.src = walk_up_1; else player.img.src = walk_up_2;
        }
        else if (player.sprite) player.img.src = idle_up_1; else player.img.src = idle_up_2;
    }
    if (player.direction.down) {
        if (player.isMoving) {
            if (player.sprite) player.img.src = walk_down_1; else player.img.src = walk_down_2;
        }
        else if (player.sprite) player.img.src = idle_down_1; else player.img.src = idle_down_2;
    }
    if (player.direction.left) {
        if (player.isMoving) {
            if (player.sprite) player.img.src = walk_left_1; else player.img.src = walk_left_2;
        }
        else if (player.sprite) player.img.src = idle_left_1; else player.img.src = idle_left_2;
    }
    if (player.direction.right) {
        if (player.isMoving) {
            if (player.sprite) player.img.src = walk_right_1; else player.img.src = walk_right_2;
        }
        else if (player.sprite) player.img.src = idle_right_1; else player.img.src = idle_right_2;
    }
    console.log(player.sprite);
    ctx.drawImage(player.img,player.x,player.y,player.width,player.height);
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
    if (isCriticalHealth(enemy)) ctx.fillStyle = "red";
    else ctx.fillStyle = "green";
    if (enemy.health > 0) ctx.fillText(enemy.health + " health",enemy.x+enemy.width/2,enemy.y-enemy.height/4);
    if (isCriticalHealth(player)) ctx.fillStyle = "red";
    else ctx.fillStyle = "green";
    ctx.fillText(player.health + " health",player.x+player.width/2,player.y-player.height/4);
}

function movePlayer() {
    if (pressedKeys.size > 0) player.isMoving = true; else player.isMoving = false;
    if (keys.w) {
        player.direction.up = true;
        player.direction.down = false;
        player.direction.left = false;
        player.direction.right = false;
        playerDash();
        player.y = Math.max(0, player.y - player.speed);

    }
    if (keys.a) {
        player.direction.up = false;
        player.direction.down = false;
        player.direction.left = true;
        player.direction.right = false;
        playerDash();
        player.x = Math.max(0, player.x - player.speed);

    }
    if (keys.s) {
        player.direction.up = false;
        player.direction.down = true;
        player.direction.left = false;
        player.direction.right = false;
        playerDash();
        player.y = Math.min(boardHeight-player.height, player.y + player.speed);

    }
    if (keys.d) {
        player.direction.up = false;
        player.direction.down = false;
        player.direction.left = false;
        player.direction.right = true;
        playerDash();
        player.x = Math.min(boardWidth-player.width, player.x + player.speed);
    }
    player.speed = playerSpeed;
}

function playerDash() {
    if (keys.q && !player.onDashCooldown) {
        playerDashSound.play();
        dashX = player.x;
        dashY = player.y;
        player.onDashCooldown = true;
        player.dashActive = true;
        firstDashVisible = true;
        if (pressedKeys.size > 1) player.speed *= 9;
        else player.speed *= 12;
        setTimeout(() => {player.dashActive = false}, 200); 
        setTimeout(() => {player.onDashCooldown = false}, 1000);
    }
}

function drawPlayerDash(dashX, dashY) {
    if (player.dashActive) {
        ctx.globalAlpha = 0.15;
        if (firstDashVisible) ctx.drawImage(player.img,dashX,dashY,player.width,player.height);
        setTimeout(() => {firstDashVisible = false;}, 100);
        ctx.globalAlpha = 0.35;
        if (!firstDashVisible) ctx.clearRect(dashX,dashY,player.width,player.height);
        ctx.drawImage(player.img,dashX+(player.x-dashX)/2,dashY+(player.y-dashY)/2,player.width,player.height);
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
        if (detectCollision(weapon,enemy)) enemy.health -= weapon.damage;
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

function isCriticalHealth(a) {
    if (a.health <= 30) return true;
    return false;
}