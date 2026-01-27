import { findShortestPath } from "./pathfinder.js";
import {
  npcs,
  curLocation,
  allAreas,
  saveNpcs,
  areaExists,
  setFlag,
  getFlag,
} from "./state.js";
import { findFriendNoteTemplates } from "./quests.js";
import { addToNotebook, resolveQuest } from "./notebook.js";
import { capitalize } from "./utilities.js";

export const activities = [
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
  "training with small arms (small arms like a rifle, not small arms like a T-Rex)",
  "jogging",
  "writing in their diary",
  "eating an egg",
  "painting in watercolor",
  "scratching a lottery ticket",
  "eating pretzels in the dark",
  "walking dully along",
  "sharpening a machete",
  "staring at the moon, drunk",
  "sitting in a restaurant",
  "pointing at a bird",
  "watching a movie",
];

const npcNames = [
  "ADRIAN",
  "ALBERT",
  "ALDO",
  "ALPHONSE",
  "AMADOU",
  "ANDRE",
  "ANTON",
  "ARJUN",
  "ARTHUR",
  "BENEDICT",
  "BERNARD",
  "CALEB",
  "CALVIN",
  "CARLOS",
  "CLYDE",
  "DAMIAN",
  "DARIUS",
  "DOMINIC",
  "EDGAR",
  "ELIAS",
  "EMILIO",
  "ENZO",
  "ERNEST",
  "FELIX",
  "FRANCIS",
  "GARETH",
  "GIDEON",
  "HAMID",
  "HAROLD",
  "HECTOR",
  "HORACE",
  "IGNACIO",
  "ILYA",
  "ISAAC",
  "JABARI",
  "JAMAL",
  "JONAS",
  "JULIAN",
  "KENJI",
  "KENNETH",
  "KENTA",
  "KLAUS",
  "KWAME",
  "LAWRENCE",
  "LEONARD",
  "LIONEL",
  "MALCOLM",
  "MARCO",
  "MARCUS",
  "MARTIN",
  "MATEO",
  "MATTEO",
  "MILTON",
  "MOSES",
  "NATHANIEL",
  "NIKOLAI",
  "NURU",
  "OLEG",
  "OMAR",
  "OSCAR",
  "PERCIVAL",
  "QUENTIN",
  "RAFAEL",
  "RAJESH",
  "RAYMOND",
  "ROLAND",
  "SAMIR",
  "SATOSHI",
  "SHIV",
  "SILAS",
  "TAKUMI",
  "TENZIN",
  "THABO",
  "VICTOR",
  "WEI",
  "XAVIER",
  "YUSUF",
  "ZUBAIR",
];

