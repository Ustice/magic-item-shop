'use strict';

const path = require('path');
const magicItems = require(path.join(__dirname, '/data/magic-items.json'));

const threshold = {
  0: .5,
  1: .3,
  2: .2,
  3: .1,
  4: 0,
};

const rollDice = (number, sides) => {
  return new Array(number)
    .fill(null)
    .map(() => roll(sides))
    .reduce((accumulator, value) => accumulator + value, 0)
  ;
};

const priceFunction = {
  0: () => (rollDice(1,6) + 1) * 10,
  1: () => rollDice(1,6) * 100,
  2: () => rollDice(2, 10) * 1000,
  3: () => (rollDice(1, 4) + 1) * 10000,
  4: () => rollDice(2, 6) * 25000,
};

const roll = sides => Math.floor(Math.random() * sides) + 1;

const calculatePrice = item => priceFunction[item.rarity]() * (item.type === 'Wondrous Item' ? 1.5 : 1);

const inStock = magicItems
  .filter(item => !item.cursed)
  .filter(item => {
    const die = Math.random();

    return die <= threshold[item.rarity];
  })
  .map(item => {
    item.price = calculatePrice(item);
    return item;
  })
;

console.log(inStock);
