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

console.clear();

const logoEl = document.querySelector("#logo");
const consoleEl = document.querySelector("#console");
const submitBtn = document.getElementById("submit");
export const promptField = document.getElementById("prompt");
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
let justLaunched = true;
let showEndGame = false;
let endGameAlreadyShown = false;

function applySavedFontSize() {
  const savedSize = localStorage.getItem("fontSize");
  if (savedSize) {
    document.documentElement.style.setProperty("--font-size-base", `${savedSize}rem`);
  }
}

applySavedFontSize();

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

function getNeighborsText() {
  const neighbors = getAttributeOfArea("neighbors") || [];
  return neighbors.reduce((html, neighbor) => {
    return (
      html +
      `<li><button class="destination" data-destination="${neighbor}">${neighbor}</button></li>`
    );
  }, "");
}

function getObjectsText() {
  const objects = getAttributeOfArea("objects");
  if (!isArray(objects)) return "";
  return objects.reduce((text, obj) => {
    return (
      text +
      `${obj.article} <span class="button object" data-object="${obj.name}">${obj.name}</span> is here. `
    );
  }, "");
}

function getAreaDescription(area = curLocation) {
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

function handleTeleportFromURL(area) {
  if (areaExists(area)) {
    updateLocation(area);
  }
}

export function render(val = null, msg = null, area = curLocation, showLoc = false) {
  setTimeout(() => {
    const displayEl = document.getElementById("display");
    displayEl.innerHTML += getDisplay(val, msg, area, showLoc);
    if (justLaunched) {
      logoEl.scrollIntoView(true);
      justLaunched = false;
    } else {
      consoleEl.scrollIntoView(true);
    }
  }, 500);
}

function getDisplay(val, msg, area, showLoc) {
  const prompt = `<p class="prompt"><span class="caret"></span>${val}</p>`;
  const message = `<p>${msg}</p>`;
  const clSlug = sluggify(curLocation);
  const uiBgClass = getAttributeOfArea("image") ? `pic ${clSlug}` : "";
  const uiAttrib = getAttributeOfArea("attribution") || "";
  let exitsText = "";
  if (getNeighborsText().length > 0) {
    exitsText = `<div class="exits"><h5>Exits are:</h5><ul class="asterisk buttons">${getNeighborsText()}</ul></div>`;
  }
  // Gather NPCs in the current location to add a line about them
  let npcHereLines = [];
  npcs.forEach(npc => {
    if (curLocation.toLowerCase() === npc.location.toLowerCase()) {
      npcHereLines.push(`${npc.name} is here too!`);
    }
  });
  const npcLineHtml = npcHereLines.length > 0 ? `${npcHereLines.join(" ")}` : "";
  const loc = `
    <div class="area-wrapper">
      <div class="${uiBgClass}">
        <div class="attribution">${uiAttrib}</div>
      </div>
      <h4>${curLocation.toUpperCase()}</h4>
      <p>${getAreaDescription()}</p>
      <p>${getObjectsText()}</p>
      <p>${exitsText}</p>
      <p>${npcLineHtml}</p>
    </div>
  `;
  return `
    ${val ? prompt : ""}
    ${msg ? message : loc}
    ${showLoc ? loc : ""}
    ${showEndGame && !endGameAlreadyShown ? endGameMsg : ""}
  `;
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

export const focusOnPrompt = () => {
  promptField.focus();
};

function handleEndGame() {
  showEndGame = globe.length <= getVisitedCountries().length;
  if (showEndGame) endGameAlreadyShown = false; // reset to show end game message again
}

function initListeners() {
  ["load", "hashchange"].forEach(eventName =>
    window.addEventListener(
      eventName,
      () => {
        const area = dehashify(document.location.hash);
        if (area && area.length !== 0) {
          handleTeleportFromURL(area);
        }
        if (eventName === "hashchange") {
          render("", " ", curLocation, true);
        }
      },
      false,
    ),
  );

  window.addEventListener("load", () => {
    setTimeout(() => {
      document.querySelector(".hiddenBeforeLoad")?.classList.remove("hiddenBeforeLoad");
    }, 500);
  });

  promptField.addEventListener("keydown", e => {
    switch (e.key) {
      case "Enter":
        handleSubmit(promptField.value);
        break;
      case "Tab":
        e.preventDefault();
        handleTab(e);
        focusOnPrompt();
        break;
      case "Escape":
        promptField.value = "";
        clearInterval(mutableState.walkInterval);
        mutableState.walkInterval = null;
        break;
    }
  });

  promptField.addEventListener("keyup", () => {
    if (promptField.value.length > 0) {
      submitBtn.classList.add("shown");
    } else {
      submitBtn.classList.remove("shown");
    }
  });

  submitBtn.addEventListener("click", () => {
    handleSubmit(promptField.value);
  });

  document.querySelector("html").addEventListener("click", () => {
    focusOnPrompt();
  });

  // Setup event delegation for the main display area
  const displayEl = document.getElementById("display");
  displayEl.addEventListener("click", e => {
    const target = e.target;
    let command, value;

    // Check if a destination button was clicked
    if (target.classList.contains("destination")) {
      command = "go";
      value = target.dataset.destination;
    }
    // Check if an object button was clicked
    else if (target.classList.contains("object")) {
      command = "look";
      value = target.dataset.object;
    }

    // If a relevant button was clicked, populate the prompt
    if (command && value) {
      promptField.value = `${command} ${value.toLowerCase()}`;
      submitBtn.classList.add("shown");
      focusOnPrompt();
    }
  });

  // Handle double-clicks to populate and submit immediately
  displayEl.addEventListener("dblclick", e => {
    const target = e.target;
    let command, value;

    if (target.classList.contains("destination")) {
      command = "go";
      value = target.dataset.destination;
    } else if (target.classList.contains("object")) {
      command = "look";
      value = target.dataset.object;
    }

    if (command && value) {
      const fullCommand = `${command} ${value.toLowerCase()}`;
      promptField.value = fullCommand;
      handleSubmit(fullCommand);
    }
  });
}

// Function for NPC to take a random walk step

function handleTab(e) {
  const commands = [
    "go",
    "walk",
    "look",
    "ex",
    "exits",
    "examine",
    "tel",
    "teleport",
    "forget",
    "inv",
    "mon",
    "monitor",
    "track",
    "track",
    "help",
    "stats",
    "passport",
    "randomwalk",
    "text",
    "win",
  ];
  let val = e.target.value.toLowerCase().replace(/\s+/g, " ").trim();
  const words = val.split(" ");
  const verb = words[0];
  const noun = words.slice(1).join(" ");
  let dest = curLocation;
  const neighbors = getAttributeOfArea("neighbors") || [];

  switch (verb) {
    case "go":
    case "walk":
      dest = getFirstMatchedOption(noun, neighbors);
      e.target.value = `go ${dest.toLowerCase()}`;
      break;
    case "tel":
    case "teleport":
      dest = getFirstMatchedOption(noun, allAreas);
      e.target.value = `tel ${dest.toLowerCase()}`;
      break;
    case "look":
    case "examine":
    case "ex":
    case "exits":
      {
        let obj = "";
        if (isArray(getAttributeOfArea("objects"))) {
          const objects = getAttributeOfArea("objects").map(o => o.name);
          obj = getFirstMatchedOption(noun, objects).toLowerCase();
        }
        e.target.value = `look ${obj}`;
      }
      break;
    default:
      e.target.value = getFirstMatchedOption(verb, commands);
      break;
  }
}

function getFirstMatchedOption(word, options) {
  if (!word) return "";
  let placeholder = word.toLowerCase() === "look" ? "" : word;
  const matches = options.filter(
    option => option.toLowerCase().indexOf(word.toLowerCase()) !== -1,
  );
  if (isArray(matches) && matches.length > 0) {
    return matches.reduce((result, cur) => {
      return cur.toLowerCase().indexOf(word.toLowerCase()) <
        result.toLowerCase().indexOf(word.toLowerCase())
        ? cur
        : result;
    });
  }
  return placeholder;
}

// Initialization
visited = getVisitedCountries();
visited = cleanPassport();
localStorage.setItem("visited", JSON.stringify(visited));

if (storageAvailable("localStorage")) {
  initListeners();
  updatePassport();
  render();
} else {
  document.write(
    "My game uses localStorage to save your state between sessions, and frankly it's so tightly coupled that the game won't work without it. I don't track or save any of your data, so, if you can, please consider turning on localStorage to play my game.",
  );
}

export { submitBtn, handleSubmit };
