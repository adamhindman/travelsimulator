import { globe } from "./globe.js";
import { endGameMsg } from "./endgame.js";
import { allCountries } from "./allCountries.js";
import { capitalize, arrayToLowerCase, isArray, inArray, roughSizeOfObject, catAllObjects, catAllDescriptions, getCountriesWithoutObjects, isInt, sluggify, hashify, dehashify, storageAvailable, getLastArea, getLastObject} from "./utilities.js";
import { helpText } from "./helpText.js";
import { inventory, handleInventory, handleTake, itemIsInInventory } from "./inventory.js"

console.clear();

let msg = '';
let walk = null;
let justLaunched = true;
const logoEl = document.querySelector("#logo")
const consoleEl = document.querySelector("#console")
let lastAreaEl = getLastArea()
let lastObjectEl = getLastObject()
let scrollTarget = logoEl;

export const submitBtn = document.getElementById("submit");
export const promptField = document.getElementById("prompt");
export const allAreas = globe.map(area => area.area);
export const defaultArea = "United States"

export const areaExists = areaName => {
  let exists = globe.filter(c => {
    return c.area.toLowerCase().trim() === areaName.toLowerCase().trim();
  }).length > 0;
  return exists;
};

// uh oh
// everything breaks if localstorage is turned off
// should check to see if localstorage exists and tell people without it to pound sand
let curLocation = localStorage.getItem("lastLocation") || "united states";

const cleanPassport = () => {
  return visited.filter( item => areaExists(item) );
}

const getVisitedCountries = () => {
  let visited = ["united states"]
  let lsVisited = JSON.parse(localStorage.getItem("visited"));
  visited = (isArray(lsVisited) && lsVisited.length > 0) ? lsVisited : visited
  return visited
}

let visited = getVisitedCountries();
visited = cleanPassport();
localStorage.setItem("visited", JSON.stringify(cleanPassport()));    

export const getAttributeOfArea = (attrib, area = curLocation) => {
  area = areaExists(area) ? area : defaultArea  
  let items = globe.filter(i => i.area.toLowerCase() === area.toLowerCase())[0][attrib];
  return items;
};

const getNeighborsText = () => {
  let list = getAttributeOfArea("neighbors").reduce((result, cur, i, a) => {
    return (
      result +
      `<li><button class="destination" data-destination="${cur}">${cur}</button></li>`
    );
  }, "");
  return list;
};

const handleTeleportFromURL = area => {
  if(areaExists(area)){
    updateLocation(area);
  }
}

const updateURLHash = destination => {
  let hash = hashify(destination)
  if(history.pushState) {
    history.pushState(null, null, hash)
  }
  else {
    location.hash = hash;
  }
}

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
    listOfObjects = ``;
  }
  return listOfObjects;
};

const getAreaDescription = (area = curLocation) => {
  let desc = getAttributeOfArea("description");
  return desc ? desc : "";
};

