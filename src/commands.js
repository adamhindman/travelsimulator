// Imports from app.js - this creates a temporary circular dependency
import {
  mutableState,
  updateLocation,
  itemIsInArea,
  getAttributeOfArea,
  npcs,
  curLocation,
  areaExists,
  updateURLHash,
  defaultArea,
  getVisitedCountries,
  allAreas,
} from "./app.js";
import { render, promptField } from "./ui.js";

// Imports from other modules
import { findShortestPath } from "./pathfinder.js";
import { getNpcDescription } from "./npc.js";
import { itemIsInInventory } from "./inventory.js";
import { inArray, capitalize, arrayToLowerCase } from "./utilities.js";
import { globe } from "./globe.js";

// Command Handlers

function handleGo(noun, neighbors) {
  if (neighbors.includes(noun)) {
    mutableState.playerTurnCount++;
    updateLocation(noun);
    return "";
  } else {
    return `<p>You can't get to ${noun} from here!</p>`;
  }
}

// This function now returns an object { msg, showLoc } to solve a bug
// where the showLoc flag was not being correctly updated.
function handleLook(noun, words) {
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
      const desc = getNpcDescription(npc);
      msg = `<p>${desc}</p>`;
    } else {
      msg = `<p>I don't see that here!</p>`;
    }
  }
  return { msg, showLoc };
}

function handleTel(noun) {
  if (areaExists(noun)) {
    mutableState.playerTurnCount++;
    updateLocation(noun);
    return "";
  }
  return `<p>You can't teleport there; it doesn't exist!</p>`;
}

function handleForget() {
  const msg = `You enter a fugue state and wander back home.`;
  setTimeout(() => {
    localStorage.clear();
    updateURLHash(defaultArea);
    window.location.reload();
  }, 2400);
  return msg;
}

const activities = [
  "eating an ice cream cone",
  "sleeping",
  "looking for a cell phone charger",
  "staring at the moon, drunk",
  "getting mugged",
  "chatting about the weather with a sad man",
  "doom scrolling",
  "taking a selfie",
  "trying to pet a dog who keeps walking away",
  "applying deodorant",
  "describing an app idea",
  "sitting in a restaurant",
  "watching a commercial",
  "arguing about progressive rock",
];

function handleTrack() {
  let messages = [];
  npcs.forEach(npc => {
    const path = findShortestPath(curLocation, npc.location);
    if (path) {
      const distance = path.length - 1;
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      messages.push(
        `${npc.name} is ${distance} places away, in ${npc.location}, ${randomActivity}.`,
      );
    } else {
      messages.push(`Could not track ${npc.name}.`);
    }
  });
  return messages.join("<br/>");
}

function handleCheckPassport() {
  const visited = getVisitedCountries();
  let msg = `<div class="passport">You've visited ${visited.length} out of ${globe.length} places (${Math.floor(100 * (visited.length / globe.length))}%)</p>`;
  msg += allAreas.reduce((result, current) => {
    if (inArray(current.toLowerCase(), visited)) {
      return result + `<span class="visited">${capitalize(current)}</span>`;
    }
    return result + `<span class="not-visited">${capitalize(current)}</span>`;
  }, "");
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
    updateLocation(randomNeighbor);
    render("", " ", curLocation, false);
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

export {
  handleGo,
  handleLook,
  handleTel,
  handleForget,
  handleTrack,
  handleCheckPassport,
  handleRandomWalk,
};
