// board 
let boardWidth = 960;
let boardHeight = 768;
let ctx;

// sounds
const playerDashSound = new Audio("./assets/player/playerDash.wav");
const weapon_standard = new Audio("./assets/weapon/weapon_standard.wav");
const weapon_hit = new Audio("./assets/weapon/weapon_hit.wav");
const playerWalkSound = new Audio("./assets/player/playerWalk.wav");

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
    maxHealth: 100,
    stunned: false,
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
    animationStart: false,
    animationEnd: false,
    active: false,
    onCooldown: false,
    damage: 10
}
let weapon_start;
let weapon_end;

// enemy
let enemyX = 200;
let enemyY = 100;
let enemyWidth = 64;
let enemyHeight = 64;
class Enemy {
    constructor(x,y,width,height,maxHealth) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
    }
}

const enemy = new Enemy(enemyX,enemyY,enemyWidth,enemyHeight,100);

const enemies = [];
enemies.push(enemy);


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

    player.img.src = idle_down_2;
    player.img.src = walk_down_1;
    player.img.src = walk_down_2;
    player.img.src = idle_up_1;
    player.img.src = idle_up_2;
    player.img.src = walk_up_1;
    player.img.src = walk_up_2;
    player.img.src = idle_left_1;
    player.img.src = idle_left_2;
    player.img.src = walk_left_1;
    player.img.src = walk_left_2;
    player.img.src = idle_right_1;
    player.img.src = idle_right_2;
    player.img.src = walk_right_1;
    player.img.src = walk_right_2;
    player.img.src = idle_down_1;

    weapon.img = new Image();
    weapon_left_1 = "./assets/weapon/weapon_left_1.png";
    weapon_left_2 = "./assets/weapon/weapon_left_2.png";
    weapon_up_1 = "./assets/weapon/weapon_up_1.png";
    weapon_up_2 = "./assets/weapon/weapon_up_2.png";
    weapon_right_1 = "./assets/weapon/weapon_right_1.png";
    weapon_right_2 = "./assets/weapon/weapon_right_2.png";
    weapon_down_1 = "./assets/weapon/weapon_down_1.png";
    weapon_down_2 = "./assets/weapon/weapon_down_2.png";

    weapon.img.src = weapon_left_1;

    enemies[0].img = new Image();
    enemies[0].img.src = "./assets/enemy.png";

    requestAnimationFrame(update);

    // player movement
    document.addEventListener("keydown", (e) => {
        if (Object.keys(keys).includes(e.key)) {
            if (e.key != "q" && e.key != "f")  {
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
        if (e.key == "f") keys[e.key] = true;
    });
    setInterval(spriteChange, 250);
    setInterval(fps, 15);
}   

// every tick
function update() {
    ctx.clearRect(0,0,boardWidth,boardHeight);
    drawPlayerDash(dashX, dashY);
    drawPlayer();
    for (let i=0;i<enemies.length;i++) drawEnemy(enemies[i]);
    drawWeapon();
    displayHealthbar();
    displayCooldown();

    requestAnimationFrame(update);
}

function fps() {

    movePlayer();
    useWeapon();
}


function drawPlayer() {
    choosePlayerImage();
    ctx.drawImage(player.img,player.x,player.y,player.width,player.height);
}

function choosePlayerImage() {
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
}

function drawEnemy(e) {
    for (let i=0;i<enemies.length;i++) {
        if (enemies[i].health <= 0) enemies.splice(i,1);
    }
    ctx.drawImage(e.img,e.x,e.y,e.width,e.height);
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
    if (player.stunned) return;
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
    if (player.isMoving) playerWalkSound.play();
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
        weapon.animationStart = true;
        weapon.animationEnd = false;
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
        if (detectCollision(weapon,enemy)) {
            enemy.health -= weapon.damage;
            weapon_hit.play();
        } else weapon_standard.play();
        setTimeout(() => {weapon.active = false}, 150); 
        setTimeout(() => {weapon.onCooldown = false}, 700); 
    }
}

function drawWeapon() {
    if (weapon.active) {
        player.stunned = true;
        setTimeout(() => {player.stunned = false;}, 150);
        if (weapon.animationStart) {
            if (player.direction.up) weapon.img.src = weapon_up_1;
            if (player.direction.left) weapon.img.src = weapon_left_1;
            if (player.direction.down) weapon.img.src = weapon_down_1;
            if (player.direction.right) weapon.img.src = weapon_right_1;
            ctx.drawImage(weapon.img,weapon.x,weapon.y,weapon.width,weapon.height);
        }
        setTimeout(() => {weapon.animationStart = false;}, 60);
        setTimeout(() => {weapon.animationEnd = true;}, 50);
        if (weapon.animationEnd) {
            if (player.direction.up) weapon.img.src = weapon_up_2;
            if (player.direction.left) weapon.img.src = weapon_left_2;
            if (player.direction.down) weapon.img.src = weapon_down_2;
            if (player.direction.right) weapon.img.src = weapon_right_2;
            ctx.drawImage(weapon.img,weapon.x,weapon.y,weapon.width,weapon.height);
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function isCriticalHealth(a) {
    let ratio = a.health/a.maxHealth;
    if (ratio <= 0.25) return true;
    return false;
}
function spriteChange() {player.sprite = !player.sprite;}