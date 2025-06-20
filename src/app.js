import { globe } from "./globe.js";
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

console.clear();

const logoEl = document.querySelector("#logo");
const consoleEl = document.querySelector("#console");
const submitBtn = document.getElementById("submit");
const promptField = document.getElementById("prompt");
const allAreas = globe.map(area => area.area);
const defaultArea = "United States";

let curLocation = localStorage.getItem("lastLocation") || "utopia";
let visited = [];
let walkInterval = null;
let justLaunched = true;
let showEndGame = false;
let endGameAlreadyShown = false;

function areaExists(areaName) {
  return globe.some(c => c.area.toLowerCase().trim() === areaName.toLowerCase().trim());
}

function cleanPassport() {
  return visited.filter(item => areaExists(item));
}

function getVisitedCountries() {
  const defaultVisited = ["united states"];
  const lsVisited = JSON.parse(localStorage.getItem("visited"));
  return isArray(lsVisited) && lsVisited.length > 0 ? lsVisited : defaultVisited;
}

function getAttributeOfArea(attrib, area = curLocation) {
  const validArea = areaExists(area) ? area : defaultArea;
  const areaObj = globe.find(i => i.area.toLowerCase() === validArea.toLowerCase());
  return areaObj ? areaObj[attrib] : null;
}

function getNeighborsText() {
  const neighbors = getAttributeOfArea("neighbors") || [];
  return neighbors.reduce((html, neighbor) => {
    return html + `<li><button class="destination" data-destination="${neighbor}">${neighbor}</button></li>`;
  }, "");
}

function getObjectsText() {
  const objects = getAttributeOfArea("objects");
  if (!isArray(objects)) return "";
  return objects.reduce((text, obj) => {
    return text + `${obj.article} <span class="button object" data-object="${obj.name}">${obj.name}</span> is here. `;
  }, "");
}

function getAreaDescription(area = curLocation) {
  return getAttributeOfArea("description", area) || "";
}

function updateURLHash(destination) {
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

function updateLocation(destination) {
  curLocation = destination;
  localStorage.setItem("lastLocation", destination);
  updatePassport(destination);
  const nextTotalMoves = (Number(localStorage.getItem("totalMoves")) || 0) + 1;
  localStorage.setItem("totalMoves", nextTotalMoves);
  if (document.location.hash !== hashify(destination)) {
    updateURLHash(destination);
  }
}

function handleTeleportFromURL(area) {
  if (areaExists(area)) {
    updateLocation(area);
  }
}

function render(val = null, msg = null, area = curLocation, showLoc = false) {
  setTimeout(() => {
    const displayEl = document.getElementById("display");
    displayEl.innerHTML += getDisplay(val, msg, area, showLoc);
    if (justLaunched) {
      logoEl.scrollIntoView(true);
      justLaunched = false;
    } else {
      consoleEl.scrollIntoView(true);
    }
    setupInteractiveButtons();
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
  const loc = `
    <div class="area-wrapper">
      <div class="${uiBgClass}">
        <div class="attribution">${uiAttrib}</div>
      </div>
      <h4>${curLocation.toUpperCase()}</h4>
      <p>${getAreaDescription()}</p>
      <p>${getObjectsText()}</p>
      <p>${exitsText}</p>
    </div>
  `;
  return `
    ${val ? prompt : ""}
    ${msg ? message : loc}
    ${showLoc ? loc : ""}
    ${showEndGame && !endGameAlreadyShown ? endGameMsg : ""}
  `;
}

function setupInteractiveButtons() {
  document.querySelectorAll(".destination").forEach(button => {
    if (button.dataset.eventSet !== "true") {
      button.dataset.eventSet = "true";
      button.addEventListener("click", e => {
        const dest = e.target.dataset.destination.toLowerCase();
        promptField.value = `go ${dest}`;
        submitBtn.classList.add("shown");
        focusOnPrompt();
      });
    }
  });
  document.querySelectorAll(".object").forEach(button => {
    if (button.dataset.eventSet !== "true") {
      button.dataset.eventSet = "true";
      button.addEventListener("click", e => {
        const obj = e.target.dataset.object.toLowerCase();
        promptField.value = `look ${obj}`;
        submitBtn.classList.add("shown");
        focusOnPrompt();
      });
    }
  });
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
      msg = handleGo(noun, neighbors);
      break;
    case "tel":
    case "teleport":
      msg = handleTel(noun);
      break;
    case "look":
    case "examine":
    case "ex":
    case "exits":
      msg = handleLook(noun, words, showLoc);
      break;
    case "randomwalk":
      {
        let loops = 100;
        if (noun !== verb && isInt(noun)) {
          loops = Number(noun);
        }
        msg = `You take a walk around the globe.<p>This process will end automatically after ${loops} steps.</p><p>Press [ESCAPE] to stop sooner than that.</p>`;
        handleRandomWalk(loops);
      }
      break;
    case "help":
      msg = helpText;
      break;
    case "stats":
      {
        const totalWords = catAllDescriptions(globe).split(" ").length + catAllObjects(globe).split(" ").length;
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
      msg = handleForget();
      break;
    case "passport":
      msg = handleCheckPassport();
      break;
    case "take":
      msg = handleTake();
      break;
    case "i":
    case "inv":
    case "inventory":
      msg = handleInventory();
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

function handleGo(noun, neighbors) {
  if (neighbors.includes(noun)) {
    updateLocation(noun);
    return "";
  } else {
    return `<p>You can't get to ${noun} from here!</p>`;
  }
}

function handleLook(noun, words, showLoc) {
  const [inArea, oIndex] = itemIsInArea(noun);
  const [inInv, invItems] = itemIsInInventory(noun);
  if (words.length === 1 || noun.toLowerCase() === "around") {
    showLoc = true;
    return "";
  }
  if (inArea) {
    const descriptions = getAttributeOfArea("objects").map(obj => obj.description);
    return `<span class="object-description">${descriptions[oIndex]}</span>`;
  }
  if (inInv) {
    return `<p>${invItems[0].description}</p>`;
  }
  return `<p>I don't see that here!</p>`;
}

function handleTel(noun) {
  if (areaExists(noun)) {
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
  if (walkInterval !== null) return;

  let loops = 0;
  walkInterval = setInterval(() => {
    const neighbors = arrayToLowerCase(getAttributeOfArea("neighbors") || []);
    if (neighbors.length === 0) {
      clearInterval(walkInterval);
      walkInterval = null;
      return;
    }
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    updateLocation(randomNeighbor);
    render("", " ", curLocation, false);
    loops++;
    promptField.value = `${loops} / ${steps} (${randomNeighbor})`;
    if (loops >= steps) {
      clearInterval(walkInterval);
      walkInterval = null;
      promptField.value = "";
      render("", `<p>Done! Ended normally after ${steps} trips.</p><p>Use LOOK to see where you ended up.</p>`, curLocation, false);
    }
  }, 50);
}

function itemIsInArea(noun) {
  const objs = getAttributeOfArea("objects");
  if (!isArray(objs)) return [false, -1];
  const objects = arrayToLowerCase(objs.map(o => o.name));
  const index = objects.findIndex(item => item === noun);
  return [index !== -1, index];
}

const focusOnPrompt = () => {
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
        clearInterval(walkInterval);
        walkInterval = null;
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
    "help",
    "stats",
    "passport",
    "randomwalk",
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
      return cur.toLowerCase().indexOf(word.toLowerCase()) < result.toLowerCase().indexOf(word.toLowerCase())
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

export {
  submitBtn,
  promptField,
  allAreas,
  defaultArea,
  areaExists,
  handleSubmit,
  focusOnPrompt,
};