export const handleSubmit = (val, msg = "") => {
  val = val.toLowerCase().replace(/\s+/g, " ").trim();
  const words = val.split(" ");
  const verb = words[0];
  const noun = words.slice(-(words.length - 1)).join(" ");
  const neighbors = arrayToLowerCase(getAttributeOfArea("neighbors"));
  let area = curLocation;
  let showLoc = false;
  switch (verb) {
    case "go":
    case "walk":
      handleGo(noun, neighbors);
      break;
    case "tel":
    case "teleport": 
      handleTel(noun);
      break;      
    case "look":
    case "examine":
    case "ex":
    case "exits": 
      msg = handleLook(noun, words, showLoc);
      break;
    case "randomwalk": 
      let loops = 100
      if (noun !== verb){ // true if there is no noun
        if(isInt(loops)){ // false if noun is garbage
          loops = noun
        } else {
          loops = 100
        }
      } else {}
      msg += `You take a walk around the globe.<p>This process will end automatically after ${loops} steps.</p><p>Press [ESCAPE] to stop sooner than that.</p>`
      showLoc
      handleRandomWalk(loops);
      break;
    case "help":
      msg = helpText;
      break;
    case "stats": 
      msg = `<p>Size of the globe: ${Math.round(roughSizeOfObject(globe) / 1000)}k / ${catAllDescriptions(globe).split(" ").length + catAllObjects(globe).split(" ").length} words<br/>Countries without objects: ${getCountriesWithoutObjects(globe).length} out of ${globe.length}`
      if (getCountriesWithoutObjects(globe).length > 0) {
        msg += `<br/>First country without objects: ${getCountriesWithoutObjects(globe)[0].area}`
      };
      msg += `<br/>You've moved about ${localStorage.getItem("totalMoves") - 1} times</p>`
      break;
    case "forget":
      msg = handleForget();
      break;
    case "passport":
      msg = handleCheckPassport();
      break;
    case "take":
      handleTake();
      break;
    case "i":
    case "inv":
    case "inventory":
      msg = handleInventory();
      break;
    case "win":
      localStorage.setItem("visited", JSON.stringify(allCountries));
      handleEndGame()        
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
  const prompt = `<p class="prompt"><span class="caret"></span>${val}</p>`;
  const message = `<p>${msg}</p>`;
  const clSlug = sluggify(curLocation);
  const uiBgClass = getAttributeOfArea("image") ? `pic ${clSlug}` : ``;
  const uiAttrib = getAttributeOfArea("attribution") ? getAttributeOfArea("attribution") : ``;  
  let exitsText = ""
  if(getNeighborsText().length > 0){
    exitsText = `<div class="exits"><h5>Exits are:</h5><ul class="asterisk buttons">${getNeighborsText()}</ul></div>`
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
  let display = `
    ${val ? prompt : ``}
    ${msg ? message : loc}
    ${showLoc ? loc : ``}
    ${(showEndGame && !endGameAlreadyShown) ? endGameMsg : ``}
  `;
  if (showEndGame){
    endGameAlreadyShown = true
  }
  return display;
};

const handleCheckPassport = () => {
  let msg = '<div class="passport">You\'ve visited ';
  let visited = getVisitedCountries()
  msg += `${visited.length} out of ${globe.length} places (${Math.floor(100 * (visited.length / globe.length))}%)</p>`
  msg += allAreas.reduce( (result, current, i) => {
    if (inArray(current.toLowerCase(), visited)){
      return result + `<span class="visited">${capitalize(current)}</span>`      
    } else {
      return result + `<span class="not-visited">${capitalize(current)}</span>`      
    }
  }, "")
  return `${msg}</p></div>`  
}

const handleRandomWalk = (steps = 500) => {
  walk = null
  let loops = 0
  let maxLoops = steps
  if (!walk) {
    walk = setInterval(()=>{
      const neighbors = arrayToLowerCase(getAttributeOfArea("neighbors"));
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      updateLocation(randomNeighbor)
      render("", ' ', curLocation, false); 
      loops++
      promptField.value = `${loops} / ${maxLoops} (${randomNeighbor})`      
      if (loops >= maxLoops){
        clearInterval(walk)
        walk = null
        promptField.value = ("")
        render("", `<p>Done! Ended normally after ${maxLoops} trips`, curLocation, false); 
      }  
    },1)
  }
}

const canGo = area => true

const handleGo = (noun, neighbors) => {
  if (neighbors.includes(noun) && canGo(noun)) {
    updateLocation(noun);
  } else {
    msg = `<p>You can't get to ${noun} from here!</p>`;
  }
};

const itemIsInArea = noun => {
  let inArea = false
  let oIndex = -1
  if (isArray(getAttributeOfArea("objects"))) {
    const objects = arrayToLowerCase(
      getAttributeOfArea("objects").map(object => object.name)
    );
    oIndex = objects.findIndex(item => item == noun);
    inArea = oIndex !== -1 ? true : false
  }
  return [inArea, oIndex]
}

const handleLook = (noun, words, showLoc) => {
  let msg = ''
  const itemInArea = itemIsInArea(noun)
  const inArea = itemInArea[0]
  const oIndex = itemInArea[1]
  const itemInInv = itemIsInInventory(noun)
  const inInv = itemInInv[0]
  if (words.length === 1 || noun.toLowerCase() === "around") {
    showLoc = true;
  } else if (inArea) {
    const getObjDescs = getAttributeOfArea("objects").map(
      object => object.description
    );
    msg = `<span class="object-description">${getObjDescs[oIndex]}</span>`;
  } else if (inInv) {
    msg = `<p>${itemInInv[1][0].description}</p>`
  } else {
    msg = `<p>I don't see that here!</p>`;
  }
  return `${msg}`
};

const handleTel = noun => {
  if (areaExists(noun)) {
    updateLocation(noun)
  } else {
    msg = `<p>You can't teleport there; it doesn't exist!</p>`;
  }
};

const handleForget = () => {
  let msg = `You enter a fugue state and wander back home.`;
  setTimeout(() => {
    localStorage.clear();
    updateURLHash(defaultArea)    
    window.location.reload();
  }, 2400);
  return msg
};

export const handleTab = e => {
  const commands = ["go", "walk", "look", "ex", "exits", "examine", "tel", "teleport", "forget", "inv", "help", "stats", "passport", "randomwalk", "win"]
  let val = e.target.value.toLowerCase().replace(/\s+/g, " ").trim();
  const words = val.split(" ");
  const verb = words[0];
  const noun = words.slice(-(words.length - 1)).join(" ");
  let dest = curLocation;
  const neighbors = getAttributeOfArea("neighbors");
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
      let obj = "";
      if (isArray(getAttributeOfArea("objects"))) {
        const objects = getAttributeOfArea("objects").map(obj => obj.name));
        obj = getFirstMatchedOption(noun, objects).toLowerCase();
      }
      e.target.value = `look ${obj}`;
      break;
    default:
      e.target.value = getFirstMatchedOption(verb, commands)
      break;
  }
}

