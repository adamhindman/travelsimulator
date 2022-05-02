import { capitalize } from "./utilities.js";

export let inventory = [
  { name: "Gum", description: "A package of cinnamon gum." },
  { name: "Spare socks", description: "An extra pair of nice warm socks." },
  { name: "Sunscreen", description: "A tube of SPF-30." },
  { name: "Yellow flashlight", description: "A bright yellow flashlight: the wanderer's companion"}
];

export const addToInventory = item => {};

export const getItemDescription = item => {};

export const handleInventory = () => {
  return showInventory();
};

export const handleTake = item => {};

export const itemIsInInventory = item => {
  const matchingItems = inventory.filter(
    it => it.name.toLowerCase() === item.toLowerCase()
  );
  return [matchingItems.length > 0, matchingItems];
};

export const removeFromInventory = item => {};

export const showInventory = () => {
  let inv = "";
  inv = inventory.reduce((result, current) => {
    return result + `<li>${capitalize(current.name)}</li>`;
  }, "");
  return `<div class='inventory'><p>Inventory:</p><ul class='asterisk'>${inv}</ul></div>`;
};
