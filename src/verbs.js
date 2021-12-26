import { arrayToLowerCase } from "./utilities.js";
import { getAttributeOfArea } from "./app.js";

export const go = (noun) => {
  let message;
  if (arrayToLowerCase(getAttributeOfArea("neighbors")).includes(noun)) {
    curLocation = noun;
  } else {
    message = `<p>You can't get to ${noun} from here!</p>`;
  }
  return message;
};

export const help = () => {
  return "help";
};

export const teleport = () => {
  return "teleport";
};

// if (
//   verb === "go" &&
//   arrayToLowerCase(getAttributeOfArea("neighbors")).includes(noun)
// ) {
// } else if (verb === "go") {

// } else if (verb === "help") {
//   msg = `
//     <h3>HELP</h3>
//     <p>Type "go" and then the name of a nearby country to travel there.</p>
//     <p>Or click on a country's name in the list to make me type it for you.</p>
//   `;
// } else {
//   msg = `<p>I don't recognize the verb "${verb}".</p>`;
// }
