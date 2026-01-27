export const initialInventory = [
  { name: "Gum", description: "A package of cinnamon gum." },
  { name: "Spare socks", description: "An extra pair of nice warm socks." },
  {
    name: "Yellow flashlight",
    description: "A bright yellow flashlight: the wanderer's companion",
  },
  {
    name: "Monitor",
    description:
      "A handheld global satellite monitor, which can easily track the location of anyone, anywhere, at any time. Type MONITOR or TRACK to use it.",
  },
  {
    name: "Passport",
    description:
      "A slightly worn passport filled with stamps. Type LOOK PASSPORT to check your travels.",
  },
  {
    name: "Pen",
    description:
      "It's a blue ballpoint pen with the logo of a credit union printed on it. This might be useful to WRITE in your notebook.",
  },
  {
    name: "Notebook",
    description:
      "A small leather notebook for jotting down important information. Type LOOK NOTEBOOK to read it.",
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

// Legacy quest note functions - kept for compatibility but deprecated
export const checkForQuestNote = npcName => {
  // Quest notes are now in the notebook, not inventory
  return null;
};

export const clearQuestNotes = () => {
  // Quest notes are now managed by notebook.js
  // This function is deprecated but kept for compatibility
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
