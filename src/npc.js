import { findShortestPath } from "./pathfinder.js";
import { npcs, curLocation, allAreas } from "./state.js";

const activities = [
  "eating an ice cream cone",
  "sleeping",
  "looking for a cell phone charger",
  "obviously drunk",
  "staring at the moon",
  "getting mugged",
  "chatting about the weather",
  "doom scrolling",
  "taking a selfie",
  "trying to pet a dog who keeps walking away",
  "applying deodorant",
  "describing an app idea",
  "crying on a bench",
  "watching a commercial",
  "arguing about progressive rock",
  "attending a birthday party",
  "pacing back and forth, mumbling",
  "standing outside a locked bathroom",
  "staring at their cell phone mindlessly",
  "making a cracker sandwich",
  "looking at pictures of otters",
  "scratching a lottery ticket",
  "cleaning a rifle",
  "jumping out of a plane",
  "fumbling with chopsticks",
  "cracking open a bag of corn chips",
  "singing to themself",
  "working on the daily Jumble",
  "doing some shopping",
  "drinking bottled water",
  "passed out",
  "training with small arms (small arms like a pistol, not small arms like a T-Rex)",
  "jogging",
  "writing in their diary",
  "eating an egg",
  "painting in watercolor",
];

const sampleNames = [
  "ARTIE",
  "BOB",
  "CHRISTOPHER",
  "DAN",
  "EDGAR",
  "FRANK",
  "GERALD",
  "HANK",
];
const sampleDescriptions = ["An angry man", "A fat man", "A rich man", "A handsome man"];

export function initializeNpcs(allAreas) {
  return [];
}

export function npcRandomStep(npc, getAttributeOfArea) {
  const neighbors = getAttributeOfArea("neighbors", npc.location) || [];
  if (neighbors.length === 0) return;

  const newLocation = neighbors[Math.floor(Math.random() * neighbors.length)];
  npc.location = newLocation;
}

export function handleMonitor(noun, words, neighbors) {
  if (npcs.length === 0) {
    return (
      "<p>Using your hacking skills, you zero in on your target, using keyhole satellites and closed-circuit cameras.</p>" +
      "<p>However, at present there's no one to monitor.</p>"
    );
  }

  let messages = [];
  let npcsToDisplay = npcs;

  const npcName = noun;
  if (npcName && npcName.length > 0) {
    npcsToDisplay = npcs.filter(npc => npc.name.toLowerCase().includes(npcName));

    if (npcsToDisplay.length === 0) {
      return "<p>You can't find anyone by that name.</p>";
    }
  }

  npcsToDisplay.forEach(npc => {
    const path = findShortestPath(curLocation, npc.location);
    if (path) {
      const distance = path.length - 1;
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      messages.push(
        `<p>The ${npc.name} is ${distance} countries away, in ${npc.location}, ${randomActivity}.</p>`,
      );
    } else {
      messages.push(`There's some static interfering with the monitor.`);
    }
  });

  return (
    "<p>Using your hacking skills, you zero in on your target, using keyhole satellites and closed-circuit cameras.</p>" +
    messages.join("")
  );
}

export function createNpc(speed = 5) {
  const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
  const description =
    sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)];

  // Filter out the player's current location
  const availableLocations = allAreas.filter(
    location => location.toLowerCase() !== curLocation.toLowerCase(),
  );

  // Select a random location from the available locations
  const location =
    availableLocations[Math.floor(Math.random() * availableLocations.length)];

  const newNpc = {
    name,
    description,
    location,
    moveCounter: 0,
    moveInterval: speed,
  };

  console.log("New NPC created:", newNpc);
  npcs.push(newNpc);
}
