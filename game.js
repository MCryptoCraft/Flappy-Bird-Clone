const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
  x: 80,
  y: 150,
  width: 30,
  height: 30,
  gravity: 0.6,
  lift: -15,
  velocity: 0
};

let pipes = [];
let frame = 0;
let score = 0;

function drawBird() {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

function updatePipes() {
  if (frame % 100 === 0) {
    let top = Math.random() * 200 + 50;
    let bottom = 600 - top - 150;
    pipes.push({ x: 400, width: 50, top, bottom, passed: false });
  }

  pipes.forEach(pipe => pipe.x -= 2);
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function checkCollision() {
  pipes.forEach(pipe => {
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      resetGame();
    }
  });

  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    resetGame();
  }
}

function resetGame() {
  pipes = [];
  bird.y = 150;
  bird.velocity = 0;
  score = 0;
}

function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  updatePipes();
  checkCollision();

  // Score only increases when bird passes a pipe
  pipes.forEach(pipe => {
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      score++;
      pipe.passed = true;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();

  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
  update();
  draw();
  frame++;
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', () => {
  bird.velocity = bird.lift;
});

gameLoop();
