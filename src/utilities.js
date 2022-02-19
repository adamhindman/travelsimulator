/**
 * Capitalizes first letters of words in string.
 * @param {string} str String to be modified
 * @param {boolean=false} lower Whether all other letters should be lowercased
 * @return {string}
 * @usage
 *   capitalize('fix this string');     // -> 'Fix This String'
 *   capitalize('javaSCrIPT');          // -> 'JavaSCrIPT'
 *   capitalize('javaSCrIPT', true);    // -> 'Javascript'
 */
export const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match =>
    match.toUpperCase()
  );

export const uppercase = str => str.toUpperCase();

/**
 *  Returns a copy of the given array with all the members in lower case
 *  @param {array} arr an array of strings. No validation is being done here.
 *  @return {array}
 *  @usage arrayToLowerCase(["foo","BAR","Baz"]);   // -> ["foo", "bar", "baz"]
 */
export const arrayToLowerCase = arr => arr.map(i => i.toLowerCase());

export const isArray = arr => !(arr === undefined || arr.length == 0);

export const inArray = (item, arr) => {
  let isInArray = false;
  if (isArray(arr)) {
    if (arr.indexOf(item) !== -1) {
      isInArray = true;
    }
  }
  return isInArray;
};
