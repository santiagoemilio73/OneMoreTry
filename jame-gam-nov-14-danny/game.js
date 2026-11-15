const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const GRAVITY = 0.6;
const ENEMY_CHASE_RANGE = 400;
const keys = {};
const playerImage = new Image();
playerImage.src = "assets/sprites/player-slime.png";
const playerWalkImage1 = new Image();
playerWalkImage1.src = "assets/sprites/player-slime-walk-1.png";
const playerWalkImage2 = new Image();
playerWalkImage2.src = "assets/sprites/player-slime-walk-2.png";
const swipeImage = new Image();
swipeImage.src = "assets/sprites/swipe.png";
const groudnImage = new Image();
groudnImage.src = "assets/backround/Drawing.png";
const cloudImage = new Image();
cloudImage.src = "assets/backround/cloud.png";
const hillImage = new Image();
hillImage.src = "assets/backround/hill.png";
const enemyImage = new Image();
enemyImage.src = "assets/sprites/enemy-beetle.png";
const heartImage = new Image();
heartImage.src = "assets/sprites/heart.png";
const blockImage = new Image();
blockImage.src = "assets/backround/block-stone.png";

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
    hurtTimer: 0,
    facingRight: true,
    walkTimer: 0,
    damage: 10,
    attackTimer: 0,
    attackCooldown: 0
};
const camera = {
    x: 0,
    y: 0
};
const enemies = [
    {
        height: 48,
        width: 48,
        speed: 2,
        facingRight: false,
        health: 30,
        maxHealth: 30,
        alive: true,
        hurtTimer: 0,
        x: 500,
        y: 432
    },
    {
        height: 48,
        width: 48,
        speed: 2,
        facingRight: false,
        health: 30,
        maxHealth: 30,
        alive: true,
        hurtTimer: 0,
        x: 1000,
        y: 432
    },
    {
        height: 48,
        width: 48,
        speed: 2,
        facingRight: false,
        health: 30,
        maxHealth: 30,
        alive: true,
        hurtTimer: 0,
        x: 1500,
        y: 432
    },
    {
        height: 48,
        width: 48,
        speed: 2,
        facingRight: false,
        health: 30,
        maxHealth: 30,
        alive: true,
        hurtTimer: 0,
        x: 2000,
        y: 432
    },
    {
        height: 48,
        width: 48,
        speed: 2,
        facingRight: false,
        health: 30,
        maxHealth: 30,
        alive: true,
        hurtTimer: 0,
        x: 2500,
        y: 432
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
const hills = [
    { x: -60 },
    { x: 230 },
    { x: 520 },
    { x: 900 },
    { x: 1180 },
    { x: 1520 },
    { x: 1840 }
];
const platforms = [
    { x: 600, y: 384, width: 144, height: 48 },
    { x: 840, y: 288, width: 96, height: 48 },
    { x: 1250, y: 384, width: 192, height: 48 },
    { x: 1750, y: 384, width: 96, height: 48 },
    { x: 1900, y: 288, width: 144, height: 48 },
    { x: 2350, y: 384, width: 144, height: 48 }
];
function update() {
    let walking = false;
    if (keys["a"] || keys["arrowleft"]) {
        player.x -= player.speed;
        player.facingRight = false;
        walking = true;
    }
    if (keys["d"] || keys["arrowright"]) {
        player.x += player.speed;
        player.facingRight = true;
        walking = true;
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
    for (let i = 0; i < platforms.length; i++) {
        let platform = platforms[i];
        if (
            player.velocityY >= 0 &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.height >= platform.y &&
            player.y + player.height - player.velocityY <= platform.y
        ) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.grounded = true;
        }
    }
    if (walking && player.grounded) {
        player.walkTimer += 1;
        if (player.walkTimer > 16) {
            player.walkTimer = 1;
        }
    } else {
        player.walkTimer = 0;
    }
    if (player.attackTimer > 0) {
        player.attackTimer -= 1;
    }
    if (player.attackCooldown > 0) {
        player.attackCooldown -= 1;
    }
    if (keys["j"] && player.attackCooldown === 0) {
        player.attackTimer = 12;
        player.attackCooldown = 24;
        let attackX = player.x;
        if (!player.facingRight) {
            attackX = player.x - 48;
        }
        let attackWidth = player.width + 48;
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            if (
                enemy.alive &&
                attackX < enemy.x + enemy.width &&
                attackX + attackWidth > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            ) {
                enemy.health -= player.damage;
                enemy.hurtTimer = 12;
                if (player.facingRight) {
                    enemy.x += 24;
                } else {
                    enemy.x -= 24;
                }
                if (enemy.health <= 0) {
                    enemy.health = 0;
                    enemy.alive = false;
                }
            }
        }
    }
    player.x = Math.max(0, Math.min(3000 - player.width, player.x));
    camera.x = player.x - WIDTH / 2 + player.width / 2;
camera.x = Math.max(0, Math.min(3000 - WIDTH, camera.x));
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (enemy.hurtTimer > 0) {
            enemy.hurtTimer -= 1;
        }
        if (enemy.alive && enemy.hurtTimer === 0 && Math.abs(enemy.x - player.x) < ENEMY_CHASE_RANGE) {
            if (enemy.x < player.x - enemy.speed) {
                enemy.x += enemy.speed;
                enemy.facingRight = true;
            }
            if (enemy.x > player.x + enemy.speed) {
                enemy.x -= enemy.speed;
                enemy.facingRight = false;
            }
        }
    }
    if (player.hurtTimer > 0) {
        player.hurtTimer -= 1;
    }
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (
            enemy.alive &&
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
    if (hillImage.complete && hillImage.naturalWidth > 0) {
        for (let i = 0; i < hills.length; i++) {
            let hill = hills[i];
            ctx.drawImage(hillImage, hill.x - camera.x * 0.5, ground.y - 96, 192, 96);
        }
    }
    ctx.save();
    ctx.translate(-camera.x, 0);
    if(groudnImage.complete && groudnImage.naturalWidth > 0) {
    for (let x = ground.x; x < ground.x + ground.width; x += 96) {
        ctx.drawImage(groudnImage, x, ground.y, 96, 96);
    }
    }
    if (blockImage.complete && blockImage.naturalWidth > 0) {
        for (let i = 0; i < platforms.length; i++) {
            let platform = platforms[i];
            for (let x = platform.x; x < platform.x + platform.width; x += 48) {
                ctx.drawImage(blockImage, x, platform.y, 48, 48);
            }
        }
    }
    if (enemyImage.complete && enemyImage.naturalWidth > 0) {
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            if (!enemy.alive) {
                continue;
            }
            if (enemy.hurtTimer > 0 && enemy.hurtTimer % 4 < 2) {
                continue;
            }
            if (enemy.facingRight) {
                ctx.save();
                ctx.translate(enemy.x + enemy.width, enemy.y);
                ctx.scale(-1, 1);
                ctx.drawImage(enemyImage, 0, 0, enemy.width, enemy.height);
                ctx.restore();
            } else {
                ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
            }
        }
    }
    if (playerImage.complete && playerImage.naturalWidth > 0) {
        let image = playerImage;
        if (player.walkTimer > 0 && player.walkTimer <= 8) {
            image = playerWalkImage1;
        }
        if (player.walkTimer > 8) {
            image = playerWalkImage2;
        }
        if (player.facingRight) {
            ctx.drawImage(image, player.x, player.y, player.width, player.height);
        } else {
            ctx.save();
            ctx.translate(player.x + player.width, player.y);
            ctx.scale(-1, 1);
            ctx.drawImage(image, 0, 0, player.width, player.height);
            ctx.restore();
        }
    }
    if (player.attackTimer > 0 && swipeImage.complete && swipeImage.naturalWidth > 0) {
        if (player.facingRight) {
            ctx.drawImage(swipeImage, player.x + player.width, player.y + 12, 48, 48);
        } else {
            ctx.save();
            ctx.translate(player.x, player.y + 12);
            ctx.scale(-1, 1);
            ctx.drawImage(swipeImage, 0, 0, 48, 48);
            ctx.restore();
        }
    }
    ctx.restore();
    if (heartImage.complete && heartImage.naturalWidth > 0) {
        ctx.drawImage(heartImage, 16, 12, 24, 24);
    }
    ctx.fillStyle = "#2a1a3a";
    ctx.fillRect(48, 14, 206, 20);
    ctx.fillStyle = "#62358f";
    ctx.fillRect(51, 17, 200, 14);
    let healthWidth = 200 * player.health / player.maxHealth;
    ctx.fillStyle = "#e8463c";
    ctx.fillRect(51, 17, healthWidth, 14);
    ctx.fillStyle = "#a8282e";
    ctx.fillRect(51, 27, healthWidth, 4);
    ctx.font = "bold 20px 'Pixelify Sans', Arial";
    ctx.fillStyle = "#2a1a3a";
    ctx.fillText(player.health + " / " + player.maxHealth, 264, 33);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(player.health + " / " + player.maxHealth, 262, 31);
}
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();