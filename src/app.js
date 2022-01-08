import { globe } from "./globe.js";
import { capitalize, arrayToLowerCase, isArray } from "./utilities.js";
import { helpText } from "./helpText.js";
import { getCookie, setCookie } from "./cookies.js";

console.clear();
// setCookie("lastLocation", "united states");

let curLocation = getCookie("lastLocation") ? getCookie("lastLocation") : "United States";

const submitBtn = document.getElementById("submit");
const promptField = document.getElementById("prompt");

export const areaExists = areaName => {
  let exists = globe.filter(c => {
    return c.area.toLowerCase().trim() === areaName.toLowerCase().trim();
  });
  return isArray(exists);
};

export const getAttributeOfArea = (attrib, area = curLocation) => {
  let items = globe.filter(i => i.area.toLowerCase() === area.toLowerCase())[0][attrib];
  return items;
};

const getNeighborsText = () => {
  let list = getAttributeOfArea("neighbors").reduce((result, cur, i, a) => {
    return (
      result +
      `<button class="button destination" data-destination="${cur}">${cur}</button>`
    );
  }, "");
  return list;
};

const getObjectsText = () => {
  let objects = getAttributeOfArea("objects");
  let listOfObjects = "";
  if (isArray(objects)) {
    listOfObjects = objects.reduce((result, cur, i) => {
      return (
        result +
        `${cur.article} <span class="button object" data-object="${cur.name}">${cur.name}</span> is here. `
      );
    }, "");
  } else {
    listOfObjects = `Nothing of importance is here.`;
  }
  return listOfObjects;
};

const getAreaDescription = (area = curLocation) => {
  let desc = getAttributeOfArea("description");
  return desc ? desc : "";
};

const render = (val = null, msg = null, area = curLocation, showLoc = false) => {
  setTimeout(() => {
    document.getElementById("display").innerHTML += getDisplay(val, msg, area, showLoc);
    document.querySelector("#console").scrollIntoView(true);
    document.querySelectorAll(".button.destination").forEach(i => {
      if (i.dataset.eventSet !== true) {
        i.dataset.eventSet = true;
        i.addEventListener("click", e => {
          const dest = e.target.dataset.destination.toLowerCase();
          document.querySelector("#prompt").value = `go ${dest}`;
          submitBtn.classList.add("shown");
        });
      }
    });
    document.querySelectorAll(".button.object").forEach(i => {
      if (i.dataset.eventSet !== true) {
        i.dataset.eventSet = true;
        i.addEventListener("click", e => {
          const obj = e.target.dataset.object.toLowerCase();
          document.querySelector("#prompt").value = `look ${obj}`;
          submitBtn.classList.add("shown");
        });
      }
    });
  }, 500);
};

const handleSubmit = (val, msg = "") => {
  val = val.toLowerCase().replace(/\s+/g, " ").trim();
  const words = val.split(" ");
  const verb = words[0];
  const noun = words.slice(-(words.length - 1)).join(" ");
  const neighbors = arrayToLowerCase(getAttributeOfArea("neighbors"));
  let area = curLocation;
  let showLoc = false;
  switch (verb) {
    case "go":
      if (neighbors.includes(noun)) {
        curLocation = noun;
        setCookie("lastLocation", curLocation);
      } else {
        msg = `<p>You can't get to ${noun} from here!</p>`;
      }
      break;
    case "look":
      if (words.length === 1) {
        showLoc = true;
      } else if (isArray(getAttributeOfArea("objects"))) {
        const objects = arrayToLowerCase(
          getAttributeOfArea("objects").map(object => object.name)
        );
        const objectDescriptions = getAttributeOfArea("objects").map(
          object => object.description
        );
        const objectIndex = objects.findIndex(item => item == noun);
        if (objectIndex !== -1) {
          msg = `<p>${objectDescriptions[objectIndex]}</p>`;
        } else {
          msg = `<p>I don't see that here!</p>`;
        }
      } else {
        msg = `<p>I don't see that here!</p>`;
      }
      break;
    case "tel":
      if (areaExists(noun)) {
        curLocation = noun;
        setCookie("lastLocation", curLocation);
      } else {
        msg = `<p>You can't teleport there; it doesn't exist!</p>`;
      }
      break;
    case "help":
      msg = helpText;
      break;
    case "forget":
      setCookie("lastLocation", curLocation, 0);
      msg = `You enter a fugue state and wander back home.`;
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      break;
    case "":
      break;
    default:
      msg = `<p>I don't recognize the verb "${verb}".</p>`;
      break;
  }
  render(val, msg, area, showLoc);
};

const getDisplay = (val, msg, area, showLoc) => {
  const p = `<p class="prompt"><span class="caret"></span>${val}</p>`;
  const m = `<p>${msg}</p>`;
  const clSlug = curLocation.toLowerCase().split(" ").join("-");
  const loc = `
  <div class="pic ${clSlug}"></div><h4>${curLocation.toUpperCase()}</h4>${getAreaDescription()}</p>${getObjectsText()}
  <div class="exits"><h5>Exits are:</h5>${getNeighborsText()}</div>`;
  let display = `
    ${val ? p : ``}
    ${msg ? m : loc}
    ${showLoc ? loc : ``}
  `;
  return display;
};

promptField.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    handleSubmit(e.target.value);
    promptField.value = "";
    submitBtn.classList.remove("shown");
  }
});

promptField.addEventListener("keyup", e => {
  if (promptField.value.length > 0) {
    submitBtn.classList.add("shown");
  } else {
    submitBtn.classList.remove("shown");
  }
});

submitBtn.addEventListener("click", e => {
  handleSubmit(promptField.value);
  promptField.value = "";
  submitBtn.classList.remove("shown");
});

document.querySelector("html").addEventListener("click", e => {
  document.getElementById("prompt").focus();
});

render();
