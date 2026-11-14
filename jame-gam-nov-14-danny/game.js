const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const GRAVITY = 0.6;
const ENEMY_CHASE_RANGE = 400;
const keys = {};
const playerImage = new Image();
playerImage.src = "assets/sprites/slimeSprite-20261114-130338-frame0.png";
const groudnImage = new Image();
groudnImage.src = "assets/backround/Drawing.png";
const cloudImage = new Image();
cloudImage.src = "assets/backround/cloud.png";

const player = {
    x: 100,
    y: 300,
    width: 48,
    height: 72,
    speed: 5,
    velocityY: 0,
    jumpPower: -12,
    grounded: false,
    health: 100,
    maxHealth: 100,
    hurtTimer: 0
};
const camera = {
    x: 0,
    y: 0
};
const enemies = [
    {
        height: 100,
        width: 50,
        speed: 2,
        x: 500,
        y: 380
    },
    {
        height: 100,
        width: 50,
        speed: 2,
        x: 1000,
        y: 380
    },
    {
        height: 100,
        width: 50,
        speed: 2,
        x: 1500,
        y: 380
    },
    {
        height: 100,
        width: 50,
        speed: 2,
        x: 2000,
        y: 380
    },
    {
        height: 100,
        width: 50,
        speed: 2,
        x: 2500,
        y: 380
    }
];
window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});
window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});
const ground = {
    x: 0,
    y: 480,
    width: 3000,
    height: 60
};
const clouds = [
    { x: 80, y: 50 },
    { x: 420, y: 120 },
    { x: 760, y: 70 },
    { x: 1100, y: 140 },
    { x: 1450, y: 60 },
    { x: 1800, y: 110 }
];
function update() {
    if (keys["a"] || keys["arrowleft"]) {
        player.x -= player.speed;
    }
    if (keys["d"] || keys["arrowright"]) {
        player.x += player.speed;
    }
    if (
        (keys[" "] || keys["w"] || keys["arrowup"]) &&
        player.grounded
    ) {
        player.velocityY = player.jumpPower;
        player.grounded = false;
    }
    player.velocityY += GRAVITY;
    player.y += player.velocityY;
    player.grounded = false;
    if (player.y + player.height >= ground.y) {
        player.y = ground.y - player.height;
        player.velocityY = 0;
        player.grounded = true;
    }
    player.x = Math.max(0, Math.min(3000 - player.width, player.x));
    camera.x = player.x - WIDTH / 2 + player.width / 2;
camera.x = Math.max(0, Math.min(3000 - WIDTH, camera.x));
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (Math.abs(enemy.x - player.x) < ENEMY_CHASE_RANGE) {
            if (enemy.x < player.x) {
                enemy.x += enemy.speed;
            }
            if (enemy.x > player.x) {
                enemy.x -= enemy.speed;
            }
        }
    }
    if (player.hurtTimer > 0) {
        player.hurtTimer -= 1;
    }
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y &&
            player.hurtTimer === 0
        ) {
            player.health -= 10;
            player.hurtTimer = 60;
        }
    }
    if (player.health < 0) {
        player.health = 0;
    }
}
function draw() {
    let sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    sky.addColorStop(0, "#5fb8f5");
    sky.addColorStop(1, "#c8ecff");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    if (cloudImage.complete && cloudImage.naturalWidth > 0) {
        for (let i = 0; i < clouds.length; i++) {
            let cloud = clouds[i];
            ctx.drawImage(cloudImage, cloud.x - camera.x * 0.3, cloud.y, 96, 48);
        }
    }
    ctx.save();
    ctx.translate(-camera.x, 0);
    if(groudnImage.complete && groudnImage.naturalWidth > 0) {
    for (let x = ground.x; x < ground.x + ground.width; x += 96) {
        ctx.drawImage(groudnImage, x, ground.y, 96, 96);
    }
    }
    ctx.fillStyle = "red";
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
    if (playerImage.complete && playerImage.naturalWidth > 0) {
        ctx.drawImage(
            playerImage,
            player.x,
            player.y,
            player.width,
            player.height
        );
    }
    ctx.restore();
    ctx.fillStyle = "#2a1a3a";
    ctx.font = "20px Arial";
    ctx.fillText("Health: " + player.health + " / " + player.maxHealth, 20, 30);
}
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();