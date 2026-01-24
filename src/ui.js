import { handleSubmit } from "./app.js";
import {
  curLocation,
  npcs,
  showEndGame,
  mutableState,
  allAreas,
  getAttributeOfArea,
  areaExists,
  updateLocation,
  getAreaDescription,
} from "./state.js";
import { sluggify, dehashify, isArray } from "./utilities.js";
import { endGameMsg } from "./endgame.js";
import { inventory } from "./inventory.js";

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
    promptField.value = "";
  }, 0);
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
      npcHereLines.push(
        `<span class="button npc" data-npc="${npc.name}">${npc.name}</span> is here!`,
      );
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
  let endGameHtml = "";
  if (showEndGame) {
    endGameHtml = endGameMsg;
  }
  return `
    ${val ? prompt : ""}
    ${msg ? message : loc}
    ${showLoc ? loc : ""}
    ${endGameHtml}
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
    "inventory",
    "passport",
    "notebook",
    "write",
    "mon",
    "monitor",
    "track",
    "help",
    "stats",
    "randomwalk",
    "text",
    "win",
    "despawn",
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
        let lookTargets = [];
        if (isArray(getAttributeOfArea("objects"))) {
          const objects = getAttributeOfArea("objects").map(o => o.name);
          lookTargets = lookTargets.concat(objects);
        }
        const localNpcs = npcs
          .filter(npc => npc.location.toLowerCase() === curLocation.toLowerCase())
          .map(npc => npc.name);

        lookTargets = lookTargets.concat(localNpcs);

        const inventoryItems = inventory.map(item => item.name);
        lookTargets = lookTargets.concat(inventoryItems);

        const target = getFirstMatchedOption(noun, lookTargets).toLowerCase();
        e.target.value = `look ${target}`;
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

/**
 * Handles the 'text' command to adjust the game's font size.
 * @param {string} noun The size parameter (e.g., 'small', '1.5').
 * @returns {string} A message to display to the user.
 */
export function handleText(noun) {
  const root = document.documentElement;
  let newSize;
  const sizeMap = { small: 1.4, medium: 1.8, large: 2.1 };
  const parsedNoun = parseFloat(noun);

  if (sizeMap[noun]) {
    newSize = sizeMap[noun];
  } else if (noun === "default") {
    newSize = 1.6;
  } else if (!isNaN(parsedNoun) && parsedNoun >= 1 && parsedNoun <= 3) {
    newSize = parsedNoun;
  } else {
    return 'Invalid command. Use "text small", "medium", "large", "default", or a number between 1.0 and 3.0.';
  }
  root.style.setProperty("--font-size-base", `${newSize}rem`);
  localStorage.setItem("fontSize", newSize);
  return `Text size set to ${newSize.toFixed(1)}rem.`;
}

/**
 * Handles unknown verbs.
 * @param {string} verb The unknown verb.
 * @returns {string} A message to display to the user.
 */
export function handleUnknownVerb(verb) {
  return `<p>I don't recognize the verb "${verb}".</p>`;
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

  document.addEventListener("click", () => {
    // If the user isn't selecting text, focus the prompt.
    if (window.getSelection().toString().length === 0) {
      focusOnPrompt();
    }
  });

  // Setup event delegation for the main display area
  const displayEl = document.getElementById("display");
  displayEl.addEventListener("click", e => {
    const target = e.target;
    let command, value;

    if (target.classList.contains("destination")) {
      command = "go";
      value = target.dataset.destination;
    } else if (
      target.classList.contains("object") ||
      target.classList.contains("inventory-object")
    ) {
      command = "look";
      value = target.dataset.object;
    } else if (target.classList.contains("npc")) {
      command = "look";
      value = target.dataset.npc;
    } else if (target.classList.contains("item")) {
      command = "look";
      value = target.dataset.item;
    }

    if (command && value) {
      const fullCommand = `${command} ${value.toLowerCase()}`;
      handleSubmit(fullCommand);
    }
  });
}
