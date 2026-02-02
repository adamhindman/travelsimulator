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
  setFlag,
  resetFlags,
  getFlag,
  canTeleport,
} from "./state.js";
import { render, promptField } from "./ui.js";

// Imports from other modules
import { findShortestPath } from "./pathfinder.js";
import {
  addToInventory,
  itemIsInInventory,
  checkForQuestNote,
  removeFromInventory,
  inventory,
  initialInventory,
  saveInventory,
  clearQuestNotes,
} from "./inventory.js";
import {
  getNotebookContents,
  clearNotebook,
  triggerNotebookEntry,
  addToNotebook,
} from "./notebook.js";
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

function findNextThrobberLocation() {
  for (const country of globe) {
    if (!country.objects) continue;
    for (const obj of country.objects) {
      if (
        obj.inventoryItem &&
        typeof obj.inventoryItem === "object" &&
        obj.inventoryItem.questline === "throbbers"
      ) {
        const [hasItem] = itemIsInInventory(obj.inventoryItem.name);
        if (!hasItem) {
          return country.area;
        }
      }
    }
  }
  return null;
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

  // Special case: looking at the notebook
  if (noun.toLowerCase() === "notebook") {
    msg = getNotebookContents();
    return { msg, showLoc };
  }

  // Special case: looking at the passport
  if (noun.toLowerCase() === "passport") {
    msg = handleCheckPassport();
    return { msg, showLoc };
  }

  if (inArea) {
    const objects = getAttributeOfArea("objects");
    const descriptions = objects.map(obj => obj.description);
    msg = `<span class="object-description">${descriptions[oIndex]}</span>`;

    // Check if this object has a notebook entry to trigger
    const objectData = objects[oIndex];

    if (objectData.name === "ATLANTEAN TRIAL") {
      const throbbersFound = inventory.filter(
        item => item.questline === "throbbers",
      ).length;

      const totalThrobbers = globe.reduce((acc, country) => {
        const countryThrobbers = (country.objects || []).reduce((cAcc, obj) => {
          if (obj.inventoryItem && obj.inventoryItem.questline === "throbbers") {
            return cAcc + 1;
          }
          return cAcc;
        }, 0);
        return acc + countryThrobbers;
      }, 0);

      if (throbbersFound >= totalThrobbers && totalThrobbers > 0) {
        setFlag("atlantisQuestCompleted", true);
        for (let i = inventory.length - 1; i >= 0; i--) {
          if (inventory[i].questline === "throbbers") {
            inventory.splice(i, 1);
          }
        }
        saveInventory();

        const transitionMsg =
          '<div class="wrapped-box">As you place the final object on the dais, a blinding light envelopes you. The weight of the artifacts vanishes from your pack, and the world dissolves...</div>';
        msg += transitionMsg;

        setTimeout(() => {
          const spawnMsg = updateLocation("Transdimensional Nexus");
          if (spawnMsg) {
            render("", spawnMsg, "Transdimensional Nexus", true);
          } else {
            render("", null, "Transdimensional Nexus", false);
          }
        }, 3000);
      }
    }

    if (objectData.notebookEntry) {
      if (!objectData.setFlag || !getFlag(objectData.setFlag)) {
        const notebookMsg = triggerNotebookEntry(objectData.notebookEntry);
        msg += notebookMsg;
      }
    }

    // Check if this object has an inventory item to trigger
    if (objectData.inventoryItem) {
      const itemName =
        typeof objectData.inventoryItem === "string"
          ? objectData.inventoryItem
          : objectData.inventoryItem.name;
      const [hasItem] = itemIsInInventory(itemName);

      const isThrobber =
        typeof objectData.inventoryItem === "object" &&
        objectData.inventoryItem.questline === "throbbers";

      if (!hasItem && (!isThrobber || !getFlag("atlantisQuestCompleted"))) {
        addToInventory(objectData.inventoryItem);
        msg += `<p>You looted <span class="button object" data-object="${itemName}">${itemName}</span> and added it to your inventory.</p>`;
      }
    }

    if (objectData.setFlag) {
      const flagMsg = setFlag(objectData.setFlag);
      if (flagMsg) msg += flagMsg;
    }

    if (objectData.name === "POSEIDON") {
      if (getFlag("atlantisQuestCompleted")) {
        msg += `<p>Poseidon's kingly face is still, placid. He stares  confidently, like a photograph on a corporate website. He says nothing.</p>`;
      } else if (!getFlag("atlantisQuestActive")) {
        msg += `<p>\"Uhh, never mind. I'll come back once I've started the ATLANTEAN TRIAL. Sorry to waste your time, and congratulations on having such a mighty trident.\"</p>`;
      } else {
        const nextLocation = findNextThrobberLocation();
        if (nextLocation) {
          msg += `\"Where should I travel to complete the ATLANTEAN TRIAL?\"</p><div class=\"wrapped-box\"><p>The Sea Lord lifts his great head, and speaks in a voice that booms like the crashing waves.</p><p>\"Mortal, I convey to you a message from the Moirai, who weave the fates of men with their hands. Your destiny leads you next to ${nextLocation}!\"</p></div>`;
        } else {
          msg += `<p>\"I had thought the age of heroes long past, yet you surprise me, mortal. I have no more aid to render you, for you have assembled all the lost artifacts. I can hear them in your backpack. You are now ready to complete the ATLANTEAN TRIAL. Your destiny awaits within!\"</p>`;
        }
      }
    }
  } else if (inInv) {
    msg = `<p>${invItems[0].description}</p>`;
  } else {
    // Check if noun matches any NPC name in current location
    const lowerNoun = noun.toLowerCase();
    const npc = npcs.find(
      npc =>
        npc.name.toLowerCase() === lowerNoun &&
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
  const [hasTeleporter] = itemIsInInventory("Handheld Teleporter");

  if (!canTeleport && !hasTeleporter) {
    return "<p>You'd love to teleport there, but you can't.</p>";
  }

  if (
    areaExists(noun) &&
    (canTeleport || getAttributeOfArea("type", noun) !== "nonplace")
  ) {
    const spawnMessage = updateLocation(noun);
    return spawnMessage || "";
  }
  return `<p>You'd love to teleport there, but you can't.</p>`;
}

function handleForget(noun, words, neighbors) {
  if (noun) {
    const item = localStorage.getItem(noun);
    if (item) {
      localStorage.removeItem(noun);
      if (noun.toLowerCase() === "npcs") {
        npcs.length = 0;
        localStorage.removeItem("metNpcs");
      }
      if (noun.toLowerCase() === "inventory") {
        inventory.length = 0;
        inventory.push(...initialInventory);
      }
      return `<p>The contents of ${noun} have been forgotten.</p>`;
    } else {
      return `<p>There is nothing to forget about ${noun}.</p>`;
    }
  }
  const msg = `You enter a fugue state and wander back home.`;
  npcs.length = 0;
  localStorage.removeItem("npcs");
  resetEndGame();
  resetFlags();
  localStorage.setItem("visited", JSON.stringify([]));
  localStorage.setItem("totalMoves", "0");
  localStorage.removeItem("metNpcs");
  clearNotebook();
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

function handleCheckPassport(noun, words, neighbors) {
  const realPlaces = globe.filter(g => g.type !== "nonplace");
  const realPlacesLower = realPlaces.map(p => p.area.toLowerCase());
  const visited = getVisitedCountries().filter(v => realPlacesLower.includes(v));

  let msg = `<div class="passport">You've visited ${visited.length} out of ${realPlaces.length} places (${Math.floor(100 * (visited.length / realPlaces.length))}%)</p>`;
  const metNpcs = JSON.parse(localStorage.getItem("metNpcs") || "[]");
  msg += realPlaces.reduce((result, place) => {
    const current = place.area;
    if (inArray(current.toLowerCase(), visited)) {
      return result + `<span class="visited">${capitalize(current)}</span>`;
    }
    return result + `<span class="not-visited">${capitalize(current)}</span>`;
  }, "");
  if (metNpcs.length > 0) {
    msg += `<p>New friends you've made: ${metNpcs.join(", ")}.</p>`;
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
    const spawnMessage = updateLocation(randomNeighbor, true);
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

function handleWrite(noun) {
  if (!noun) {
    return "<p>What do you want to write?</p>";
  }
  return triggerNotebookEntry(noun);
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
  handleCheckPassport,
  handleRandomWalk,
  handleDespawn,
  handleWrite,
};
