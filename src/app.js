import { globe } from "./globe.js";

console.clear();

const arrayToLowercase = (arr) => arr.map((i) => i.toLowerCase());

let location = "United States";

const getAttributeOfArea = (attrib, area = location) => {
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
      return result + `${cur} is here. `;
    }, "");
  } else {
    listOfObjects = `Nothing of importance is here.`;
  }
  return `<p>${listOfObjects}</p>`;
};

const render = (val = null, msg = null, area = location) => {
  setTimeout(() => {
    document.getElementById("display").innerHTML += getDisplay(val, msg);
    document.querySelector("#console").scrollIntoView(true);
    document.querySelectorAll("button").forEach((i) => {
      i.addEventListener("click", (e) => {
        const dest = e.target.dataset.destination.toLowerCase();
        document.querySelector("#prompt").value = `go ${dest}`;
      });
    });
  }, 500);
};

const handleSubmit = (val, msg = "") => {
  let verb = val.split(" ")[0];
  let noun = val.substring(3);
  if (
    verb === "go" &&
    arrayToLowercase(getAttributeOfArea("neighbors")).includes(noun)
  ) {
    location = noun;
  } else if (verb === "go") {
    msg = `<p>You can't get to ${noun} from here!</p>`;
  } else if (verb === "help") {
    msg = `
      <h3>HELP</h3>
      <p>Type "go" and then the name of a nearby country to travel there.</p>
      <p>Or click on a country's name in the list to make me type it for you.</p>
    `;
  } else {
    msg = `<p>I don't recognize the verb "${verb}".</p>`;
  }
  render(val, msg);
};

const getDisplay = (val, msg, area) => {
  let display = `
    ${val != null ? `<p><span class="caret"></span>${val}</p>` : ``}
    ${msg != null ? `<p>${msg}</p>` : ``}
    <p>You are in <span>${location}</span>. ${getObjectsText()}</p>
    <p>Exits are: ${getNeighborsText()}
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
