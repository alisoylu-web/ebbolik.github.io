const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const catImg = new Image();
catImg.src = "cat.png";  // Kedinin resmi olacak

const player = {
  x: 180,
  y: 520,
  width: 40,
  height: 40,
  speedX: 2,
  manualMove: 0 // -1 = sola, 1 = sağa
};

let hearts = [];
let score = 0;
let gameOver = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") player.manualMove = -1;
  if (e.key === "ArrowRight") player.manualMove = 1;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    player.manualMove = 0;
  }
});

function drawPlayer() {
  ctx.drawImage(catImg, player.x, player.y, player.width, player.height);
}

function updatePlayer() {
  // Manuel yön varsa onu uygula
  if (player.manualMove !== 0) {
    player.x += player.manualMove * 4;
  } else {
    // Otomatik sekme
    player.x += player.speedX;
    if (player.x <= 0 || player.x + player.width >= canvas.width) {
      player.speedX *= -1;
    }
  }

  // Taşma önle
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
}

function drawHearts() {
  ctx.fillStyle = "red";
  hearts.forEach((heart) => {
    ctx.beginPath();
    ctx.arc(heart.x, heart.y, heart.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updateHearts() {
  hearts.forEach((heart, index) => {
    heart.y += heart.speed;

    // Temas kontrolü
    if (
      heart.y + heart.r > player.y &&
      heart.x > player.x &&
      heart.x < player.x + player.width
    ) {
      hearts.splice(index, 1);
      score++;
    }

    // Kalpler kaçarsa sil ama yenilme yok
    if (heart.y > canvas.height) {
      hearts.splice(index, 1);
    }
  });

  if (Math.random() < 0.05) {
    hearts.push({
      x: Math.random() * 380 + 10,
      y: -10,
      r: 10,
      speed: 2 + Math.random() * 3,
    });
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Skor: " + score, 10, 30);
}

function checkWin() {
  if (score >= 100 && !gameOver) {
    document.getElementById("message").style.display = "block";
    gameOver = true;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  drawPlayer();
  updateHearts();
  drawHearts();
  drawScore();
  checkWin();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

catImg.onload = () => {
  gameLoop();
};
