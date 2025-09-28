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

  const handler = commandRegistry[verb];

  if (handler) {
    // The 'look' command is special as it can affect `showLoc`.
    if (verb === "look" || verb === "examine" || verb === "ex" || verb === "exits") {
      const result = handler(noun, words, neighbors);
      msg = result.msg;
      showLoc = result.showLoc;
    } else {
      // For consistency, we pass the same arguments to all handlers.
      // The handlers can then use what they need.
      msg = handler(noun, words, neighbors);
    }
  } else if (verb !== "") {
    msg = handleUnknownVerb(verb);
  }
  // An empty verb (just pressing enter) should do nothing, so no 'else' is needed.

  render(val, msg, curLocation, showLoc);
  focusOnPrompt();
  submitBtn.classList.remove("shown");
  promptField.value = "";
}

// --- Initialization ---

if (storageAvailable("localStorage")) {
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
