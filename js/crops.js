const crops = {
  carrot:      { emoji: "🥕", name: "Carrot", time: 4000, seedPrice: 3, sellPrice: 6 },
  corn:        { emoji: "🌽", name: "Corn", time: 6000, seedPrice: 5, sellPrice: 10 },
  pumpkin:     { emoji: "🎃", name: "Pumpkin", time: 8000, seedPrice: 6, sellPrice: 13 },
  tomato:      { emoji: "🍅", name: "Tomato", time: 5000, seedPrice: 4, sellPrice: 8 },
  eggplant:    { emoji: "🍆", name: "Eggplant", time: 7000, seedPrice: 5, sellPrice: 11 },
  strawberry:  { emoji: "🍓", name: "Strawberry", time: 5500, seedPrice: 5, sellPrice: 9 },
  watermelon:  { emoji: "🍉", name: "Watermelon", time: 9000, seedPrice: 8, sellPrice: 16 },
  pepper:      { emoji: "🫑", name: "Pepper", time: 6500, seedPrice: 5, sellPrice: 10 },
  onion:       { emoji: "🧅", name: "Onion", time: 6000, seedPrice: 4, sellPrice: 9 },
  grapes:      { emoji: "🍇", name: "Grapes", time: 7500, seedPrice: 6, sellPrice: 12 },
  pineapple:   { emoji: "🍍", name: "Pineapple", time: 8500, seedPrice: 7, sellPrice: 14 },
  avocado:     { emoji: "🥑", name: "Avocado", time: 8000, seedPrice: 7, sellPrice: 13 },
};

let coins = 50;
let seeds = {}, inventory = {};
for (let k in crops) {
  seeds[k] = 0;
  inventory[k] = 0;
}

let selectedCrop = null;
let activePanel = null;