export const npcDescriptions = [
  'A surprisingly regular looking dude. He is carrying a brown paper bag, and when you ask about it he says. "Oh, this? Just some Skittles."<p>He offers you some Skittles, and then pours them carefully into your open palm.</p>',
  "A lean man carrying a violin case patched with stickers from cities that don’t quite match his accent. He sits on his pack, bow in hand, drawing a few testing notes that wobble between mournful and hopeful. When he notices you looking at him, he becomes bashful and puts his violin away quickly.",
  "A broad-shouldered man. His flannel sleeve is ripped nearly to the elbow, the threads catching in the wind. His exposed forearm reveals a tattoo of a cartoon dinosaur. He’s crouched over a battered map, smoothing it against his knee, frowning hard as though trying to will it into telling him where to go.",
  "A tall man whose boots gleam far too brightly compared to the rest of his clothing, which appears to have been dipped in mud. Perched on a fencepost like a buzzard, he sits polishing those boots feverishly with a rag. He speaks to them in a tone of gentle scolding, in a language you can't make out.",
  "This heavyset man is holding a leather satchel that has split along one seam. A few envelopes peeking out like escaping prisoners waiting for the guards to pass by.",
  "A wiry man with sharp cheekbones and a travel-stained wool coat dotted with what appear to be cigarette burns. He leans against a wall, flipping through a tiny leather notebook filled with cramped handwriting. His eyes keep darting in the same direction.",
  "It is a dog. A wiry black-and-white dog with one torn ear and a patched leather satchel slung over his back. He’s gnawing on the strap of the satchel as if it were the corpse of a rabbit. His tail thumps with deep satisfaction. Every so often he drops the satchel, trots in a small circle, then drags it a few more feet down the road with single-minded determination.",
  "A soft-faced man with sunburn across his forehead and a camera strap patterned in neon zigzags cutting across his chest. He’s standing in the middle of the road, turning in a slow circle to line up the perfect shot. From what you can observe, his photographic subject seems to be 'whatever is in front of me right now', from lightbulbs to trash cans, to the empty sky. He wears a baseball cap that looks like it’s survived a fistfight in a rainstorm.",
  "This man is wearing a dented steel helmet, vaguely medieval in design, which looks to be much too small for his head. He’s seated on a crate, unwrapping a greasy sandwich from brown paper and eating it with slow, methodical bites. Between mouthfuls, he squints down the road, as if waiting for someone—you, maybe?",
  "This is, unmistakably, a crow. It is large, greasy, and covered in black feathers. Possibly a raven. No, definitely a crow. <p>He’s perched on the handle of an abandoned cart, trying to open a dented box of crackers with his beak.</p>",
  "He wears a wrinkled white shirt with the sleeves rolled too high, exposing wrists crowded with faded biro marks that seem to constitute a shopping list. Balanced on his knee is a tiny black notebook, its cover soft from handling. He writes in blocky letters that switch from Cyrillic to Greek to Latin without hesitation. The pen moves quickly, but his eyes stay fixed on the passing crowd.",
  "His wool coat is stretched tight across the stomach, and his absurd mustache curls unevenly, one end longer than the other. At the baggage carts he drums a rhythm on the metal railing: short, short, long. He checks the inner pocket of his coat from time to time, flipping through a book of crossword puzzles as though referencing something in it.",
  "His collar is starched to the point of discomfort, reddening the skin beneath his jaw. He stands polishing a pair of binoculars until the lenses gleam, then lifting them for a brief scan of the distant rooftops. A battered oil cloth bag rests at his feet, tied tightly shut with jute twine.",
  "This man is crouching before a vending machine, slipping coins into the slot. His windbreaker hangs too heavy on his frame, pockets bulging with junk food. As he dials in the coordinates of each new snack, and it falls through the coils, he picks it up and tucks it into his jacket without giving it more than a cursory inspection.",
  "He strides off the arriving bus, a leather satchel thumping against his side. When a boy runs up to sell him gum, he waves him off with a friendly smile, then slips into the alley behind the café. A moment later he reappears at the corner table, already unfolding a newspaper in which a second, smaller newspaper is hidden.",
  "He kneels in the dirt, tying and retying the laces on his boots until the knots are tight enough to cut the leather. A passing wagon rattles by and he rises quickly, brushing the dust from his knees. Without looking around, he crosses the street and falls into step behind a family of travelers, blending neatly into their pace.",
  "He squats by the fountain, playing dice against himself on the stone ledge. Each time the dice land, he mutters the result and writes something in chalk on the pavement—rows of numbers piling up. When someone approaches, he wipes the chalk away with his sleeve and pockets the dice.",
  "He lingers by a fruit cart, palming an apple, then returning it, then palming it again. You notice that his backpack is filled with oranges, pears, lemons, and other fruit. To your astonishment, the vendor seems to be humoring his behavior for some reason.",
  "A short man with ink-black hair. He's wearing a set of large, expensive wireless headphones. He nods when he sees you, the kind of gesture that suggests he’s memorizing your face.",
  "A tall man with aviator sunglasses. The sunglasses stay on indoors, paired with a baseball cap tugged far down his brow. When he walks, his gait is unmistakably loose-limbed, the sort born on a stage in front of a screaming crowd. He pauses at a souvenir stand, strumming a plastic ukulele with a practiced hand, and the shopkeeper mutters that it sounds better than the real thing.",
  "A wiry man in dark glasses and a sequined scarf. He tries to keep his head down, but the scarf glitters under every passing light. While waiting for his train, he moonwalks two careful steps before looking around guiltily. When a child drops a toy, he returns it with a gloved hand and a soft 'hee-hee' that earns a round of gasps from the platform.",
  "A man with a curled lip. His hair is slicked back, jet-black, though it doesn’t quite hide the sideburns. He eats a fried sandwich with visible delight, humming in a low baritone while tapping his feet rhythmically on the tile floor.",
  "A white-suited man with a cigar. He sits on his suitcase at the edge of the platform, puffing slowly and chuckling to himself. When he thinks nobody is looking, you hear him mumbling 'I wish I was on a god damn riverboat.'",
];

export function npcRandomStep(npc, getAttributeOfArea) {
  const neighbors = getAttributeOfArea("neighbors", npc.location) || [];
  if (neighbors.length === 0) return;

  const newLocation = neighbors[Math.floor(Math.random() * neighbors.length)];
  npc.location = newLocation;
  saveNpcs();
}

