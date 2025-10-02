// Imports from the state module
// Imports from the state module
// Imports from the state module
import {
  mutableState,
  updateLocation,
  getAttributeOfArea,
  npcs,
  curLocation,
  areaExists,
  updateURLHash,
  defaultArea,
  getVisitedCountries,
  allAreas,
  saveNpcs,
  initializeAutoSpawn,
  npcsToDespawn,
  resetEndGame,
} from "./state.js";
import { render, promptField } from "./ui.js";

// Imports from other modules
import { findShortestPath } from "./pathfinder.js";
import {
  itemIsInInventory,
  checkForQuestNote,
  removeFromInventory,
  inventory,
  initialInventory,
  saveInventory,
  clearQuestNotes,
} from "./inventory.js";
import { inArray, capitalize, arrayToLowerCase, isArray } from "./utilities.js";
import { globe } from "./globe.js";
import { despawn, createNpc, activities, handleLookAtNpc } from "./npc.js";

// This function was orphaned during refactoring; it lives here now
// because it is only used by handleLook.
function itemIsInArea(noun) {
  const objs = getAttributeOfArea("objects");
  if (!isArray(objs)) return [false, -1];
  const objects = arrayToLowerCase(objs.map(o => o.name));
  const index = objects.findIndex(item => item === noun);
  return [index !== -1, index];
}

// Command Handlers

function handleGo(noun, words, neighbors) {
  if (neighbors.includes(noun)) {
    const spawnMessage = updateLocation(noun);
    return spawnMessage || "";
  } else {
    return `<p>You can't get to ${noun} from here!</p>`;
  }
}

// This function now returns an object { msg, showLoc } to solve a bug
// where the showLoc flag was not being correctly updated.
function handleLook(noun, words, neighbors) {
  let msg = "";
  let showLoc = false;
  const [inArea, oIndex] = itemIsInArea(noun);
  const [inInv, invItems] = itemIsInInventory(noun);

  if (words.length === 1 || noun.toLowerCase() === "around") {
    showLoc = true;
    return { msg, showLoc };
  }

  if (inArea) {
    const descriptions = getAttributeOfArea("objects").map(obj => obj.description);
    msg = `<span class="object-description">${descriptions[oIndex]}</span>`;
  } else if (inInv) {
    msg = `<p>${invItems[0].description}</p>`;
  } else {
    // Check if noun matches any NPC name in current location
    const npc = npcs.find(
      npc =>
        npc.name.toLowerCase() === noun.toLowerCase() &&
        npc.location.toLowerCase() === curLocation.toLowerCase(),
    );
    if (npc) {
      msg = handleLookAtNpc(npc);
    } else {
      msg = `<p>I don't see that here!</p>`;
    }
  }
  return { msg, showLoc };
}

function handleTel(noun, words, neighbors) {
  if (areaExists(noun)) {
    const spawnMessage = updateLocation(noun);
    return spawnMessage || "";
  }
  return `<p>You can't teleport there; it doesn't exist!</p>`;
}

function handleForget(noun, words, neighbors) {
  const msg = `You enter a fugue state and wander back home.`;
  npcs.length = 0;
  localStorage.removeItem("npcs");
  resetEndGame();
  localStorage.setItem("visited", JSON.stringify([]));
  localStorage.setItem("totalMoves", "0");
  localStorage.removeItem("metNpcs");
  clearQuestNotes();
  inventory.length = 0;
  inventory.push(...initialInventory);
  saveInventory();

  setTimeout(() => {
    updateURLHash(defaultArea);
    window.location.reload();
  }, 2400);
  return msg;
}

function handleTrack(noun, words, neighbors) {
  let messages = [];
  npcs.forEach(npc => {
    const path = findShortestPath(curLocation, npc.location);
    if (path) {
      const distance = path.length - 1;
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      messages.push(
        `<p>${npc.name} is ${distance} places away, in ${npc.location.toUpperCase()}, ${randomActivity}.</p>`,
      );
    } else {
      messages.push(`Could not track ${npc.name}.`);
    }
  });
  return messages.join("<br/>");
}

function handleCheckPassport(noun, words, neighbors) {
  const visited = getVisitedCountries();
  let msg = `<div class="passport">You've visited ${visited.length} out of ${globe.length} places (${Math.floor(100 * (visited.length / globe.length))}%)</p>`;
  const metNpcs = JSON.parse(localStorage.getItem("metNpcs") || "[]");
  msg += allAreas.reduce((result, current) => {
    if (inArray(current.toLowerCase(), visited)) {
      return result + `<span class="visited">${capitalize(current)}</span>`;
    }
    return result + `<span class="not-visited">${capitalize(current)}</span>`;
  }, "");
  if (metNpcs.length > 0) {
    msg += `<p>People you've met: ${metNpcs.join(", ")}.</p>`;
  }
  return `${msg}</p></div>`;
}

function handleRandomWalk(steps = 500) {
  if (mutableState.walkInterval !== null) return;

  let loops = 0;
  mutableState.walkInterval = setInterval(() => {
    const neighbors = arrayToLowerCase(getAttributeOfArea("neighbors") || []);
    if (neighbors.length === 0) {
      clearInterval(mutableState.walkInterval);
      mutableState.walkInterval = null;
      return;
    }
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    const spawnMessage = updateLocation(randomNeighbor);
    render(spawnMessage || "", " ", curLocation, false);
    loops++;
    promptField.value = `${loops} / ${steps} (${randomNeighbor})`;
    if (loops >= steps) {
      clearInterval(mutableState.walkInterval);
      mutableState.walkInterval = null;
      promptField.value = "";
      render(
        "",
        `<p>Done! Ended normally after ${steps} trips.</p><p>Use LOOK to see where you ended up.</p>`,
        curLocation,
        false,
      );
    }
  }, 50);
}

function handleDespawn(noun) {
  if (!noun) {
    if (npcs.length === 0) {
      return "<p>There are no NPCs to remove.</p>";
    }
    npcs.length = 0;
    saveNpcs();
    initializeAutoSpawn();
    return "<p>All NPCs have been removed.</p>";
  }
  const npcName = noun.toLowerCase();
  const npcToRemove = npcs.find(npc => npc.name.toLowerCase() === npcName);

  if (!npcToRemove) {
    return `<p>NPC "${noun}" not found.</p>`;
  }

  despawn(npcToRemove.name);
  return `<p>${npcToRemove.name} has been removed.</p>`;
}

export {
  handleGo,
  handleLook,
  handleTel,
  handleForget,
  handleTrack,
  handleCheckPassport,
  handleRandomWalk,
  handleDespawn,
};
