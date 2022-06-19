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

export const sluggify = str => str.toLowerCase().split(" ").join("-"); 

export const uppercase = str => str.toUpperCase();

/**
 *  Returns a copy of the given array with all the members in lower case
 *  @param {array} arr an array of strings. No validation is being done here.
 *  @return {array}
 *  @usage arrayToLowerCase(["foo","BAR","Baz"]);   // -> ["foo", "bar", "baz"]
 */
export const arrayToLowerCase = arr => arr.map(i => i.toLowerCase());

export const isArray = arr => {
  return Array.isArray(arr);
  // return !(arr === undefined || arr.length == 0 || arr === null);
};

export const inArray = (item, arr) => {
  let isInArray = false;
  if (isArray(arr)) {
    if (arr.indexOf(item) !== -1) {
      isInArray = true;
    }
  }
  return isInArray;
};

export function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}

export function catAllObjects(arr){
  return arr.reduce((result, current) => {
    let next = isArray(current.objects) ? current.objects.reduce((r2, c2) => r2 + c2.description, "") : "";
    return result + next
  }, "")
}

export function catAllDescriptions(arr){
  return arr.reduce((result, current) => {
    return result + current.description
  }, "")
}

export function getCountriesWithoutObjects(arr){
  return arr.filter((item) => {
    return !isArray(item.objects)
  })
}

export function roughSizeOfObject(object) {
  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === "boolean") {
      bytes += 4;
    } else if (typeof value === "string") {
      bytes += value.length * 2;
    } else if (typeof value === "number") {
      bytes += 8;
    } else if (typeof value === "object" && objectList.indexOf(value) === -1) {
      objectList.push(value);

      for (var i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
}

export const hashify = string => {
  let hash = `#${sluggify(string)}`
  return hash.toLowerCase()
}

export const dehashify = hash => {
  return hash.replace(/-/g, " ").slice(1).toLowerCase()
}

export function storageAvailable(type) {
  var storage;
  try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0);
  }
}

// David Walsh
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};