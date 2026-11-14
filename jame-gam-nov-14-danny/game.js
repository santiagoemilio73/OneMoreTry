const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const GRAVITY = 0.6;
const keys = {};
const playerImage = new Image();
playerImage.src = "assets/sprites/slimeSprite-20261114-130338-frame0.png";
const groudnImage = new Image();
groudnImage.src = "assets/backround/tile.png";

const player = {
    x: 100,
    y: 300,
    width: 48,
    height: 72,
    speed: 5,
    velocityY: 0,
    jumpPower: -12,
    grounded: false
};
const camera = {
    x: 0,
    y: 0
};
const enemy = {
    height: 100,
    width: 50,
    speed: 2,
    x: 500,
    y: 380
};
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
    if (enemy.x < player.x) {
        enemy.x += enemy.speed;
    }
    if (enemy.x > player.x) {
        enemy.x -= enemy.speed;
    }
}
function draw() {
    ctx.fillStyle = "#111a2c";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.save();
    ctx.translate(-camera.x, 0);
    if(groudnImage.complete && groudnImage.naturalWidth > 0) {
    ctx.drawImage(
        groudnImage,
        ground.x,
        ground.y,
        3000,
        ground.height
    );
    }
    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
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
}
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();