const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Plot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.crop = null;
    this.plantTime = null;
  }
  plant(type) {
    this.crop = type;
    this.plantTime = Date.now();
  }
  harvest() {
    inventory[this.crop]++;
    this.crop = null;
  }
  getState() {
    if (!this.crop) return "empty";
    const p = crops[this.crop];
    const progress = (Date.now() - this.plantTime) / p.time;
    return progress >= 1 ? "ready" : "growing";
  }
  draw() {
    ctx.fillStyle = "#e0f7e9";
    ctx.roundRect(this.x, this.y, plotSize, plotSize, 10);
    ctx.fill();
    ctx.strokeStyle = "#aaa";
    ctx.stroke();

    if (this.crop) {
      const p = crops[this.crop];
      const progress = Math.min(1, (Date.now() - this.plantTime) / p.time);
      let emoji = "🌱";
      if (progress >= 0.66) emoji = p.emoji;
      else if (progress >= 0.33) emoji = "🌿";

      ctx.fillStyle = "#000";
      ctx.font = `${plotSize * 0.4}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(emoji, this.x + plotSize / 2, this.y + plotSize / 2 + plotSize * 0.15);

      ctx.fillStyle = "#ccc";
      ctx.fillRect(this.x + 10, this.y + plotSize - 12, plotSize - 20, 6);
      ctx.fillStyle = "#4caf50";
      ctx.fillRect(this.x + 10, this.y + plotSize - 12, (plotSize - 20) * progress, 6);

      if (this.getState() === "ready") {
        ctx.fillStyle = "#000";
        ctx.font = `${plotSize * 0.15}px Arial`;
        ctx.fillText("Ready", this.x + plotSize / 2, this.y + plotSize - 20);
      }
    }
  }
}

const plots = [];
let plotSize = 80, plotMargin = 10;
const rows = 3, cols = 3;

function recalcGrid() {
  const availW = canvas.width * 0.9;
  plotSize = Math.floor(availW / (cols + 0.5));
  plotMargin = Math.floor(plotSize * 0.15);
  plots.length = 0;
  const gridW = cols * (plotSize + plotMargin) - plotMargin;
  const offsetX = (canvas.width - gridW) / 2;
  const offsetY = 80;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      plots.push(new Plot(offsetX + c * (plotSize + plotMargin), offsetY + r * (plotSize + plotMargin)));
    }
  }
}

function drawTopBar() {
  ctx.fillStyle = "#b2dfdb";
  ctx.fillRect(0, 0, canvas.width, topBarHeight);
  ctx.fillStyle = "#000";
  ctx.font = `${topBarHeight * 0.5}px Arial`;
  ctx.textAlign = "left";
  ctx.fillText(`💰 ${coins}`, 10, topBarHeight * 0.7);

  if (selectedCrop) {
    ctx.textAlign = "right";
    ctx.fillText(`${crops[selectedCrop].emoji} ${crops[selectedCrop].name} x${seeds[selectedCrop]}`, canvas.width - 10, topBarHeight * 0.7);
  }
}

function drawButtons() {
  const btnW = canvas.width * 0.25;
  const btnH = 40;
  drawButton(20, canvas.height - btnH - 10, btnW, btnH, "🌿 Crops");
  drawButton(40 + btnW, canvas.height - btnH - 10, btnW, btnH, "🛒 Buy");
  drawButton(canvas.width - btnW - 20, canvas.height - btnH - 10, btnW, btnH, "💼 Sell");
}

function drawButton(x, y, w, h, text) {
  ctx.fillStyle = "#b2dfdb";
  ctx.strokeStyle = "#333";
  ctx.roundRect(x, y, w, h, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#000";
  ctx.font = `${h * 0.5}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText(text, x + w / 2, y + h / 2 + h * 0.15);
}

function drawPanel(type) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#aaa";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#e57373";
  ctx.beginPath();
  ctx.arc(canvas.width - 30, 30, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText("X", canvas.width - 30, 35);

  const keys = Object.keys(crops).filter(k =>
    type === "buy" || 
    (type === "crops" && seeds[k] > 0) ||
    (type === "sell" && inventory[k] > 0)
  );

  const itemsPerRow = 3;
  const itemW = canvas.width / itemsPerRow;
  const itemH = 100;

  keys.forEach((key, i) => {
    const col = i % itemsPerRow;
    const row = Math.floor(i / itemsPerRow);
    const bx = col * itemW + 10;
    const by = 60 + row * (itemH + 10);

    ctx.fillStyle = (type === "buy" && coins < crops[key].seedPrice) ? "#f8d7da" : "#dcedc8";
    ctx.roundRect(bx, by, itemW - 20, itemH, 10);
    ctx.fill();
    ctx.strokeStyle = "#aaa";
    ctx.stroke();

    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(crops[key].name, bx + (itemW - 20) / 2, by + 20);
    ctx.font = "32px Arial";
    ctx.fillText(crops[key].emoji, bx + (itemW - 20) / 2, by + 60);

    ctx.font = "12px Arial";
    if (type === "buy") ctx.fillText(`Price: ${crops[key].seedPrice}💰`, bx + (itemW - 20) / 2, by + 85);
    if (type === "crops") ctx.fillText(`x${seeds[key]}`, bx + (itemW - 20) / 2, by + 85);
    if (type === "sell") ctx.fillText(`x${inventory[key]} | ${crops[key].sellPrice}💰`, bx + (itemW - 20) / 2, by + 85);
  });
}

let topBarHeight = 40;
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTopBar();

  if (!activePanel) {
    plots.forEach(p => p.draw());
    drawButtons();
  } else {
    drawPanel(activePanel);
  }

  requestAnimationFrame(render);
}

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (activePanel) {
    if (x >= canvas.width - 45 && x <= canvas.width - 15 && y >= 15 && y <= 45) {
      activePanel = null;
      return;
    }

    const keys = Object.keys(crops).filter(k =>
      activePanel === "buy" ||
      (activePanel === "crops" && seeds[k] > 0) ||
      (activePanel === "sell" && inventory[k] > 0)
    );

    const itemsPerRow = 3;
    const itemW = canvas.width / itemsPerRow;
    const itemH = 100;

    keys.forEach((key, i) => {
      const col = i % itemsPerRow;
      const row = Math.floor(i / itemsPerRow);
      const bx = col * itemW + 10;
      const by = 60 + row * (itemH + 10);

      if (x >= bx && x <= bx + itemW - 20 && y >= by && y <= by + itemH) {
        if (activePanel === "crops") {
          selectedCrop = key;
          activePanel = null;
        }
        if (activePanel === "buy" && coins >= crops[key].seedPrice) {
          coins -= crops[key].seedPrice;
          seeds[key]++;
        }
        if (activePanel === "sell" && inventory[key] > 0) {
          inventory[key]--;
          coins += crops[key].sellPrice;
        }
      }
    });
    return;
  }

  if (y >= canvas.height - 50 && y <= canvas.height - 10) {
    if (x >= 20 && x <= 20 + canvas.width * 0.25) activePanel = "crops";
    if (x >= 40 + canvas.width * 0.25 && x <= 40 + canvas.width * 0.5) activePanel = "buy";
    if (x >= canvas.width - canvas.width * 0.25 - 20 && x <= canvas.width - 20) activePanel = "sell";
    return;
  }

  if (!selectedCrop) return;

  plots.forEach(p => {
    if (x >= p.x && x <= p.x + plotSize && y >= p.y && y <= p.y + plotSize) {
      if (!p.crop && seeds[selectedCrop] > 0) {
        p.plant(selectedCrop);
        seeds[selectedCrop]--;
      } else if (p.getState() === "ready") {
        p.harvest();
      }
    }
  });
});

function resizeCanvas() {
  const maxWidth = 400;
  const margin = 20;
  canvas.width = Math.min(window.innerWidth - margin, maxWidth);
  canvas.height = Math.min(window.innerHeight - margin, canvas.width * 1.5);
  topBarHeight = Math.floor(canvas.height * 0.07);
  recalcGrid();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
render();
