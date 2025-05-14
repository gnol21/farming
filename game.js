import { canvas, resizeCanvas, render } from './modules/grid.js';
import './modules/events.js';

export const crops = {
  carrot: { emoji: "🥕", name: "Carrot", time: 4000, seedPrice: 3, sellPrice: 6 },
  corn: { emoji: "🌽", name: "Corn", time: 6000, seedPrice: 5, sellPrice: 10 },
  pumpkin: { emoji: "🎃", name: "Pumpkin", time: 8000, seedPrice: 6, sellPrice: 13 },
};

export let coins = 50;
export let seeds = { carrot: 1, corn: 1, pumpkin: 1 };
export let inventory = { carrot: 0, corn: 0, pumpkin: 0 };
export let selectedCrop = 'carrot';

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
render();