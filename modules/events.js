import { canvas, plots, plotSize } from './grid.js';
import { crops, seeds, inventory, coins, selectedCrop } from '../game.js';

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let plot of plots) {
    if (x >= plot.x && x <= plot.x + plotSize && y >= plot.y && y <= plot.y + plotSize) {
      if (plot.crop) {
        const crop = crops[plot.crop];
        const done = (Date.now() - plot.plantedTime) >= crop.time;
        if (done) {
          inventory[plot.crop]++;
          plot.harvest();
        }
      } else if (selectedCrop && seeds[selectedCrop] > 0) {
        seeds[selectedCrop]--;
        plot.plant(selectedCrop);
      }
    }
  }
});