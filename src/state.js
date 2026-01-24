import { globe } from "./globe.js";
import { npcRandomStep, createNpc } from "./npc.js";
import { isArray, hashify } from "./utilities.js";

function loadNpcs() {
  const storedNpcs = localStorage.getItem("npcs");
  if (!storedNpcs) return null;
  const parsedNpcs = JSON.parse(storedNpcs);
  return isArray(parsedNpcs) ? parsedNpcs : null;
}

// --- State Variables ---

// Static world data
export const allAreas = globe.map(area => area.area);
export const defaultArea = "United States";

// Player and NPC state
export let curLocation = localStorage.getItem("lastLocation") || "United States";
export let npcs = loadNpcs() || [];
export let visited = [];
export let npcsToDespawn = [];

// Mutable state that needs to be an object to be passed by reference
export const mutableState = {
  walkInterval: null,
  npcSpawnThreshold: null,
};

// Game flow state
export let showEndGame = false;
export let endGameAlreadyShown =
  JSON.parse(localStorage.getItem("endGameAlreadyShown")) || false;

// --- State Management Functions ---

export function areaExists(areaName) {
  return globe.some(c => c.area.toLowerCase().trim() === areaName.toLowerCase().trim());
}

export function cleanPassport() {
  // Directly modifies the module-level 'visited' variable
  visited = visited.filter(item => areaExists(item));
}

export function getVisitedCountries() {
  const defaultVisited = ["united states"];
  const lsVisited = JSON.parse(localStorage.getItem("visited"));
  return isArray(lsVisited) && lsVisited.length > 0 ? lsVisited : defaultVisited;
}

export function getAttributeOfArea(attrib, area = curLocation) {
  const validArea = areaExists(area) ? area : defaultArea;
  const areaObj = globe.find(i => i.area.toLowerCase() === validArea.toLowerCase());
  return areaObj ? areaObj[attrib] : null;
}

export function getAreaDescription(area = curLocation) {
  return getAttributeOfArea("description", area) || "";
}

export function saveNpcs() {
  localStorage.setItem("npcs", JSON.stringify(npcs));
}

export function handleEndGame() {
  const won = globe.length <= getVisitedCountries().length;

  if (won && !endGameAlreadyShown) {
    // This is the turn the user wins.
    showEndGame = true;
    endGameAlreadyShown = true;
    localStorage.setItem("endGameAlreadyShown", JSON.stringify(true));
  } else {
    showEndGame = false;
  }
}

export function resetEndGame() {
  endGameAlreadyShown = false;
  localStorage.removeItem("endGameAlreadyShown");
}

export function updateURLHash(destination) {
  const hash = hashify(destination);
  if (history.pushState) {
    history.pushState(null, null, hash);
  } else {
    location.hash = hash;
  }
}

export function updatePassport(destination = curLocation) {
  let passport = getVisitedCountries(); // Use the getter to ensure we start with a valid list
  if (!passport.includes(destination.toLowerCase())) {
    passport.push(destination.toLowerCase());
  }
  localStorage.setItem("visited", JSON.stringify(passport));
  // Update the module-level 'visited' variable as well
  visited = passport;
  handleEndGame();
}

export function updateLocation(destination, isRandomWalk = false) {
  // Directly modifies the module-level 'curLocation' variable
  curLocation = destination;
  localStorage.setItem("lastLocation", destination);
  updatePassport(destination);

  // Despawn NPCs marked for removal
  if (npcsToDespawn.length > 0) {
    npcs = npcs.filter(npc => !npcsToDespawn.includes(npc.name));
    npcsToDespawn = [];
  }

  if (npcs.length === 0 && !mutableState.npcSpawnThreshold) {
    initializeAutoSpawn();
  }

  // Increment moveCounter for each NPC and move if their interval is reached
  npcs.forEach(npc => {
    npc.moveCounter++;
    if (npc.moveCounter >= npc.moveInterval) {
      npcRandomStep(npc, getAttributeOfArea);

      npc.moveCounter = 0;
    }
  });

  saveNpcs();

  const nextTotalMoves = (Number(localStorage.getItem("totalMoves")) || 0) + 1;
  localStorage.setItem("totalMoves", nextTotalMoves);

  if (isRandomWalk && mutableState.npcSpawnThreshold !== null) {
    mutableState.npcSpawnThreshold++;
  }

  if (document.location.hash !== hashify(destination)) {
    updateURLHash(destination);
  }

  let spawnMessage = null;
  if (
    !isRandomWalk &&
    mutableState.npcSpawnThreshold &&
    npcs.length === 0 &&
    (Number(localStorage.getItem("totalMoves")) || 0) >= mutableState.npcSpawnThreshold
  ) {
    createNpc(5, destination);
    if (npcs.length > 0) {
      const npcName = npcs[npcs.length - 1].name;
      spawnMessage = `<p>All of a sudden, you notice someone behind you.</p> "Hello, my name is <span class="button npc" data-npc="${npcName}">${npcName}</span>", he says. "I have a favor to ask. Can you find my friend?"</p>`;
    }
    mutableState.npcSpawnThreshold = null; // Ensure this only runs once
  }

  return spawnMessage;
}

// Initial hydration of state from localStorage
visited = getVisitedCountries();
cleanPassport(); // Sanitize the list
localStorage.setItem("visited", JSON.stringify(visited)); // Save sanitized list back to localStorage

export function initializeAutoSpawn() {
  if (npcs.length === 0 && !showEndGame) {
    const currentMoves = Number(localStorage.getItem("totalMoves")) || 0;
    // Set threshold to a future move count
    mutableState.npcSpawnThreshold = currentMoves + Math.floor(Math.random() * 4) + 3;
  }
}

initializeAutoSpawn();
