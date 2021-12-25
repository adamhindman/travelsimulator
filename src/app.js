console.clear();

import { globe } from "./globe.js";

const arrayToLowercase = (arr) => arr.map((i) => i.toLowerCase());

let currentLocation = "United States";

let getCurrentNeighbors = () => {
  const current = globe.filter((i) => {
    return i.area.toLowerCase() == currentLocation.toLowerCase();
  });
  return current[0].neighbors;
};

const getCurrentNeighborsList = () => {
  let list = "";
  list = getCurrentNeighbors().reduce((result, cur, i) => {
    return result + `<button data-destination="${cur}">${cur}</button>`;
  }, "");
  return `<p>${list}</p>`;
};

const render = (val = null, msg = null, area = currentLocation) => {
  const t = setTimeout(() => {
    displayElement = document.getElementById("display");
    displayElement.innerHTML += getDisplay(val, msg);
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
  verb = val.split(" ")[0];
  noun = val.substring(3);
  if (verb == "go" && arrayToLowercase(getCurrentNeighbors()).includes(noun)) {
    currentLocation = noun;
  } else if (verb == "go") {
    msg = `<p>You can't get to ${noun} from here!</p>`;
  } else if (verb == "help") {
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
  let display;
  display = `
    ${val != null ? `<p><span class="caret"></span>${val}</p>` : ``}
    ${msg != null ? `<p>${msg}</p>` : ``}
    <p>You are in <span>${currentLocation}</span></p>
    <p>Exits are: ${getCurrentNeighborsList()}
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
