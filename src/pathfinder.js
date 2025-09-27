import { globe } from "./globe.js";

const areaMap = new Map(globe.map(area => [area.area.toLowerCase(), area]));
const originalCaseMap = new Map(globe.map(area => [area.area.toLowerCase(), area.area]));

/**
 * Finds the shortest path between two areas using Breadth-First Search.
 * @param {string} startAreaName The name of the starting area.
 * @param {string} endAreaName The name of the destination area.
 * @returns {string[] | null} An array of area names representing the shortest path, or null if no path is found.
 */
export function findShortestPath(startAreaName, endAreaName) {
  const startLower = startAreaName.toLowerCase();
  const endLower = endAreaName.toLowerCase();

  if (!areaMap.has(startLower) || !areaMap.has(endLower)) {
    return null; // Start or end area does not exist
  }

  if (startLower === endLower) {
    return [originalCaseMap.get(startLower)];
  }

  const queue = [[startLower]];
  const visited = new Set([startLower]);

  while (queue.length > 0) {
    const currentPath = queue.shift();
    const currentAreaName = currentPath[currentPath.length - 1];

    if (currentAreaName === endLower) {
      const finalPath = currentPath.map(area => originalCaseMap.get(area));

      return finalPath;
    }

    const currentArea = areaMap.get(currentAreaName);
    const neighbors = currentArea.neighbors || [];

    for (const neighborName of neighbors) {
      const neighborLower = neighborName.toLowerCase();
      if (!visited.has(neighborLower)) {
        visited.add(neighborLower);
        const newPath = [...currentPath, neighborLower];
        queue.push(newPath);
      }
    }
  }

  return null; // No path found
}
