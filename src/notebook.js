// Notebook management system
// Handles the player's notebook which accumulates quest information and notes

import { inventory } from "./inventory.js";

/**
 * Load notebook entries from localStorage
 * @returns {Array<string>} Array of notebook entries
 */
function loadNotebook() {
  const stored = localStorage.getItem("notebook");
  if (!stored) {
    return getDefaultEntries();
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : getDefaultEntries();
  } catch (e) {
    return getDefaultEntries();
  }
}

/**
 * Get the default notebook entries for a new game
 * @returns {Array<string>} Default entries
 */
function getDefaultEntries() {
  return ["Note to self: write notes to self here"];
}

/**
 * The notebook entries array
 */
export let notebookEntries = loadNotebook();

/**
 * Save notebook to localStorage
 */
export function saveNotebook() {
  localStorage.setItem("notebook", JSON.stringify(notebookEntries));
}

/**
 * Add a new entry to the notebook
 * @param {string} text The text to add
 */
export function addToNotebook(text) {
  if (text && typeof text === "string") {
    if (notebookEntries.includes(text)) return false;
    notebookEntries.push(text);
    saveNotebook();
    return true;
  }
  return false;
}

/**
 * Trigger a notebook entry and optionally return a message to the player
 * This is the main function to use when you want an action to write to the notebook
 * @param {string} text The text to add to the notebook
 * @param {boolean} showMessage Whether to return a message indicating the note was written (default: true)
 * @returns {string} Message to display to the player, or empty string
 */
export function triggerNotebookEntry(text, showMessage = true) {
  const added = addToNotebook(text);
  if (!added) return "";
  return showMessage
    ? `<p>You jot this down in your <span class="button object" data-object="notebook">NOTEBOOK</span>.</p>`
    : "";
}

/**
 * Get all notebook entries as a formatted HTML string
 * @returns {string} HTML representation of notebook contents
 */
export function getNotebookContents() {
  if (notebookEntries.length === 0) {
    return "<p>The notebook is empty.</p>";
  }

  let content = '<div class="notebook-contents"><p><strong>NOTEBOOK:</strong></p><ul>';

  const throbberCount = inventory.filter(i => i.questline === "throbbers").length;

  notebookEntries.forEach((entry, index) => {
    const formattedEntry = entry.replace(
      "{{THROBBER_COUNT}}",
      `<span class="dim">(${throbberCount} out of 17 found)</span>`,
    );
    content += `<li>${formattedEntry}</li>`;
  });

  content += "</ul></div>";

  return content;
}

/**
 * Marks notebook entries related to finding a specific NPC as completed (strikethrough).
 * @param {string} targetName The name of the NPC that was found.
 */
export function resolveQuest(targetName) {
  let changed = false;
  notebookEntries = notebookEntries.map(entry => {
    if (entry.includes(`find his friend ${targetName}`) && !entry.includes("<s>")) {
      changed = true;
      return `<s>${entry}</s>`;
    }
    return entry;
  });

  if (changed) {
    saveNotebook();
  }
  return changed;
}

/**
 * Clear all notebook entries (for game reset)
 */
export function clearNotebook() {
  notebookEntries.length = 0;
  notebookEntries.push(...getDefaultEntries());
  saveNotebook();
}

/**
 * Reset notebook to default state
 */
export function resetNotebook() {
  clearNotebook();
}
