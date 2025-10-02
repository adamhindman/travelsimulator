import { capitalize } from "./utilities.js";

export const initialInventory = [
  { name: "Gum", description: "A package of cinnamon gum." },
  { name: "Spare socks", description: "An extra pair of nice warm socks." },
  { name: "Sunscreen", description: "A tube of SPF-30." },
  {
    name: "Yellow flashlight",
    description: "A bright yellow flashlight: the wanderer's companion",
  },
  {
    name: "Monitor",
    description:
      "A handheld global satellite monitor, which can easily track the location of anyone, anywhere, at any time. Type MONITOR or TRACK to use it.",
  },
];

export let inventory = [...initialInventory];

export function saveInventory() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

export function loadInventory() {
  const savedInventory = localStorage.getItem("inventory");
  if (savedInventory) {
    inventory.length = 0; // Clear the original array
    Array.prototype.push.apply(inventory, JSON.parse(savedInventory));
  }
}

export const addToInventory = item => {
  if (typeof item === "string") {
    inventory.push({ name: item, description: item });
  } else {
    inventory.push(item);
  }
  saveInventory();
};

export const getItemDescription = item => {};

export const handleInventory = (noun, words, neighbors) => {
  return showInventory();
};

export const handleTake = (noun, words, neighbors) => {};

export const itemIsInInventory = item => {
  const matchingItems = inventory.filter(
    it => it.name.toLowerCase() === item.toLowerCase(),
  );
  return [matchingItems.length > 0, matchingItems];
};

export const removeFromInventory = item => {
  const itemIndex = inventory.findIndex(
    invItem => invItem.name.toLowerCase() === item.toLowerCase(),
  );

  if (itemIndex > -1) {
    inventory.splice(itemIndex, 1);
    saveInventory();
  }
};

export const checkForQuestNote = npcName => {
  const note = inventory.find(item =>
    item.name.toUpperCase().endsWith(npcName.toUpperCase()),
  );
  return note;
};

export const clearQuestNotes = () => {
  const itemsToKeep = inventory.filter(
    item => !item.name.toLowerCase().includes("note from"),
  );
  inventory.length = 0;
  inventory.push(...itemsToKeep);
  saveInventory();
};

export const showInventory = () => {
  let inv = "";
  inv = inventory.reduce((result, current) => {
    return (
      result +
      `<li><button class="inventory-object" data-object="${current.name}">${current.name}</button></li>`
    );
  }, "");
  return `<div class='inventory'><p>Inventory:</p><ul class='asterisk buttons'>${inv}</ul></div>`;
};

loadInventory();
