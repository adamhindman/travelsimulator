import { globe } from "./globe.js";
import { initializeNpcs, npcRandomStep } from "./npc.js";
import { isArray, hashify } from "./utilities.js";

// --- State Variables ---

// Static world data
export const allAreas = globe.map(area => area.area);
export const defaultArea = "United States";

// Player and NPC state
export let curLocation = localStorage.getItem("lastLocation") || "United States";
export let npcs = initializeNpcs(allAreas);
export let visited = [];

// Mutable state that needs to be an object to be passed by reference
export const mutableState = {
  playerTurnCount: 0,
  walkInterval: null,
};

// Game flow state
export let showEndGame = false;
// This was originally in app.js but is only used in ui.js. We'll keep it with the other state.
export let endGameAlreadyShown = false;

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

export function handleEndGame() {
  const previously = showEndGame;
  showEndGame = globe.length <= getVisitedCountries().length;

  // If the game was just won, allow the message to be shown once.
  if (!previously && showEndGame) {
    endGameAlreadyShown = false;
  } else if (showEndGame) {
    // On subsequent calls after winning, mark the message as shown.
    endGameAlreadyShown = true;
  }
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

export function updateLocation(destination) {
  // Directly modifies the module-level 'curLocation' variable
  curLocation = destination;
  localStorage.setItem("lastLocation", destination);
  updatePassport(destination);

  // Increment moveCounter for each NPC and move if their interval is reached
  npcs.forEach(npc => {
    npc.moveCounter++;
    if (npc.moveCounter >= npc.moveInterval) {
      npcRandomStep(npc, getAttributeOfArea);

      npc.moveCounter = 0;
    }
  });

  const nextTotalMoves = (Number(localStorage.getItem("totalMoves")) || 0) + 1;
  localStorage.setItem("totalMoves", nextTotalMoves);
  if (document.location.hash !== hashify(destination)) {
    updateURLHash(destination);
  }
}

// Initial hydration of state from localStorage
visited = getVisitedCountries();
cleanPassport(); // Sanitize the list
localStorage.setItem("visited", JSON.stringify(visited)); // Save sanitized list back to localStorage
