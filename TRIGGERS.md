# Game Content Triggers

This document explains how to add interactive triggers to the game world. These triggers allow you to automatically update the player's notebook or inventory when they visit specific locations or examine specific objects.

## Editing World Data

All triggers are defined in `src/globe.js`. This file contains the main `globe` array, where each entry represents a country/area and its contents.

## Location-Based Triggers

These triggers fire immediately when a player enters a specific country or area.

### 1. Notebook Entry (`notebookEntry`)

Adds a note to the player's notebook upon arrival.

**Usage:** Add a `notebookEntry` string property to the country object.

```javascript
{
  area: "Japan",
  description: "...",
  notebookEntry: "Note to self: Visit the ancient temples in Kyoto."
}
```

### 2. Inventory Item (`inventoryItem`)

Adds an item to the player's inventory upon arrival.

**Usage:** Add an `inventoryItem` property to the country object. This can be a simple string (item name) or an object defining the item.

**String Example:**
```javascript
{
  area: "France",
  description: "...",
  inventoryItem: "Baguette" // Creates an item with name and description "Baguette"
}
```

**Object Example:**
```javascript
{
  area: "Brazil",
  description: "...",
  inventoryItem: {
    name: "Carnival Mask",
    description: "A colorful mask covered in feathers and glitter."
  }
}
```

## Object-Based Triggers

These triggers fire when a player uses the `LOOK` command on a specific object found in a location.

### 1. Notebook Entry (`notebookEntry`)

Adds a note to the player's notebook when they examine the object.

**Usage:** Add a `notebookEntry` string property to the object definition within the `objects` array.

```javascript
{
  area: "United States",
  objects: [
    {
      name: "GRAND CANYON",
      description: "A massive canyon carved by the Colorado River.",
      notebookEntry: "I saw the Grand Canyon today. It was bigger than I expected."
    }
  ]
}
```

### 2. Inventory Item (`inventoryItem`)

Adds an item to the player's inventory when they examine the object. This is useful for "finding" hidden items inside other objects.

**Usage:** Add an `inventoryItem` property to the object definition.

```javascript
{
  area: "Egypt",
  objects: [
    {
      name: "SARCOPHAGUS",
      description: "An ancient stone coffin.",
      inventoryItem: {
        name: "Scarab Beetle",
        description: "A jewel-encrusted amulet shaped like a beetle."
      }
    }
  ]
}
```

## Summary of Properties

| Property | Type | Context | Effect |
|----------|------|---------|--------|
| `notebookEntry` | String | Country Object | Adds note when visiting location. |
| `inventoryItem` | String or Object | Country Object | Adds item when visiting location. |
| `notebookEntry` | String | World Object (`objects[]`) | Adds note when looking at object. |
| `inventoryItem` | String or Object | World Object (`objects[]`) | Adds item when looking at object. |