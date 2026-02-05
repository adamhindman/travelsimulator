// commandRegistry.js

/**
 * @file This module centralizes all game commands, mapping command strings to
 * their corresponding handler functions. It also implements the logic for
 * simple commands that were previously handled inline in app.js.
 */

// --- Imports ---

// Feature Modules
import * as commands from "./commands.js";
import {
  handleTake,
  handleInventory,
  inventory,
  addToInventory,
  itemIsInInventory,
  saveInventory,
} from "./inventory.js";
import { getNotebookContents, notebookEntries, saveNotebook } from "./notebook.js";
import { handleMonitor as npcHandleMonitor, createNpc } from "./npc.js";
import {
  handleEndGame,
  mutableState,
  npcs,
  curLocation,
  allAreas,
  setCanTeleport,
} from "./state.js";
import { handleText } from "./ui.js";

// Data and Utilities
import { helpText } from "./helpText.js";
import { globe } from "./globe.js";
import {
  catAllDescriptions,
  catAllObjects,
  catAllInventoryItems,
  getCountriesWithoutObjects,
  getLeastWordyCountries,
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
    catAllDescriptions(globe).split(" ").length +
    catAllObjects(globe).split(" ").length +
    catAllInventoryItems(globe).split(" ").length;
  const noObjects = getCountriesWithoutObjects(globe);
  let msg = `<p>Size of the globe: ${Math.round(
    roughSizeOfObject(globe) / 1000,
  )}k / ${totalWords} words<br/>Countries without objects: ${
    noObjects.length
  } out of ${globe.length}`;
  if (noObjects.length > 0) {
    msg += `<br/>First country without objects: ${noObjects[0].area}`;
  }

  const throbbersFound = inventory.filter(item => item.questline === "throbbers").length;

  const totalThrobbers = globe.reduce((acc, country) => {
    const countryThrobbers = (country.objects || []).reduce((cAcc, obj) => {
      if (obj.inventoryItem && obj.inventoryItem.questline === "throbbers") {
        return cAcc + 1;
      }
      return cAcc;
    }, 0);
    return acc + countryThrobbers;
  }, 0);

  msg += `<br/>Objects throbbing with unearthly power: ${throbbersFound} of ${totalThrobbers}`;
  const totalMoves = Number(localStorage.getItem("totalMoves")) - 1 || 0;
  msg += `<br/>You've moved about ${totalMoves} times`;
  return msg;
}

/**
 * Handles the 'audit' command (secret) to list countries with fewest words.
 */
function handleAudit(noun, words, neighbors) {
  const leastWordy = getLeastWordyCountries(globe);
  let msg = "<p>Top 10 least wordy countries (object descriptions):</p><ul>";
  leastWordy.forEach(c => {
    msg += `<li>${c.area}: ${c.count} words</li>`;
  });
  msg += "</ul>";
  return msg;
}

/**
 * Handles the 'win' command for debugging/testing.
 */
function handleWin(noun, words, neighbors) {
  const visited = allAreas.map(area => area.toLowerCase());
  localStorage.setItem("visited", JSON.stringify(visited));
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
  const totalMoves = Number(localStorage.getItem("totalMoves")) || 0;
  if (totalMoves - lastMonitorTurn >= 3) {
    lastMonitorTurn = totalMoves;
    // Pass the arguments straight through to the real handler.
    return npcHandleMonitor(noun, words, neighbors);
  } else {
    return "<p>The satellites are overheated, try again later.</p>";
  }
}

/**
 * Handles the 'spawn' command to create a new NPC.
 * @returns {string} A confirmation message.
 */
function handleSpawn(noun, words, neighbors) {
  let speed = 5;
  let area = null;

  if (words.length > 1) {
    if (isInt(words[1])) {
      speed = Number(words[1]);
      if (words.length > 2) {
        area = words.slice(2).join(" ");
      }
    } else {
      area = words.slice(1).join(" ");
    }
  }

  createNpc(speed, area);
  return "";
}

/**
 * Handles the 'debug' command to enable teleportation and grant quest items.
 */
function handleDebug(noun, words, neighbors) {
  setCanTeleport(true);

  let addedCount = 0;
  globe.forEach(country => {
    (country.objects || []).forEach(obj => {
      if (obj.inventoryItem && obj.inventoryItem.questline === "throbbers") {
        const [hasItem, items] = itemIsInInventory(obj.inventoryItem.name);
        if (!hasItem) {
          addToInventory(obj.inventoryItem);
          addedCount++;
        } else {
          items.forEach(item => {
            item.questline = "throbbers";
          });
        }
      }
    });
  });

  saveInventory();

  // Fix stale notebook entries for the throbber quest
  const questStart =
    "A giant crab man in Atlantis gave me a quest to find all 17 objects that glow with unearthly power. He said if I get stuck, I can ask POSEIDON for help.";
  const questEntry = `${questStart} {{THROBBER_COUNT}}`;

  let notesUpdated = false;
  for (let i = 0; i < notebookEntries.length; i++) {
    if (notebookEntries[i].startsWith(questStart)) {
      if (notebookEntries[i] !== questEntry) {
        notebookEntries[i] = questEntry;
        notesUpdated = true;
      }
    }
  }

  if (notesUpdated) {
    saveNotebook();
  }

  return `<p>Debug mode enabled. Teleportation activated.</p><p>Added ${addedCount} throbber items to inventory.</p>`;
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
  track: handleMonitorWrapper,
  take: handleTake,
  i: handleInventory,
  inv: handleInventory,
  inventory: handleInventory,
  passport: commands.handleCheckPassport,
  notebook: getNotebookContents,
  mon: handleMonitorWrapper,
  monitor: handleMonitorWrapper,
  text: handleText,
  write: commands.handleWrite,
  help: handleHelp,
  stats: handleStats,
  win: handleWin,
  spawn: handleSpawn,
  despawn: commands.handleDespawn,
  debug: handleDebug,
  audit: handleAudit,
};
