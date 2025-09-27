import { globe } from "./globe.js";
import { findShortestPath } from "./pathfinder.js";
import {
  initializeNpcs,
  npcRandomStep,
  calculateAndLogNpcDistances,
  handleMonitor,
  getNpcDescription,
} from "./npc.js";
import { endGameMsg } from "./endgame.js";
import { allCountries } from "./allCountries.js";
import {
  capitalize,
  arrayToLowerCase,
  isArray,
  inArray,
  roughSizeOfObject,
  catAllObjects,
  catAllDescriptions,
  getCountriesWithoutObjects,
  isInt,
  sluggify,
  hashify,
  dehashify,
  storageAvailable,
  getLastArea,
  getLastObject,
} from "./utilities.js";
import { helpText } from "./helpText.js";
import {
  inventory,
  handleInventory,
  handleTake,
  itemIsInInventory,
} from "./inventory.js";
import * as commands from "./commands.js";
import {
  applySavedFontSize,
  initListeners,
  render,
  focusOnPrompt,
  submitBtn,
  promptField,
} from "./ui.js";

console.clear();

export const allAreas = globe.map(area => area.area);
export const defaultArea = "United States";

export let curLocation = localStorage.getItem("lastLocation") || "United States";

// NPCs state
export let npcs = initializeNpcs(allAreas);

// Cooldown state for monitor command
export const mutableState = {
  playerTurnCount: 0,
  walkInterval: null,
};
let lastMonitorTurn = -3; // Set to < 0 to allow first use

let visited = [];
export let showEndGame = false;
export let endGameAlreadyShown = false;

export function areaExists(areaName) {
  return globe.some(c => c.area.toLowerCase().trim() === areaName.toLowerCase().trim());
}

function cleanPassport() {
  return visited.filter(item => areaExists(item));
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

export function updateURLHash(destination) {
  const hash = hashify(destination);
  if (history.pushState) {
    history.pushState(null, null, hash);
  } else {
    location.hash = hash;
  }
}

function updatePassport(destination = curLocation) {
  let passport = [];
  if (localStorage.getItem("visited")) {
    passport = JSON.parse(localStorage.getItem("visited"));
  }
  if (!passport.includes(destination.toLowerCase())) {
    passport.push(destination.toLowerCase());
  }
  localStorage.setItem("visited", JSON.stringify(passport));
  handleEndGame();
}

export function updateLocation(destination) {
  curLocation = destination;
  localStorage.setItem("lastLocation", destination);
  updatePassport(destination);

  // Increment moveCounter for each NPC and move if their interval reached
  npcs.forEach(npc => {
    npc.moveCounter++;
    if (npc.moveCounter >= npc.moveInterval) {
      npcRandomStep(npc, getAttributeOfArea);
      console.log(`${npc.name} moves to ${npc.location}`);

      // Alert if NPC and player share the same location
      if (curLocation.toLowerCase() === npc.location.toLowerCase()) {
        // alert removed, NPC presence will be added to display instead
      }
      npc.moveCounter = 0;
    }
  });

  const nextTotalMoves = (Number(localStorage.getItem("totalMoves")) || 0) + 1;
  localStorage.setItem("totalMoves", nextTotalMoves);
  if (document.location.hash !== hashify(destination)) {
    updateURLHash(destination);
  }
  calculateAndLogNpcDistances(npcs, curLocation);
}

function handleSubmit(val) {
  val = val.toLowerCase().replace(/\s+/g, " ").trim();
  const words = val.split(" ");
  const verb = words[0];
  const noun = words.slice(1).join(" ");
  const neighbors = arrayToLowerCase(getAttributeOfArea("neighbors") || []);
  let msg = "";
  let showLoc = false;

  switch (verb) {
    case "go":
    case "walk":
      msg = commands.handleGo(noun, neighbors);
      break;
    case "text":
      {
        const root = document.documentElement;
        let newSize;
        const sizeMap = {
          small: 1.4,
          medium: 1.8,
          large: 2.1,
        };

        const parsedNoun = parseFloat(noun);
        if (sizeMap[noun]) {
          newSize = sizeMap[noun];
        } else if (noun === "default") {
          newSize = 1.6;
        } else if (!isNaN(parsedNoun)) {
          if (parsedNoun >= 1 && parsedNoun <= 3) {
            newSize = parsedNoun;
          } else {
            msg = "Please enter a value between 1 and 3.";
            break;
          }
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
    case "forget":
      msg = commands.handleForget();
      break;
    case "passport":
      msg = commands.handleCheckPassport();
      break;
    case "take":
      msg = handleTake();
      break;
    case "i":
    case "inv":
    case "inventory":
      msg = handleInventory();
      break;
    case "track":
    case "mon":
    case "monitor":
      if (mutableState.playerTurnCount - lastMonitorTurn >= 3) {
        msg = handleMonitor(npcs, curLocation, noun);
        lastMonitorTurn = mutableState.playerTurnCount;
      } else {
        msg = "<p>The satellites are overheated, try again later.</p>";
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

export function itemIsInArea(noun) {
  const objs = getAttributeOfArea("objects");
  if (!isArray(objs)) return [false, -1];
  const objects = arrayToLowerCase(objs.map(o => o.name));
  const index = objects.findIndex(item => item === noun);
  return [index !== -1, index];
}

function handleEndGame() {
  showEndGame = globe.length <= getVisitedCountries().length;
}

// Initialization
visited = getVisitedCountries();
visited = cleanPassport();
localStorage.setItem("visited", JSON.stringify(visited));

if (storageAvailable("localStorage")) {
  applySavedFontSize();
  initListeners();
  updatePassport();
  render();
} else {
  document.write(
    "My game uses localStorage to save your state between sessions, and frankly it's so tightly coupled that the game won't work without it. I don't track or save any of your data, so, if you can, please consider turning on localStorage to play my game.",
  );
}

export { handleSubmit };
