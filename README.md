# Travel Simulator

Travel Simulator is a text-based adventure game built with modern JavaScript. Explore the globe, collect artifacts, interact with quirky NPCs, and complete quests in a world that blends real-world geography with surreal humor and fantasy elements.

## Features

- **Global Exploration**: Visit hundreds of countries and locations, from Paris to Atlantis, and even Mars.
- **Quest System**: Embark on quests like the "Atlantean Trial" to collect objects of unearthly power.
- **NPC Interaction**: Meet and track NPCs as they travel around the world in real-time.
- **Persistent State**: Your progress, inventory, and passport stamps are saved automatically via LocalStorage.
- **Responsive UI**: A clean, text-driven interface that works on various screen sizes.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS version recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository (if applicable) or navigate to the project directory.
2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Game

To start the development server:

```bash
npm start
```

This will run Parcel and typically serve the game at `http://localhost:1234`.

### Building for Production

To build the project for deployment:

```bash
npm run build
```

The output will be generated in the `dist` directory.

## Commands

### Exploration & Movement
- **`GO [Location]`** (or `WALK`): Move to a neighboring location.
- **`TELEPORT [Location]`** (or `TEL`): Teleport instantly to any visited location (requires the Handheld Teleporter item or debug mode).
- **`RANDOMWALK [Steps]`**: Automatically walk randomly for a specified number of steps (default: 100).

### Interaction
- **`LOOK [Target]`** (or `EXAMINE`, `EX`, `EXITS`): Inspect an object, NPC, or inventory item. Type `LOOK` or `LOOK AROUND` to see the current location description.
- **`TAKE [Item]`**: Pick up an item (mostly automatic when looking at objects with items).

### Player Tools
- **`INVENTORY`** (or `INV`, `I`): View your current items.
- **`PASSPORT`**: View your travel history and visited countries.
- **`NOTEBOOK`**: Read your quest notes and personal entries.
- **`WRITE [Text]`**: Add a custom entry to your notebook.
- **`MONITOR`** (or `TRACK`): Track the location of NPCs using your satellite monitor.

### System
- **`HELP`**: Display the standard list of commands.
- **`STATS`**: Show game statistics like world size and move count.
- **`TEXT [Size]`**: Adjust font size (`small`, `medium`, `large`, `default`, or a number like `1.5`).
- **`FORGET [Item/Location]`**: Delete specific data or reset the entire game state (if no argument provided).

## Secret & Debug Commands

These commands are not listed in the standard `HELP` menu and are intended for testing or power users.

- **`WIN`**: Immediately triggers the game completion sequence.
- **`DEBUG`**: Enables teleportation without the required item and adds all "throbber" quest items to your inventory.
- **`SPAWN [Speed] [Location]`**: Manually spawn a new NPC.
  - Example: `SPAWN 5 France`
- **`DESPAWN [Name]`**: Remove a specific NPC from the game.
  - Example: `DESPAWN Frederick`
  - Use `DESPAWN` without arguments to remove all NPCs.
- **`AUDIT`**: Displays a list of the top 10 countries with the fewest words in their object descriptions. Useful for identifying content gaps.