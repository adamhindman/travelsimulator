import { findShortestPath } from "./pathfinder.js";

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
  "sitting in a restaurant",
  "watching a commercial",
  "arguing about progressive rock",
  "attending a birthday party",
  "sprinting to catch a bus",
  "standing in line to use the bathroom",
  "using their cell phone at a restaurant",
  "making a cracker sandwich",
  "Googling pictures of otters playing",
  "scratching a lottery ticket",
  "renting a car",
  "jumping out of a plane",
  "fumbling with chopsticks",
  "at a gas station",
  "at a rock concert",
  "playing Wordle",
  "grocery shopping",
  "drinking bottled water on the street",
  "passed out in a ditch",
  "training with small arms (small arms like a pistol, not small arms like a T-Rex)",
];

export function initializeNpcs(allAreas) {
  const npcs = [
    {
      name: "AGENT",
      location: allAreas[Math.floor(Math.random() * allAreas.length)],
      moveCounter: 0,
      moveInterval: 3, // moves every 3 player moves
      attraction: "positive",
    },
    {
      name: "CRIMINAL",
      location: allAreas[Math.floor(Math.random() * allAreas.length)],
      moveCounter: 0,
      moveInterval: 3, // moves every 3 player moves
      attraction: "negative",
    },
    {
      name: "TOURIST",
      location: allAreas[Math.floor(Math.random() * allAreas.length)],
      moveCounter: 0,
      moveInterval: 5, // moves every 5 player moves
    },
  ];
  // npcs.forEach(npc => console.log(`${npc.name} starts at ${npc.location}`));
  return npcs;
}

export function npcRandomStep(npc, getAttributeOfArea) {
  const neighbors = getAttributeOfArea("neighbors", npc.location) || [];
  if (neighbors.length === 0) return;

  const newLocation = neighbors[Math.floor(Math.random() * neighbors.length)];
  npc.location = newLocation;
}

export function calculateAndLogNpcDistances(npcs, curLocation) {
  console.log("Calculating distances to NPCs:");
  npcs.forEach(npc => {
    const path = findShortestPath(curLocation, npc.location);
    if (path) {
      const distance = path.length - 1;
      console.log(`Distance to ${npc.name} in ${npc.location}: ${distance} steps.`);
    } else {
      console.log(`Could not calculate distance to ${npc.name} in ${npc.location}.`);
    }
  });
}

export function handleMonitor(npcs, curLocation, npcName) {
  let messages = [];
  let npcsToDisplay = npcs;

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

const npcDescriptions = {
  agent: "An interpol agent.",
  stranger: "A criminal mastermind.",
  tourist: "A tourist.",
};

export function getNpcDescription(npc) {
  return (
    npcDescriptions[npc.name] ||
    npc.description ||
    `You see nothing special about ${npc.name}.`
  );
}