export function handleMonitor(noun, words, neighbors) {
  if (npcs.length === 0) {
    return (
      "<p>With your state of the art handheld monitor, you easily zero in on the target by hacking keyhole satellites and closed-circuit cameras.</p>" +
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
        `<p>${npc.name} is ${distance} countries away, in ${npc.location}, ${randomActivity}.</p>`,
      );
    } else {
      messages.push(`There's some static interfering with the monitor.`);
    }
  });

  return (
    "<p>With your state of the art handheld monitor, you easily zero in on the target by hacking keyhole satellites and closed-circuit cameras.</p>" +
    messages.join("")
  );
}

export function handleLookAtNpc(npc) {
  if (resolveQuest(npc.name)) {
    setFlag("findNPCQuestActive", false);
  }
  // When you look at an NPC, you get their description.
  // If you haven't talked to them before, they give you a quest.
  let response = `<p>${npc.description}</p>`;

  if (!npc.hasBeenTalkedTo) {
    npc.hasBeenTalkedTo = true;

    if (getFlag("findNPCQuestActive")) {
      saveNpcs();
      return response;
    }

    setFlag("findNPCQuestActive");

    const metNpcs = JSON.parse(localStorage.getItem("metNpcs") || "[]");
    if (!metNpcs.includes(npc.name)) {
      metNpcs.push(npc.name);
      localStorage.setItem("metNpcs", JSON.stringify(metNpcs));
    }

    // Create a new NPC for the player to find
    createNpc(5, null, npc.name);
    const targetNpc = npcs[npcs.length - 1]; // The NPC we just created
    npc.questTargetName = targetNpc.name;

    // Add quest information to the player's notebook
    const notebookEntry = `Met ${npc.name} in ${capitalize(curLocation)}. He asked me to find his friend ${targetNpc.name}, who was last seen in ${capitalize(targetNpc.location)}.`;
    addToNotebook(notebookEntry);

    response += `<p>"Have you seen my friend, ${targetNpc.name}?" he asks. "The last place I saw them was ${targetNpc.location.toUpperCase()}."</p><p>You jot this down in your <span class="button object" data-object="notebook">NOTEBOOK</span>.</p>`;
    saveNpcs();
  }

  return response;
}

export function createNpc(speed = 5, area = null, excludeName = null) {
  let availableNames = npcNames;
  if (excludeName) {
    availableNames = npcNames.filter(n => n.toLowerCase() !== excludeName.toLowerCase());
  }
  const name = availableNames[Math.floor(Math.random() * availableNames.length)];
  const description = npcDescriptions[Math.floor(Math.random() * npcDescriptions.length)];

  let location;
  if (area && areaExists(area)) {
    location = area;
  } else {
    // Filter out the player's current location
    const availableLocations = allAreas.filter(
      location => location.toLowerCase() !== curLocation.toLowerCase(),
    );

    // Select a random location from the available locations
    location = availableLocations[Math.floor(Math.random() * availableLocations.length)];
  }

  const newNpc = {
    name,
    description,
    location,
    moveCounter: 0,
    moveInterval: speed,
    hasBeenTalkedTo: false,
    questTargetName: null,
    questTargetLocation: null,
  };

  npcs.push(newNpc);
  saveNpcs();
}

export function despawn(name) {
  const index = npcs.findIndex(npc => npc.name.toLowerCase() === name.toLowerCase());
  if (index > -1) {
    npcs.splice(index, 1);
    saveNpcs();
  }
}

export function handleTalkToNpc(npc) {
  if (npc.hasBeenTalkedTo) {
    return `You've already spoken to ${npc.name}.`;
  }

  npc.hasBeenTalkedTo = true;

  if (getFlag("findNPCQuestActive")) {
    saveNpcs();
    return `${npc.name} has nothing to say.`;
  }

  setFlag("findNPCQuestActive");

  // If you're the only NPC, we need to create another one to be the quest target.
  if (npcs.length < 2) {
    createNpc();
  }

  // Find an NPC for the quest that isn't the current one
  const otherNpcs = npcs.filter(n => n.name !== npc.name);
  if (otherNpcs.length > 0) {
    const targetNpc = otherNpcs[Math.floor(Math.random() * otherNpcs.length)];
    npc.questTargetName = targetNpc.name;

    const noteTemplate =
      findFriendNoteTemplates[Math.floor(Math.random() * findFriendNoteTemplates.length)];
    const note = `${noteTemplate}${targetNpc.name.toUpperCase()}`;
    addToInventory({
      name: note,
      description: "That's pretty much all it says.",
    });

    saveNpcs();

    return `${
      npc.name
    } asks you to find their friend, ${targetNpc.name.toUpperCase()}. A note has been added to your inventory.`;
  }

  saveNpcs();
  return `${npc.name} has nothing to say.`;
}
