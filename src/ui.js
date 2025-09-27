import {
  curLocation,
  npcs,
  showEndGame,
  endGameAlreadyShown,
  mutableState,
  allAreas,
  getAttributeOfArea,
  areaExists,
  updateLocation,
  handleSubmit,
} from "./app.js";
import { sluggify, dehashify, isArray } from "./utilities.js";
import { endGameMsg } from "./endgame.js";
import { getAreaDescription } from "./app.js";

// DOM Elements
export const logoEl = document.querySelector("#logo");
export const consoleEl = document.querySelector("#console");
export const submitBtn = document.getElementById("submit");
export const promptField = document.getElementById("prompt");

// UI State
let justLaunched = true;

// Functions
export function applySavedFontSize() {
  const savedSize = localStorage.getItem("fontSize");
  if (savedSize) {
    document.documentElement.style.setProperty("--font-size-base", `${savedSize}rem`);
  }
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

export const focusOnPrompt = () => {
  promptField.focus();
};

function handleTeleportFromURL(area) {
  if (areaExists(area)) {
    updateLocation(area);
  }
}

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

export function initListeners() {
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

    if (target.classList.contains("destination")) {
      command = "go";
      value = target.dataset.destination;
    } else if (target.classList.contains("object")) {
      command = "look";
      value = target.dataset.object;
    }

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