const getFirstMatchedOption = (word, options) => {
  let firstMatch
  let placeholder = ''
  if (word.toLowerCase() === 'look'){
    placeholder = ""
  }
  const matches = options.filter(option => option.toLowerCase().indexOf(word) !== -1);
  if (isArray(matches) && matches.length > 0) {
    firstMatch = matches.reduce((result, cur) => {
      return cur.toLowerCase().indexOf(word) < result.toLowerCase().indexOf(word) ? cur : result
    });
  }
  return firstMatch || placeholder
}

export const focusOnPrompt = () => {
  document.getElementById("prompt").focus();
}

// need to create a parameter called "scrolltarget" that can 
// either scroll to the console or to the top of the country
// depending on if the user did a GO or a LOOK.
//
// also need to check whether the user just loaded the page
// and if so scroll to the top of the logo.

const render = (val = null, msg = null, area = curLocation, showLoc = false) => {
  setTimeout(() => {
    document.getElementById("display").innerHTML += getDisplay(val, msg, area, showLoc);
    //   document.querySelectorAll(".area-wrapper:last-of-type")[0].scrollIntoView(true) 
    if (justLaunched) {
      logoEl.scrollIntoView(true); 
      justLaunched = false;
    } else {
      consoleEl.scrollIntoView(true); 
    }
    document.querySelectorAll(".destination").forEach(i => {
      if (i.dataset.eventSet !== true) {
        i.dataset.eventSet = true;
        i.addEventListener("click", e => {
          const dest = e.target.dataset.destination.toLowerCase();
          document.querySelector("#prompt").value = `go ${dest}`;
          submitBtn.classList.add("shown");
        });
      }
    });
    document.querySelectorAll(".object").forEach(i => {
      if (i.dataset.eventSet !== true) {
        i.dataset.eventSet = true;
        i.addEventListener("click", e => {
          const obj = e.target.dataset.object.toLowerCase();
          document.querySelector("#prompt").value = `look ${obj}`;
          submitBtn.classList.add("shown");
        });
      }
    });
    justLaunched = false;    
  }, 500);
};

const updateLocation = destination => {
  curLocation = destination;
  localStorage.setItem("lastLocation", destination);
  updatePassport(destination);
  let nextTotalMoves = 0;
  nextTotalMoves = Number(localStorage.getItem("totalMoves")) + 1 || nextTotalMoves
  localStorage.setItem("totalMoves", nextTotalMoves)
  if (document.location.hash !== hashify(destination)){
    updateURLHash(destination)
  }
}

const updatePassport = (destination = curLocation) => {
  let passport = [curLocation]
  if(localStorage.getItem("visited")){
    passport = JSON.parse(localStorage.getItem("visited"));
    if (!passport.includes(destination)) {
      passport.push(destination.toLowerCase())
    }  
  }
  localStorage.setItem("visited", JSON.stringify(passport));
  handleEndGame()  
}

promptField.value = "";
localStorage.setItem("lastLocation", curLocation)

export const initListeners = () => {

  ['load','hashchange'].forEach( e => 
    window.addEventListener(e, () => {
      let area = dehashify(document.location.hash)
      if (area || area.length !== 0) { handleTeleportFromURL(area) }
      if (e === "hashchange") { render("", ' ', curLocation, true); }      
    }, false)
  );
  
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.querySelector(".hiddenBeforeLoad").classList.remove("hiddenBeforeLoad")
    },500)
  })

  promptField.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      handleSubmit(e.target.value);
      promptField.value = "";
      submitBtn.classList.remove("shown");
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleTab(e);
      focusOnPrompt();
    }
  });

  promptField.addEventListener("keyup", e => {
    if (promptField.value.length > 0) {
      submitBtn.classList.add("shown");
    } else {
      submitBtn.classList.remove("shown");
    }
  });

  promptField.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      promptField.value = ""
      clearInterval(walk)
      walk = null
    }
  });  

  submitBtn.addEventListener("click", e => {
    handleSubmit(promptField.value);
    promptField.value = "";
    submitBtn.classList.remove("shown");
  });

  document.querySelector("html").addEventListener("click", e => {
    focusOnPrompt();
  });
};

let showEndGame = false
let endGameAlreadyShown = false

const handleEndGame = () => {
  if (globe.length <= getVisitedCountries().length) {
    showEndGame = true
  } else {
    showEndGame = false
  }
}

if (storageAvailable('localStorage')) {
  initListeners();
  updatePassport();
  render();
}
else {
  document.write("My game uses localStorage to save your state between sessions, and frankly it's so tightly coupled that the game won't work without it. I don't track or save any of your data, so, if you can, please consider turning on localStsorage to play my game.")
}
