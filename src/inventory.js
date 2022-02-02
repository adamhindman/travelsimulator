import { capitalize } from "./utilities.js";

export let inventory = [
  { name: "Gum", description: "A stick of cinnamon gum." },
  { name: "Spare socks", description: "An extra pair of nice warm socks." },
];

export const addToInventory = item => {};

export const getItemDescription = item => {};

export const handleInventory = () => {
  return showInventory();
};

export const handleTake = item => {};

export const itemIsInInventory = item => {
  let inInventory = false;
  return inInventory;
};

export const removeFromInventory = item => {};

export const showInventory = () => {
  let inv = "";
  inv = inventory.reduce((result, current) => {
    return result + `<li>${capitalize(current.name)}</li>`;
  }, "");
  return `<div class='inventory'><p>Inventory:</p><ul class='asterisk'>${inv}</ul></div>`;
};
