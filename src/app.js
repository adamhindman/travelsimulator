import { globe } from "./globe.js";
import { capitalize, arrayToLowerCase, isArray } from "./utilities.js";
import { helpText } from "./helpText.js";

console.clear();
let curLocation = "United States";

export const getAttributeOfArea = (attrib, area = curLocation) => {
  let items = globe.filter(i => i.area.toLowerCase() === area.toLowerCase())[0][attrib];
  return items;
};

const getNeighborsText = () => {
  let list = getAttributeOfArea("neighbors").reduce((result, cur, i) => {
    return result + `<button data-destination="${cur}">${cur}</button>`;
  }, "");
  return list;
};

const getObjectsText = () => {
  let objects = getAttributeOfArea("objects");
  let listOfObjects = "";
  if (isArray(objects)) {
    listOfObjects = objects.reduce((result, cur, i) => {
      return result + `${cur.article} ${cur.name} is here. `;
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

const render = (val = null, msg = null, area, showLoc) => {
  setTimeout(() => {
    document.getElementById("display").innerHTML += getDisplay(val, msg, area, showLoc);
    document.querySelector("#console").scrollIntoView(true);
    document.querySelectorAll("button").forEach(i => {
      // todo figure out how to prevent adding too many listeners
      i.addEventListener("click", e => {
        const dest = e.target.dataset.destination.toLowerCase();
        document.querySelector("#prompt").value = `go ${dest}`;
      });
    });
  }, 500);
};

const handleSubmit = (val, msg = "") => {
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
      } else {
        msg = `<p>You can't get to ${noun} from here!</p>`;
      }
      break;
    case "teleport":
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
      msg = `<p>You have a series of adventures and end up in ${capitalize(noun)}.</p>`;
      // showLoc = true;
      curLocation = noun;
      break;
    case "help":
      msg = helpText;
      break;
    default:
      msg = `<p>I don't recognize the verb "${verb}".</p>`;
      break;
  }
  render(val, msg, area, showLoc);
};

const getDisplay = (val, msg, area, showLoc) => {
  let p = `<p class="prompt"><span class="caret"></span>${val}</p>`;
  let m = `<p>${msg}</p>`;
  let l = `
  <h4>${curLocation.toUpperCase()}</h4>${getAreaDescription()}</p>${getObjectsText()}
  <div class="exits"><h5>Exits are:</h5>${getNeighborsText()}</div>`;
  let display = `
    ${val ? p : ``}
    ${msg ? m : l}
    ${showLoc ? l : ``}
  `;
  return display;
};

document.getElementById("prompt").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    handleSubmit(e.target.value.toLowerCase());
    e.target.value = "";
  }
});

document.querySelector("html").addEventListener("click", e => {
  document.getElementById("prompt").focus();
});

render();
