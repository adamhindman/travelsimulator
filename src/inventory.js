import { capitalize } from "./utilities.js";

export let inventory = [
  { name: "Gum", description: "A stick of cinnamon gum." },
  { name: "Spare socks", description: "An extra pair of nice warm socks." },
];

export const addToInventory = item => {
  console.log("addToInventory");
};

export const getItemDescription = item => {
  console.log("getItemDescription");
};

export const handleInventory = () => {
  console.log("handleInventory");
  return showInventory();
};

export const handleTake = item => {
  console.log("handleTake");
};

export const itemIsInInventory = item => {
  let inInventory = false;
  console.log("itemIsInInventory");
  return inInventory;
};

export const removeFromInventory = item => {
  console.log("removeFromInventory");
};

export const showInventory = () => {
  let inv = "";
  inv = inventory.reduce((result, current) => {
    return result + `<li>${capitalize(current.name)}</li>`;
  }, "");
  return `<div class='inventory'><p>Inventory:</p><ul class='asterisk'>${inv}</ul></div>`;
};
