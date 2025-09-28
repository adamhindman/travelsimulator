// commandRegistry.js

/**
 * @file This module centralizes all game commands, mapping command strings to
 * their corresponding handler functions. It also implements the logic for
 * simple commands that were previously handled inline in app.js.
 */

// --- Imports ---

// Feature Modules
import * as commands from "./commands.js";
import { handleTake, handleInventory } from "./inventory.js";
import { handleMonitor as npcHandleMonitor } from "./npc.js";
import { handleEndGame, mutableState, npcs, curLocation } from "./state.js";
import { handleText } from "./ui.js";

// Data and Utilities
import { helpText } from "./helpText.js";
import { globe } from "./globe.js";
import { allCountries } from "./allCountries.js";
import {
  catAllDescriptions,
  catAllObjects,
  getCountriesWithoutObjects,
  roughSizeOfObject,
  isInt,
} from "./utilities.js";

// --- State for Cooldowns ---

let lastMonitorTurn = -3; // Set to < 0 to allow first use

// --- Command Handler Implementations & Wrappers ---

/**
 * Handles the 'help' command.
 * @returns {string} The help text.
 */
function handleHelp(noun, words, neighbors) {
  return helpText;
}

/**
 * Handles the 'stats' command, displaying game statistics.
 * @returns {string} A string containing game stats.
 */
function handleStats(noun, words, neighbors) {
  const totalWords =
    catAllDescriptions(globe).split(" ").length + catAllObjects(globe).split(" ").length;
  const noObjects = getCountriesWithoutObjects(globe);
  let msg = `<p>Size of the globe: ${Math.round(
    roughSizeOfObject(globe) / 1000,
  )}k / ${totalWords} words<br/>Countries without objects: ${
    noObjects.length
  } out of ${globe.length}`;
  if (noObjects.length > 0) {
    msg += `<br/>First country without objects: ${noObjects[0].area}`;
  }
  const totalMoves = Number(localStorage.getItem("totalMoves")) - 1 || 0;
  msg += `<br/>You've moved about ${totalMoves} times</p>`;
  return msg;
}

/**
 * Handles the 'win' command for debugging/testing.
 */
function handleWin(noun, words, neighbors) {
  localStorage.setItem("visited", JSON.stringify(allCountries));
  handleEndGame();
  return ""; // handleEndGame manages the UI change.
}

/**
 * A wrapper for the randomwalk command to handle noun parsing.
 * @param {string} noun The number of steps to walk.
 * @returns {string} A message to display to the user.
 */
function handleRandomWalkWrapper(noun, words, neighbors) {
  let loops = 100;
  if (noun && isInt(noun)) {
    loops = Number(noun);
  }
  // This command starts an async process and returns an initial message.
  commands.handleRandomWalk(loops);
  return `You take a walk around the globe.<p>This process will end automatically after ${loops} steps.</p><p>Press [ESCAPE] to stop sooner than that.</p>`;
}

/**
 * A wrapper for the monitor command to handle its cooldown logic.
 * @param {string} noun The noun part of the user's command.
 * @returns {string} The result message.
 */
function handleMonitorWrapper(noun, words, neighbors) {
  if (mutableState.playerTurnCount - lastMonitorTurn >= 3) {
    lastMonitorTurn = mutableState.playerTurnCount;
    // Pass the arguments straight through to the real handler.
    return npcHandleMonitor(noun, words, neighbors);
  } else {
    return "<p>The satellites are overheated, try again later.</p>";
  }
}

// --- Command Registry ---

/**
 * A map of command verbs (and aliases) to their handler functions.
 * The main `handleSubmit` function will use this registry to delegate tasks.
 */
export const commandRegistry = {
  // Aliases first, then primary command name.
  go: commands.handleGo,
  walk: commands.handleGo,

  look: commands.handleLook,
  examine: commands.handleLook,
  ex: commands.handleLook,
  exits: commands.handleLook,

  tel: commands.handleTel,
  teleport: commands.handleTel,

  randomwalk: handleRandomWalkWrapper,

  forget: commands.handleForget,

  passport: commands.handleCheckPassport,

  track: commands.handleTrack,

  take: handleTake,

  i: handleInventory,
  inv: handleInventory,
  inventory: handleInventory,

  mon: handleMonitorWrapper,
  monitor: handleMonitorWrapper,

  text: handleText,

  help: handleHelp,

  stats: handleStats,

  win: handleWin,
};
