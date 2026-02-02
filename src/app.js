// Game Orchestrator - Main Entry Point

// --- Imports ---

// Utilities
import { arrayToLowerCase, storageAvailable } from "./utilities.js";

// Core UI and State Modules
import {
  applySavedFontSize,
  initListeners,
  render,
  focusOnPrompt,
  submitBtn,
  promptField,
  handleUnknownVerb,
} from "./ui.js";
import { curLocation, updatePassport, getAttributeOfArea } from "./state.js";

// The new command registry
import { commandRegistry } from "./commandRegistry.js";
import { loadInventory } from "./inventory.js";

// --- Main Application Logic ---

/**
 * The main command processing function. It takes the user's input, figures out
 * the command, and delegates to the appropriate handler via the command registry.
 * @param {string} val The raw input from the user.
 */
function handleSubmit(val) {
  val = val.toLowerCase().replace(/\s+/g, " ").trim();
  const words = val.split(" ");
  const verb = words[0];
  const noun = words.slice(1).join(" ");
  const neighbors = arrayToLowerCase(getAttributeOfArea("neighbors") || []);

  let msg = "";
  let showLoc = false;
  const startLocation = curLocation;

  const handler = commandRegistry[verb];

  if (handler) {
    const result = handler(noun, words, neighbors);
    if (typeof result === "object" && result !== null) {
      msg = result.msg;
      showLoc = result.showLoc;
    } else {
      msg = result;
    }
  } else if (verb !== "") {
    msg = handleUnknownVerb(verb);
  }

  if (curLocation !== startLocation || showLoc) {
    render(val, null, curLocation, false);
    if (msg) {
      render(null, msg, curLocation, false);
    }
  } else {
    render(val, msg, curLocation, false);
  }
  focusOnPrompt();
  submitBtn.classList.remove("shown");
}

// --- Initialization ---

if (storageAvailable("localStorage")) {
  loadInventory();
  applySavedFontSize();
  initListeners();
  updatePassport(); // Make sure passport is up-to-date on load
  render(); // Initial render
} else {
  document.write(
    "My game uses localStorage to save your state between sessions, and frankly it's so tightly coupled that the game won't work without it. I don't track or save any of your data, so, if you can, please consider turning on localStorage to play my game.",
  );
}

// Export handleSubmit so ui.js can call it
export { handleSubmit };
