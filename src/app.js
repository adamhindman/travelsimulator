// Game Orchestrator - Main Entry Point

// --- Imports for app.js's own logic ---

// Data and Utilities
import { globe } from "./globe.js";
import { allCountries } from "./allCountries.js";
import { helpText } from "./helpText.js";
import {
  arrayToLowerCase,
  isInt,
  roughSizeOfObject,
  catAllDescriptions,
  catAllObjects,
  getCountriesWithoutObjects,
  storageAvailable,
} from "./utilities.js";

// Feature Modules
import { handleMonitor } from "./npc.js";
import { handleInventory, handleTake } from "./inventory.js";
import * as commands from "./commands.js";

// Core UI and State Modules
import {
  applySavedFontSize,
  initListeners,
  render,
  focusOnPrompt,
  submitBtn,
  promptField,
} from "./ui.js";
import {
  curLocation,
  mutableState,
  npcs,
  getAttributeOfArea,
  updatePassport,
  handleEndGame,
} from "./state.js";

// --- Main Application Logic ---

console.clear();

// This state is specific to the command cooldown logic in the main loop.
let lastMonitorTurn = -3; // Set to < 0 to allow first use

/**
 * The main command processing function. It takes the user's input, figures out
 * the command, and delegates to the appropriate handler.
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

  switch (verb) {
    // Commands from commands.js
    case "go":
    case "walk":
      msg = commands.handleGo(noun, neighbors);
      break;
    case "look":
    case "examine":
    case "ex":
    case "exits":
      {
        const result = commands.handleLook(noun, words);
        msg = result.msg;
        showLoc = result.showLoc;
      }
      break;
    case "tel":
    case "teleport":
      msg = commands.handleTel(noun);
      break;
    case "randomwalk":
      {
        let loops = 100;
        if (noun !== verb && isInt(noun)) {
          loops = Number(noun);
        }
        msg = `You take a walk around the globe.<p>This process will end automatically after ${loops} steps.</p><p>Press [ESCAPE] to stop sooner than that.</p>`;
        commands.handleRandomWalk(loops);
      }
      break;
    case "forget":
      msg = commands.handleForget();
      break;
    case "passport":
      msg = commands.handleCheckPassport();
      break;
    case "track":
      msg = commands.handleTrack();
      break;

    // Commands from other modules
    case "take":
      msg = handleTake();
      break;
    case "i":
    case "inv":
    case "inventory":
      msg = handleInventory();
      break;
    case "mon":
    case "monitor":
      if (mutableState.playerTurnCount - lastMonitorTurn >= 3) {
        msg = handleMonitor(npcs, curLocation, noun);
        lastMonitorTurn = mutableState.playerTurnCount;
      } else {
        msg = "<p>The satellites are overheated, try again later.</p>";
      }
      break;

    // Simple commands handled directly in the orchestrator
    case "text":
      {
        const root = document.documentElement;
        let newSize;
        const sizeMap = { small: 1.4, medium: 1.8, large: 2.1 };
        const parsedNoun = parseFloat(noun);

        if (sizeMap[noun]) {
          newSize = sizeMap[noun];
        } else if (noun === "default") {
          newSize = 1.6;
        } else if (!isNaN(parsedNoun) && parsedNoun >= 1 && parsedNoun <= 3) {
          newSize = parsedNoun;
        } else {
          msg =
            'Invalid command. Use "text small", "medium", "large", "default", or a number between 1 and 3.';
          break;
        }
        root.style.setProperty("--font-size-base", `${newSize}rem`);
        localStorage.setItem("fontSize", newSize);
        msg = `Text size set to ${newSize.toFixed(1)}rem.`;
      }
      break;
    case "help":
      msg = helpText;
      break;
    case "stats":
      {
        const totalWords =
          catAllDescriptions(globe).split(" ").length +
          catAllObjects(globe).split(" ").length;
        const noObjects = getCountriesWithoutObjects(globe);
        msg = `<p>Size of the globe: ${Math.round(roughSizeOfObject(globe) / 1000)}k / ${totalWords} words<br/>Countries without objects: ${noObjects.length} out of ${globe.length}`;
        if (noObjects.length > 0) {
          msg += `<br/>First country without objects: ${noObjects[0].area}`;
        }
        const totalMoves = Number(localStorage.getItem("totalMoves")) - 1 || 0;
        msg += `<br/>You've moved about ${totalMoves} times</p>`;
      }
      break;
    case "win":
      localStorage.setItem("visited", JSON.stringify(allCountries));
      handleEndGame();
      break;
    case "":
      // Do nothing on empty input
      break;
    default:
      msg = `<p>I don't recognize the verb "${verb}".</p>`;
  }

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
