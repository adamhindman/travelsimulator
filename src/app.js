import { globe } from "./globe.js";
import { capitalize, arrayToLowerCase } from "./utilities.js";
import { helpText } from "./helpText.js";

console.clear();

let curLocation = "United States";

export const getAttributeOfArea = (attrib, area = curLocation) => {
  let items = globe.filter(
    (i) => i.area.toLowerCase() === area.toLowerCase()
  )[0][attrib];
  return items;
};

const getNeighborsText = () => {
  let list = getAttributeOfArea("neighbors").reduce((result, cur, i) => {
    return result + `<button data-destination="${cur}">${cur}</button>`;
  }, "");
  return `<p>${list}</p>`;
};

const getObjectsText = () => {
  let objects = getAttributeOfArea("objects");
  let listOfObjects = "";
  if (typeof objects !== "undefined") {
    listOfObjects = objects.reduce((result, cur, i) => {
      return result + `${cur.name} is here. `;
    }, "");
  } else {
    listOfObjects = `Nothing of importance is here.`;
  }
  return `<p>${listOfObjects}</p>`;
};

const render = (val = null, msg = null, area, showLoc) => {
  setTimeout(() => {
    document.getElementById("display").innerHTML += getDisplay(
      val,
      msg,
      area,
      showLoc
    );
    document.querySelector("#console").scrollIntoView(true);
    document.querySelectorAll("button").forEach((i) => {
      // todo figure out how to prevent adding too many listeners
      i.addEventListener("click", (e) => {
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
      const objects = arrayToLowerCase(
        getAttributeOfArea("objects").map((object) => object.name)
      );
      const objectDescriptions = getAttributeOfArea("objects").map(
        (object) => object.description
      );
      const objectIndex = objects.findIndex((item) => item == noun);
      if (objectIndex !== -1) {
        msg = `<p>${objectDescriptions[objectIndex]}</p>`;
      } else if (words.length === 1) {
        msg = `<p>You take a gander...</p>`;
        showLoc = true;
      } else {
        msg = `<p>I don't see that here!</p>`;
      }
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
  <p>You are in <span>${capitalize(curLocation)}</span>. ${getObjectsText()}</p>
  <p>Exits are: ${getNeighborsText()}`;
  let display = `
    ${val ? p : ``}
    ${msg ? m : l}
    ${showLoc ? l : ``}
  `;
  return display;
};

document.getElementById("prompt").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSubmit(e.target.value.toLowerCase());
    e.target.value = "";
  }
});

document.querySelector("html").addEventListener("click", (e) => {
  document.getElementById("prompt").focus();
});

render();
