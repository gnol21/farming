import { crops, selectedCrop } from '../game.js';

export let canvas = document.getElementById('gameCanvas');
export let ctx = canvas.getContext('2d');

export let plots = [], plotSize = 80, topBarHeight = 40;

export class Plot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.crop = null;
    this.plantedTime = null;
  }

  plant(cropKey) {
    this.crop = cropKey;
    this.plantedTime = Date.now();
  }

  harvest() {
    this.crop = null;
    this.plantedTime = null;
  }

  draw() {
    ctx.roundRect(this.x, this.y, plotSize - 2, plotSize - 2, 10);
    ctx.fillStyle = '#8B4513';
    ctx.fill();

    if (this.crop) {
      let crop = crops[this.crop];
      let progress = Math.min((Date.now() - this.plantedTime) / crop.time, 1);
      ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.4 * progress})`;
      ctx.fill();
      ctx.font = `${plotSize / 2}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(crop.emoji, this.x + plotSize / 2, this.y + plotSize / 2);
    }
  }
}

export function recalcGrid() {
  let cols = Math.floor(canvas.width / plotSize);
  let rows = Math.floor((canvas.height - topBarHeight) / plotSize);
  plots.length = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      plots.push(new Plot(x * plotSize, topBarHeight + y * plotSize));
    }
  }
}

export function resizeCanvas() {
  let dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  ctx.scale(dpr, dpr);
  recalcGrid();
}

export function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  plots.forEach(p => p.draw());
  requestAnimationFrame(render);
}

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  this.beginPath(); this.moveTo(x + r, y); this.lineTo(x + w - r, y);
  this.quadraticCurveTo(x + w, y, x + w, y + r); this.lineTo(x + w, y + h - r);
  this.quadraticCurveTo(x + w, y + h, x + w - r, y + h); this.lineTo(x + r, y + h);
  this.quadraticCurveTo(x, y + h, x, y + h - r); this.lineTo(x, y + r);
  this.quadraticCurveTo(x, y, x + r, y); this.closePath();
};