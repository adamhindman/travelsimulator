# Project Context: Travel Simulator

This document provides architectural context, coding conventions, and project structure overview for AI agents and developers working on the Travel Simulator codebase.

## 1. Project Overview

Travel Simulator is a text-based open-world adventure game built with vanilla JavaScript. It runs in the browser and persists state using `localStorage`. The game focuses on exploration, interacting with quirky objects/NPCs, and completing quests.

## 2. Tech Stack

- **Runtime**: Browser (HTML5/CSS3/ES6+ JavaScript).
- **Build Tool**: Parcel (`npm start` to run, `npm run build` to bundle).
- **Styling**: Standard CSS (located in `src/style.css`).
- **Data Storage**: `localStorage` (tightly coupled, required for game state).

## 3. Project Structure

The source code is located in `src/`.

### Core Logic
- **`app.js`**: Main entry point. Handles the input loop (`handleSubmit`) and delegates to the command registry.
- **`commandRegistry.js`**: Maps command verbs (e.g., "go", "look") to handler functions. acts as the controller.
- **`commands.js`**: Contains the logic for movement, looking, and other primary game actions.
- **`state.js`**: Manages global game state (current location, visited list, flags) and persistence logic.
- **`ui.js`**: DOM manipulation, rendering text to the console, and event listeners.

### Data Management
- **`globe.js`**: Massive data file containing the world definition. An array of country objects, each containing:
    - `area`: Name of the location.
    - `description`: HTML string.
    - `neighbors`: Array of accessible adjacent locations.
    - `objects`: Array of interactable items in the location.
    - `triggers`: Properties like `inventoryItem` or `notebookEntry` (See `TRIGGERS.md`).
- **`inventory.js`**: Manages player inventory (add, remove, check).
- **`notebook.js`**: Manages the quest log/journal.
- **`npc.js`**: Logic for NPC spawning, movement, and interaction.

### Utilities
- **`utilities.js`**: Helper functions for string manipulation, array operations, and calculations.
- **`pathfinder.js`**: BFS implementation for calculating distances/routes between countries.

## 4. Key Architectural Patterns

### Command Handling
1. **Input**: User types into `<input id="prompt">`.
2. **Parsing**: `app.js` normalizes input (lowercase, trim) and splits it into a **verb** (first word) and **noun** (rest of string).
3. **Dispatch**: `commandRegistry.js` looks up the verb.
4. **Execution**: The handler function is called with signature `(noun, allWords, neighborList)`.
5. **Output**: The handler returns an HTML string (or object `{msg, showLoc}`) which `ui.js` renders to the DOM.

### State Persistence
State is saved to `localStorage` immediately upon change.
- **`visited`**: Array of visited location names.
- **`inventory`**: Array of item objects.
- **`npcs`**: Array of active NPC objects.
- **`flags`**: Key-value pairs for quest states (e.g., `atlantisQuestActive`).
- **`totalMoves`**: Integer counter of player actions.

### Content Triggers
Logic in `state.js` (`updateLocation`) and `commands.js` (`handleLook`) checks for special properties in `globe.js` data:
- `notebookEntry`: Adds text to the notebook.
- `inventoryItem`: Adds an item to the inventory.
- `setFlag`: Sets a boolean flag in the state.
- `questline`: Tags items for specific logic (e.g., "throbbers").

## 5. Development Guidelines

- **HTML Output**: Handler functions should return strings containing HTML tags (usually `<p>...</p>`, `<ul>`, etc.). Do not return plain text without formatting unless wrapped by the UI.
- **No `alert()`**: Use `render()` or return strings to display messages to the player.
- **ES Modules**: Use `import` / `export` syntax.
- **Formatting**:
    - **Code Blocks**: When citing code in conversation, always use the `path/to/file#L1-10` syntax.
    - **Strings**: Text content often uses double quotes.
- **State Mutation**: Always use helper functions in `state.js` (e.g., `updateLocation`, `setFlag`) rather than mutating variables directly, to ensure consistency and persistence.

## 6. Common Tasks

### Adding a New Command
1. Create the handler function (usually in `commandRegistry.js` if simple, or `commands.js` if complex).
2. Import the handler in `commandRegistry.js`.
3. Add the verb key and handler value to the `commandRegistry` object.

### Adding Content
1. Edit `src/globe.js`.
2. Follow the schema in `TRIGGERS.md` to add objects, items, or notebook entries.

### Debugging
- Use the secret `debug` command to enable teleportation and acquire quest items.
- Use `spawn [speed] [location]` to test NPC logic.