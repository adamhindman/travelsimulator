// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"1Mq12":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "4a236f9275d0a351";
module.bundle.HMR_BUNDLE_ID = "b5b6c481d56a3cb1";
"use strict";
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F() {
            };
            return {
                s: F,
                n: function n() {
                    if (i >= o.length) return {
                        done: true
                    };
                    return {
                        done: false,
                        value: o[i++]
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
        s: function s() {
            it = o[Symbol.iterator]();
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it.return != null) it.return();
            } finally{
                if (didErr) throw err;
            }
        }
    };
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
            this._acceptCallbacks.push(fn || function() {
            });
        },
        dispose: function dispose(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/'); // $FlowFixMe
    ws.onmessage = function(event) {
        checkedAssets = {
        };
        acceptedAssets = {
        };
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            var assets = data.assets.filter(function(asset) {
                return asset.envHash === HMR_ENV_HASH;
            }); // Handle HMR Update
            var handled = assets.every(function(asset) {
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            var _iterator = _createForOfIteratorHelper(data.diagnostics.ansi), _step;
            try {
                for(_iterator.s(); !(_step = _iterator.n()).done;){
                    var ansiDiagnostic = _step.value;
                    var stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                    console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
                }
            } catch (err) {
                _iterator.e(err);
            } finally{
                _iterator.f();
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    var errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    var _iterator2 = _createForOfIteratorHelper(diagnostics), _step2;
    try {
        for(_iterator2.s(); !(_step2 = _iterator2.n()).done;){
            var diagnostic = _step2.value;
            var stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
            errorHTML += "\n      <div>\n        <div style=\"font-size: 18px; font-weight: bold; margin-top: 20px;\">\n          \uD83D\uDEA8 ".concat(diagnostic.message, "\n        </div>\n        <pre>").concat(stack, "</pre>\n        <div>\n          ").concat(diagnostic.hints.map(function(hint) {
                return '<div>💡 ' + hint + '</div>';
            }).join(''), "\n        </div>\n        ").concat(diagnostic.documentation ? "<div>\uD83D\uDCDD <a style=\"color: violet\" href=\"".concat(diagnostic.documentation, "\" target=\"_blank\">Learn more</a></div>") : '', "\n      </div>\n    ");
        }
    } catch (err) {
        _iterator2.e(err);
    } finally{
        _iterator2.f();
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        var deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            var fn = new Function('require', 'module', 'exports', asset.output);
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) return true;
    var parents = getParents(module.bundle.root, id); // If no parents, the asset is new. Prevent reloading the page.
    if (!parents.length) return true;
    return parents.some(function(v) {
        return hmrAcceptCheck(v[0], v[1], null);
    });
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {
    };
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"5HwUs":[function(require,module,exports) {
var _globeJs = require("./globe.js");
console.clear();
const arrayToLowercase = (arr)=>arr.map((i)=>i.toLowerCase()
    )
;
let location = "United States";
const getAttributeOfArea = (attrib, area = location)=>{
    items = _globeJs.globe.filter((i)=>i.area.toLowerCase() === area.toLowerCase()
    )[0][attrib];
    return items;
};
const getNeighborsText = ()=>{
    let list = getAttributeOfArea("neighbors").reduce((result, cur, i)=>{
        return result + `<button data-destination="${cur}">${cur}</button>`;
    }, "");
    return `<p>${list}</p>`;
};
const getObjectsText = ()=>{
    let objects = getAttributeOfArea("objects");
    let listOfObjects = "";
    if (typeof objects !== "undefined") listOfObjects = objects.reduce((result, cur, i)=>{
        return result + `${cur} is here. `;
    }, "");
    else listOfObjects = `Nothing of importance is here.`;
    return `<p>${listOfObjects}</p>`;
};
const render = (val = null, msg = null, area = location)=>{
    setTimeout(()=>{
        document.getElementById("display").innerHTML += getDisplay(val, msg);
        document.querySelector("#console").scrollIntoView(true);
        document.querySelectorAll("button").forEach((i)=>{
            i.addEventListener("click", (e)=>{
                const dest = e.target.dataset.destination.toLowerCase();
                document.querySelector("#prompt").value = `go ${dest}`;
            });
        });
    }, 500);
};
const handleSubmit = (val, msg = "")=>{
    let verb = val.split(" ")[0];
    let noun = val.substring(3);
    if (verb === "go" && arrayToLowercase(getAttributeOfArea("neighbors")).includes(noun)) location = noun;
    else if (verb === "go") msg = `<p>You can't get to ${noun} from here!</p>`;
    else if (verb === "help") msg = `
      <h3>HELP</h3>
      <p>Type "go" and then the name of a nearby country to travel there.</p>
      <p>Or click on a country's name in the list to make me type it for you.</p>
    `;
    else msg = `<p>I don't recognize the verb "${verb}".</p>`;
    render(val, msg);
};
const getDisplay = (val, msg, area)=>{
    let display = `
    ${val != null ? `<p><span class="caret"></span>${val}</p>` : ``}
    ${msg != null ? `<p>${msg}</p>` : ``}
    <p>You are in <span>${location}</span>. ${getObjectsText()}</p>
    <p>Exits are: ${getNeighborsText()}
  `;
    return display;
};
document.getElementById("prompt").addEventListener("keydown", (e)=>{
    if (e.key === "Enter") {
        handleSubmit(e.target.value.toLowerCase());
        e.target.value = "";
    }
});
document.querySelector("html").addEventListener("click", (e)=>{
    document.getElementById("prompt").focus();
});
render();

},{"./globe.js":"aQ8q9"}],"aQ8q9":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "globe", ()=>globe
);
const globe = [
    {
        area: "Arctic Ocean",
        type: "ocean",
        neighbors: [
            "Canada",
            "Greenland",
            "Iceland",
            "Norway",
            "Russia",
            "United States", 
        ]
    },
    {
        area: "Pacific Ocean",
        type: "ocean",
        neighbors: [
            "Australia",
            "Brunei",
            "Cambodia",
            "Canada",
            "Chile",
            "China",
            "Colombia",
            "Costa Rica",
            "East Timor",
            "Easter Island",
            "Ecuador",
            "El Salvador",
            "Federated States of Micronesia",
            "Fiji",
            "Guatemala",
            "Honduras",
            "Hong Kong",
            "Indonesia",
            "Japan",
            "Kiribati",
            "Malaysia",
            "Marshall Islands",
            "Mexico",
            "Nauru",
            "New Zealand",
            "Nicaragua",
            "North Korea",
            "Palau",
            "Panama",
            "Papua New Guinea",
            "Peru",
            "Philippines",
            "Russia",
            "Samoa",
            "Singapore",
            "Solomon Islands",
            "South Korea",
            "Taiwan",
            "Thailand",
            "Tonga",
            "Tuvalu",
            "United States",
            "Vanuatu",
            "Vietnam",
            "Wallis Island", 
        ]
    },
    {
        area: "Atlantic Ocean",
        type: "ocean",
        neighbors: [
            "Albania",
            "Algeria",
            "Angola",
            "Antigua and Barbuda",
            "Argentina",
            "Bahamas",
            "Barbados",
            "Belgium",
            "Belize",
            "Benin",
            "Bermuda",
            "Bermuda",
            "Bosnia and Herzegovina",
            "Brazil",
            "Bulgaria",
            "Cameroon",
            "Canada",
            "Cape Verde",
            "Chile",
            "Colombia",
            "Costa Rica",
            "Croatia",
            "Cuba",
            "Cyprus",
            "Cyprus",
            "Democratic Republic of the Congo",
            "Denmark",
            "Dominica",
            "Dominican Republic",
            "Egypt",
            "England",
            "Equatorial Guinea",
            "Estonia",
            "Finland",
            "France",
            "Gabon",
            "Gambia",
            "Georgia",
            "Georgia",
            "Germany",
            "Ghana",
            "Greece",
            "Grenada",
            "Guatemala",
            "Guinea-Bissau",
            "Guinea",
            "Guyana",
            "Haiti",
            "Honduras",
            "Iceland",
            "Ireland",
            "Ireland",
            "Israel",
            "Italy",
            "Ivory Coast",
            "Jamaica",
            "Latvia",
            "Lebanon",
            "Liberia",
            "Libya",
            "Lithuania",
            "Malta",
            "Mauritania",
            "Mexico",
            "Monaco",
            "Montenegro",
            "Morocco",
            "Namibia",
            "Netherlands",
            "Nicaragua",
            "Nigeria",
            "Norway",
            "Palestine",
            "Panama",
            "Poland",
            "Portugal",
            "Republic of the Congo",
            "Romania",
            "Russia",
            "Russia",
            "Saint Kitts and Nevis",
            "Saint Lucia",
            "Saint Vincent and the Grenadines",
            "São Tomé and Príncipe",
            "Scotland",
            "Senegal",
            "Sierra Leone",
            "Slovenia",
            "South Africa",
            "Spain",
            "Suriname",
            "Svalbard",
            "Sweden",
            "Syria",
            "Togo",
            "Trinidad and Tobago",
            "Tunisia",
            "Turkey",
            "Turkey",
            "Ukraine",
            "United States",
            "Uruguay",
            "Venezuela", 
        ]
    },
    {
        area: "Indian Ocean",
        type: "ocean",
        neighbors: [
            "Australia",
            "Bahrain",
            "Bangladesh",
            "Comoros",
            "Djibouti",
            "East Timor",
            "Egypt",
            "Eritrea",
            "India",
            "Indonesia",
            "Iran",
            "Iraq",
            "Israel",
            "Jordan",
            "Kenya",
            "Kuwait",
            "Madagascar",
            "Malaysia",
            "Maldives",
            "Mauritius",
            "Mozambique",
            "Myanmar",
            "Oman",
            "Pakistan",
            "Qatar",
            "Saudi Arabia",
            "Seychelles",
            "Singapore",
            "Somalia",
            "South Africa",
            "Sri Lanka",
            "Sudan",
            "Tanzania",
            "Thailand",
            "United Arab Emirates",
            "Yemen", 
        ]
    },
    {
        area: "Abkhazia",
        type: "country",
        neighbors: [
            "Russia",
            "Georgia"
        ]
    },
    {
        area: "Afghanistan",
        type: "country",
        neighbors: [
            "China",
            "Iran",
            "Pakistan",
            "Tajikistan",
            "Turkmenistan",
            "Uzbekistan", 
        ]
    },
    {
        area: "Albania",
        type: "country",
        neighbors: [
            "Greece",
            "Kosovo",
            "North Macedonia",
            "Montenegro",
            "Atlantic Ocean", 
        ]
    },
    {
        area: "Algeria",
        type: "country",
        neighbors: [
            "Libya",
            "Mali",
            "Mauritania",
            "Morocco",
            "Niger",
            "Tunisia",
            "Western Sahara",
            "Atlantic Ocean", 
        ]
    },
    {
        area: "Andorra",
        type: "country",
        neighbors: [
            "France",
            "Spain"
        ]
    },
    {
        area: "Angola",
        type: "country",
        neighbors: [
            "Democratic Republic of the Congo",
            "Republic of the Congo",
            "Namibia",
            "Zambia",
            "Atlantic Ocean", 
        ]
    },
    {
        area: "Antigua and Barbuda",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Argentina",
        type: "country",
        neighbors: [
            "Bolivia",
            "Brazil",
            "Chile",
            "Paraguay",
            "Uruguay"
        ]
    },
    {
        area: "Armenia",
        type: "country",
        neighbors: [
            "Azerbaijan",
            "Georgia",
            "Iran",
            "Turkey"
        ]
    },
    {
        area: "Australia",
        type: "country",
        neighbors: [
            "Pacific Ocean",
            "Indian Ocean"
        ]
    },
    {
        area: "Austria",
        type: "country",
        neighbors: [
            "Czech Republic",
            "Germany",
            "Hungary",
            "Italy",
            "Liechtenstein",
            "Slovakia",
            "Slovenia",
            "Switzerland", 
        ]
    },
    {
        area: "Azerbaijan",
        type: "country",
        neighbors: [
            "Armenia",
            "Georgia",
            "Iran",
            "Russia",
            "Turkey"
        ]
    },
    {
        area: "Bahamas",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Bahrain",
        type: "country",
        neighbors: [
            "Indian Ocean"
        ]
    },
    {
        area: "Bangladesh",
        type: "country",
        neighbors: [
            "India",
            "Myanmar",
            "Indian Ocean"
        ]
    },
    {
        area: "Barbados",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Belarus",
        type: "country",
        neighbors: [
            "Latvia",
            "Lithuania",
            "Poland",
            "Russia",
            "Ukraine"
        ]
    },
    {
        area: "Belgium",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "France",
            "Germany",
            "Luxembourg",
            "Netherlands", 
        ]
    },
    {
        area: "Belize",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Guatemala",
            "Mexico"
        ]
    },
    {
        area: "Benin",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Burkina Faso",
            "Niger",
            "Nigeria",
            "Togo"
        ]
    },
    {
        area: "Bermuda",
        type: "special",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Bhutan",
        type: "country",
        neighbors: [
            "China",
            "India"
        ]
    },
    {
        area: "Bolivia",
        type: "country",
        neighbors: [
            "Argentina",
            "Brazil",
            "Chile",
            "Paraguay",
            "Peru"
        ]
    },
    {
        area: "Bosnia and Herzegovina",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Croatia",
            "Montenegro",
            "Serbia"
        ]
    },
    {
        area: "Botswana",
        type: "country",
        neighbors: [
            "Namibia",
            "South Africa",
            "Zambia",
            "Zimbabwe"
        ]
    },
    {
        area: "Brazil",
        type: "country",
        neighbors: [
            "Argentina",
            "Atlantic Ocean",
            "Bolivia",
            "Colombia",
            "French Guiana",
            "Guyana",
            "Paraguay",
            "Peru",
            "Suriname",
            "Uruguay",
            "Venezuela", 
        ]
    },
    {
        area: "Brunei",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Bulgaria",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Greece",
            "North Macedonia",
            "Romania",
            "Serbia",
            "Turkey", 
        ]
    },
    {
        area: "Burkina Faso",
        type: "country",
        neighbors: [
            "Benin",
            "Côte d'Ivoire",
            "Ghana",
            "Mali",
            "Niger",
            "Togo"
        ]
    },
    {
        area: "Burundi",
        type: "country",
        neighbors: [
            "Democratic Republic of the Congo",
            "Rwanda",
            "Tanzania"
        ]
    },
    {
        area: "Cambodia",
        type: "country",
        neighbors: [
            "Laos",
            "Pacific Ocean",
            "Thailand",
            "Vietnam"
        ]
    },
    {
        area: "Cameroon",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Central African Republic",
            "Chad",
            "Equatorial Guinea",
            "Gabon",
            "Nigeria",
            "Republic of the Congo", 
        ]
    },
    {
        area: "Canada",
        type: "country",
        neighbors: [
            "Arctic Ocean",
            "Atlantic Ocean",
            "Pacific Ocean",
            "United States", 
        ]
    },
    {
        area: "Cape Verde",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Central African Republic",
        type: "country",
        neighbors: [
            "Cameroon",
            "Chad",
            "Democratic Republic of the Congo",
            "Republic of the Congo",
            "South Sudan",
            "Sudan", 
        ]
    },
    {
        area: "Chad",
        type: "country",
        neighbors: [
            "Cameroon",
            "Central African Republic",
            "Libya",
            "Niger",
            "Nigeria",
            "Sudan", 
        ]
    },
    {
        area: "Chile",
        type: "country",
        neighbors: [
            "Argentina",
            "Atlantic Ocean",
            "Bolivia",
            "Pacific Ocean",
            "Peru", 
        ]
    },
    {
        area: "China",
        type: "country",
        neighbors: [
            "Afghanistan",
            "Bhutan",
            "Hong Kong",
            "India",
            "Kazakhstan",
            "Kyrgyzstan",
            "Laos",
            "Macau",
            "Mongolia",
            "Myanmar",
            "Nepal",
            "North Korea",
            "Pacific Ocean",
            "Pakistan",
            "Russia",
            "Tajikistan",
            "Vietnam", 
        ]
    },
    {
        area: "Colombia",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Brazil",
            "Ecuador",
            "Pacific Ocean",
            "Panama",
            "Peru",
            "Venezuela", 
        ]
    },
    {
        area: "Comoros",
        type: "country",
        neighbors: [
            "Indian Ocean"
        ]
    },
    {
        area: "Democratic Republic of the Congo",
        type: "country",
        neighbors: [
            "Angola",
            "Atlantic Ocean",
            "Burundi",
            "Central African Republic",
            "Republic of the Congo",
            "Rwanda",
            "South Sudan",
            "Tanzania",
            "Uganda",
            "Zambia", 
        ]
    },
    {
        area: "Republic of the Congo",
        type: "country",
        neighbors: [
            "Angola",
            "Cameroon",
            "Central African Republic",
            "Democratic Republic of the Congo",
            "Gabon", 
        ]
    },
    {
        area: "Costa Rica",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Nicaragua",
            "Pacific Ocean",
            "Panama"
        ]
    },
    {
        area: "Côte d'Ivoire",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Burkina Faso",
            "Ghana",
            "Guinea",
            "Liberia",
            "Mali", 
        ]
    },
    {
        area: "Croatia",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Bosnia and Herzegovina",
            "Hungary",
            "Montenegro",
            "Serbia",
            "Slovenia", 
        ]
    },
    {
        area: "Cuba",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Cyprus",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Czech Republic",
        type: "country",
        neighbors: [
            "Austria",
            " Germany",
            "Poland",
            " Slovakia"
        ]
    },
    {
        area: "Denmark",
        type: "country",
        neighbors: [
            "Germany",
            "Atlantic Ocean"
        ]
    },
    {
        area: "Djibouti",
        type: "country",
        neighbors: [
            "Eritrea",
            "Ethiopia",
            "Indian Ocean",
            "Somaliland"
        ]
    },
    {
        area: "Dominica",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Dominican Republic",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Haiti"
        ]
    },
    {
        area: "Easter Island",
        type: "special",
        neighbors: [
            "Pacific Ocean"
        ],
        objects: [
            "A moai statue",
            "The immunosuppressant drug sirolimus"
        ]
    },
    {
        area: "East Timor",
        type: "country",
        neighbors: [
            "Indonesia",
            "Indian Ocean",
            "Pacific Ocean"
        ]
    },
    {
        area: "Ecuador",
        type: "country",
        neighbors: [
            "Colombia",
            "Pacific Ocean",
            "Peru"
        ]
    },
    {
        area: "Egypt",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Gaza Strip",
            "Indian Ocean",
            "Israel",
            "Libya",
            "Sudan", 
        ]
    },
    {
        area: "El Salvador",
        type: "country",
        neighbors: [
            "Guatemala",
            "Honduras",
            "Pacific Ocean"
        ]
    },
    {
        area: "England",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Scotland",
            "Wales"
        ]
    },
    {
        area: "Equatorial Guinea",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Cameroon",
            "Gabon"
        ]
    },
    {
        area: "Eritrea",
        type: "country",
        neighbors: [
            "Djibouti",
            "Ethiopia",
            "Indian Ocean",
            "Sudan"
        ]
    },
    {
        area: "Estonia",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Latvia",
            "Russia"
        ]
    },
    {
        area: "Eswatini",
        type: "country",
        neighbors: [
            "Mozambique",
            "South Africa"
        ]
    },
    {
        area: "Ethiopia",
        type: "country",
        neighbors: [
            "Djibouti",
            "Eritrea",
            "Kenya",
            "Somalia",
            "South Sudan",
            "Sudan", 
        ]
    },
    {
        area: "Fiji",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Finland",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Norway",
            "Sweden",
            "Russia"
        ]
    },
    {
        area: "France",
        type: "country",
        neighbors: [
            "Andorra",
            "Atlantic Ocean",
            "Belgium",
            "Germany",
            "Italy",
            "Luxembourg",
            "Monaco",
            "Spain",
            "Switzerland", 
        ]
    },
    {
        area: "Gabon",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Cameroon",
            "Equatorial Guinea",
            "Republic of the Congo", 
        ]
    },
    {
        area: "Gambia",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Senegal"
        ]
    },
    {
        area: "Georgia",
        type: "country",
        neighbors: [
            "Abkhazia",
            "Armenia",
            "Atlantic Ocean",
            "Azerbaijan",
            "Russia",
            "South Ossetia",
            "Turkey", 
        ]
    },
    {
        area: "Germany",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Austria",
            "Belgium",
            "Czech Republic",
            "Denmark",
            "France",
            "Luxembourg",
            "Netherlands",
            "Poland",
            "Switzerland", 
        ]
    },
    {
        area: "Ghana",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Burkina Faso",
            "Côte d'Ivoire",
            "Togo"
        ]
    },
    {
        area: "Greece",
        type: "country",
        neighbors: [
            "Albania",
            "Atlantic Ocean",
            "Bulgaria",
            "North Macedonia",
            "Turkey", 
        ]
    },
    {
        area: "Greenland",
        type: "country",
        neighbors: [
            "Arctic Ocean",
            "Atlantic Ocean"
        ]
    },
    {
        area: "Grenada",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Guatemala",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Belize",
            "El Salvador",
            "Honduras",
            "Mexico",
            "Pacific Ocean", 
        ]
    },
    {
        area: "Guinea",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Côte d'Ivoire",
            "Guinea-Bissau",
            "Liberia",
            "Mali",
            "Senegal",
            "Sierra Leone", 
        ]
    },
    {
        area: "Guinea-Bissau",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Guinea",
            "Senegal"
        ]
    },
    {
        area: "Guyana",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Brazil",
            "Suriname",
            "Venezuela"
        ]
    },
    {
        area: "Haiti",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Dominican Republic"
        ]
    },
    {
        area: "Honduras",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "El Salvador",
            "Guatemala",
            "Nicaragua",
            "Pacific Ocean", 
        ]
    },
    {
        area: "Hong Kong",
        type: "special",
        neighbors: [
            "China",
            "Pacific Ocean"
        ]
    },
    {
        area: "Hungary",
        type: "country",
        neighbors: [
            "Austria",
            "Croatia",
            "Romania",
            "Serbia",
            "Slovakia",
            "Slovenia",
            "Ukraine", 
        ]
    },
    {
        area: "Iceland",
        type: "country",
        neighbors: [
            "Arctic Ocean",
            "Atlantic Ocean"
        ]
    },
    {
        area: "India",
        type: "country",
        neighbors: [
            "Bangladesh",
            "Bhutan",
            "China",
            "Indian Ocean",
            "Myanmar",
            "Nepal",
            "Pakistan",
            "Sri Lanka", 
        ]
    },
    {
        area: "Indonesia",
        type: "country",
        neighbors: [
            "East Timor",
            "Indian Ocean",
            "Malaysia",
            "Pacific Ocean",
            "Papua New Guinea", 
        ]
    },
    {
        area: "Iran",
        type: "country",
        neighbors: [
            "Afghanistan",
            "Armenia",
            "Azerbaijan",
            "Indian Ocean",
            "Iraq",
            "Pakistan",
            "Turkey",
            "Turkmenistan", 
        ]
    },
    {
        area: "Iraq",
        type: "country",
        neighbors: [
            "Indian Ocean",
            "Iran",
            "Jordan",
            "Kuwait",
            "Saudi Arabia",
            "Syria",
            "Turkey", 
        ]
    },
    {
        area: "Ireland",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Israel",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Egypt",
            "Indian Ocean",
            "Jordan",
            "Lebanon",
            "Syria", 
        ]
    },
    {
        area: "Italy",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Austria",
            "France",
            "San Marino",
            "Slovenia",
            "Switzerland",
            "Vatican City", 
        ]
    },
    {
        area: "Jamaica",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Japan",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Jordan",
        type: "country",
        neighbors: [
            "Indian Ocean",
            "Iraq",
            "Israel",
            "Saudi Arabia",
            "Syria"
        ]
    },
    {
        area: "Kazakhstan",
        type: "country",
        neighbors: [
            "China",
            "Kyrgyzstan",
            "Russia",
            "Turkmenistan",
            "Uzbekistan"
        ]
    },
    {
        area: "Kenya",
        type: "country",
        neighbors: [
            "Ethiopia",
            "Indian Ocean",
            "Somalia",
            "South Sudan",
            "Tanzania",
            "Uganda", 
        ]
    },
    {
        area: "Kiribati",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "North Korea",
        type: "country",
        neighbors: [
            "China",
            "Pacific Ocean",
            "South Korea",
            "Russia"
        ]
    },
    {
        area: "South Korea",
        type: "country",
        neighbors: [
            "North Korea",
            "Pacific Ocean"
        ]
    },
    {
        area: "Kosovo",
        type: "country",
        neighbors: [
            "Albania",
            "Montenegro",
            "North Macedonia",
            "Serbia"
        ]
    },
    {
        area: "Kuwait",
        type: "country",
        neighbors: [
            "Indian Ocean",
            "Iraq",
            "Saudi Arabia"
        ]
    },
    {
        area: "Kyrgyzstan",
        type: "country",
        neighbors: [
            "China",
            "Kazakhstan",
            "Tajikistan",
            "Uzbekistan"
        ]
    },
    {
        area: "Laos",
        type: "country",
        neighbors: [
            "Cambodia",
            "China",
            "Myanmar",
            "Thailand",
            "Vietnam"
        ]
    },
    {
        area: "Latvia",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Belarus",
            "Estonia",
            "Lithuania",
            "Russia"
        ]
    },
    {
        area: "Lebanon",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Israel",
            "Syria"
        ]
    },
    {
        area: "Lesotho",
        type: "country",
        neighbors: [
            "South Africa"
        ]
    },
    {
        area: "Liberia",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Guinea",
            "Côte d'Ivoire",
            "Sierra Leone"
        ]
    },
    {
        area: "Libya",
        type: "country",
        neighbors: [
            "Algeria",
            "Atlantic Ocean",
            "Chad",
            "Egypt",
            "Niger",
            "Sudan",
            "Tunisia", 
        ]
    },
    {
        area: "Liechtenstein",
        type: "country",
        neighbors: [
            "Austria",
            "Switzerland"
        ]
    },
    {
        area: "Lithuania",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Belarus",
            "Latvia",
            "Poland",
            "Russia"
        ]
    },
    {
        area: "Luxembourg",
        type: "country",
        neighbors: [
            "Belgium",
            "France",
            "Germany"
        ]
    },
    {
        area: "Macau",
        type: "country",
        neighbors: [
            "China",
            "Pacific Ocean"
        ]
    },
    {
        area: "Madagascar",
        type: "country",
        neighbors: [
            "Indian Ocean"
        ]
    },
    {
        area: "Madeira",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Malawi",
        type: "country",
        neighbors: [
            "Mozambique",
            "Tanzania",
            "Zambia"
        ]
    },
    {
        area: "Malaysia",
        type: "country",
        neighbors: [
            "Brunei",
            "Indian Ocean",
            "Indonesia",
            "Pacific Ocean",
            "Thailand", 
        ]
    },
    {
        area: "Maldives",
        type: "country",
        neighbors: [
            "Indian Ocean"
        ]
    },
    {
        area: "Mali",
        type: "country",
        neighbors: [
            "Algeria",
            "Burkina Faso",
            "Côte d'Ivoire",
            "Guinea",
            "Mauritania",
            "Niger",
            "Senegal", 
        ]
    },
    {
        area: "Malta",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Marshall Islands",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Mauritania",
        type: "country",
        neighbors: [
            "Algeria",
            "Atlantic Ocean",
            "Mali",
            "Senegal",
            "Western Sahara", 
        ]
    },
    {
        area: "Mauritius",
        type: "country",
        neighbors: [
            "Indian Ocean"
        ]
    },
    {
        area: "Mexico",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Belize",
            "Guatemala",
            "Pacific Ocean",
            "United States", 
        ]
    },
    {
        area: "Federated States of Micronesia",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Moldova",
        type: "country",
        neighbors: [
            "Romania",
            "Ukraine"
        ]
    },
    {
        area: "Monaco",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "France"
        ]
    },
    {
        area: "Mongolia",
        type: "country",
        neighbors: [
            "China",
            "Russia"
        ]
    },
    {
        area: "Montenegro",
        type: "country",
        neighbors: [
            "Albania",
            "Atlantic Ocean",
            "Bosnia and Herzegovina",
            "Croatia",
            "Kosovo",
            "Serbia", 
        ]
    },
    {
        area: "Morocco",
        type: "country",
        neighbors: [
            "Algeria",
            "Atlantic Ocean",
            "Western Sahara",
            "Spain"
        ]
    },
    {
        area: "Mozambique",
        type: "country",
        neighbors: [
            "Eswatini",
            "Indian Ocean",
            "Malawi",
            "South Africa",
            "Tanzania",
            "Zambia",
            "Zimbabwe", 
        ]
    },
    {
        area: "Myanmar",
        type: "country",
        neighbors: [
            "Bangladesh",
            "China",
            "India",
            "Indian Ocean",
            "Laos",
            "Thailand", 
        ]
    },
    {
        area: "Namibia",
        type: "country",
        neighbors: [
            "Angola",
            "Atlantic Ocean",
            "Botswana",
            "South Africa",
            "Zambia", 
        ]
    },
    {
        area: "Nauru",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Nepal",
        type: "country",
        neighbors: [
            "China",
            "India"
        ]
    },
    {
        area: "Netherlands",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Belgium",
            "Germany",
            "Saint Martin",
            "France", 
        ]
    },
    {
        area: "New Zealand",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Nicaragua",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Costa Rica",
            "Honduras",
            "Pacific Ocean"
        ]
    },
    {
        area: "Niger",
        type: "country",
        neighbors: [
            "Algeria",
            "Benin",
            "Burkina Faso",
            "Chad",
            "Libya",
            "Mali",
            "Nigeria", 
        ]
    },
    {
        area: "Nigeria",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Benin",
            "Cameroon",
            "Chad",
            "Niger"
        ]
    },
    {
        area: "North Macedonia",
        type: "country",
        neighbors: [
            "Albania",
            "Bulgaria",
            "Greece",
            "Kosovo",
            "Serbia"
        ]
    },
    {
        area: "Norway",
        type: "country",
        neighbors: [
            "Arctic Ocean",
            "Atlantic Ocean",
            "Finland",
            "Sweden",
            "Russia", 
        ]
    },
    {
        area: "Oman",
        type: "country",
        neighbors: [
            "Indian Ocean",
            "Saudi Arabia",
            "United Arab Emirates",
            "Yemen", 
        ]
    },
    {
        area: "Pakistan",
        type: "country",
        neighbors: [
            "Afghanistan",
            "India",
            "Indian Ocean",
            "Iran",
            "China"
        ]
    },
    {
        area: "Palau",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Palestine",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Egypt",
            "Israel",
            "Jordan"
        ]
    },
    {
        area: "Panama",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Colombia",
            "Costa Rica",
            "Pacific Ocean"
        ]
    },
    {
        area: "Papua New Guinea",
        type: "country",
        neighbors: [
            "Indonesia",
            "Pacific Ocean"
        ]
    },
    {
        area: "Paraguay",
        type: "country",
        neighbors: [
            "Argentina",
            "Bolivia",
            "Brazil"
        ]
    },
    {
        area: "Peru",
        type: "country",
        neighbors: [
            "Bolivia",
            "Brazil",
            "Chile",
            "Colombia",
            "Ecuador",
            "Pacific Ocean", 
        ]
    },
    {
        area: "Philippines",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Poland",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Belarus",
            "Czech Republic",
            "Germany",
            "Lithuania",
            "Russia",
            "Slovakia",
            "Ukraine", 
        ]
    },
    {
        area: "Portugal",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Spain"
        ]
    },
    {
        area: "Qatar",
        type: "country",
        neighbors: [
            "Indian Ocean",
            "Saudi Arabia"
        ]
    },
    {
        area: "Romania",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Bulgaria",
            "Hungary",
            "Moldova",
            "Serbia",
            "Ukraine", 
        ]
    },
    {
        area: "Russia",
        type: "country",
        neighbors: [
            "Abkhazia",
            "Arctic Ocean",
            "Atlantic Ocean",
            "Azerbaijan",
            "Belarus",
            "China",
            "Estonia",
            "Finland",
            "Georgia",
            "Kazakhstan",
            "Latvia",
            "Lithuania",
            "Mongolia",
            "North Korea",
            "Norway",
            "Pacific Ocean",
            "Poland",
            "South Ossetia",
            "Ukraine", 
        ]
    },
    {
        area: "Rwanda",
        type: "country",
        neighbors: [
            "Burundi",
            "Democratic Republic of the Congo",
            "Tanzania",
            "Uganda", 
        ]
    },
    {
        area: "Saint Kitts and Nevis",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Saint Lucia",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Saint Vincent and the Grenadines",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Samoa",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "San Marino",
        type: "country",
        neighbors: [
            "Italy"
        ]
    },
    {
        area: "São Tomé and Príncipe",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Saudi Arabia",
        type: "country",
        neighbors: [
            "Indian Ocean",
            "Iraq",
            "Jordan",
            "Kuwait",
            "Oman",
            "Qatar",
            "United Arab Emirates",
            "Yemen", 
        ]
    },
    {
        area: "Scotland",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "England"
        ]
    },
    {
        area: "Senegal",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Gambia",
            "Guinea-Bissau",
            "Guinea",
            "Mali",
            "Mauritania", 
        ]
    },
    {
        area: "Serbia",
        type: "country",
        neighbors: [
            "Bosnia and Herzegovina",
            "Bulgaria",
            "Croatia",
            "Hungary",
            "Kosovo",
            "Montenegro",
            "North Macedonia",
            "Romania", 
        ]
    },
    {
        area: "Seychelles",
        type: "country",
        neighbors: [
            "Indian Ocean"
        ]
    },
    {
        area: "Sierra Leone",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Guinea",
            "Liberia"
        ]
    },
    {
        area: "Singapore",
        type: "country",
        neighbors: [
            "Indian Ocean",
            "Pacific Ocean"
        ]
    },
    {
        area: "Slovakia",
        type: "country",
        neighbors: [
            "Austria",
            "Czech Republic",
            "Hungary",
            "Poland",
            "Ukraine"
        ]
    },
    {
        area: "Slovenia",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Austria",
            "Croatia",
            "Italy",
            "Hungary"
        ]
    },
    {
        area: "Solomon Islands",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Somalia",
        type: "country",
        neighbors: [
            "Djibouti",
            "Ethiopia",
            "Indian Ocean",
            "Kenya"
        ]
    },
    {
        area: "South Africa",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Botswana",
            "Eswatini",
            "Indian Ocean",
            "Lesotho",
            "Mozambique",
            "Namibia",
            "Zimbabwe", 
        ]
    },
    {
        area: "South Ossetia",
        type: "country",
        neighbors: [
            "Russia",
            "Georgia"
        ]
    },
    {
        area: "South Sudan",
        type: "country",
        neighbors: [
            "Central African Republic",
            "Democratic Republic of the Congo",
            "Ethiopia",
            "Kenya",
            "Sudan",
            "Uganda", 
        ]
    },
    {
        area: "Spain",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Andorra",
            "France",
            "Portugal",
            "Gibraltar",
            "Morocco", 
        ]
    },
    {
        area: "Sri Lanka",
        type: "country",
        neighbors: [
            "India",
            "Indian Ocean"
        ]
    },
    {
        area: "Sudan",
        type: "country",
        neighbors: [
            "Central African Republic",
            "Chad",
            "Egypt",
            "Eritrea",
            "Ethiopia",
            "Indian Ocean",
            "Libya",
            "South Sudan", 
        ]
    },
    {
        area: "Suriname",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Brazil",
            "French Guiana",
            "Guyana"
        ]
    },
    {
        area: "Svalbard",
        type: "special",
        neighbors: [
            "Atlantic Ocean",
            "Brazil",
            "French Guiana",
            "Guyana"
        ]
    },
    {
        area: "Sweden",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Finland",
            "Norway"
        ]
    },
    {
        area: "Switzerland",
        type: "country",
        neighbors: [
            "Austria",
            "France",
            "Germany",
            "Italy",
            "Liechtenstein"
        ]
    },
    {
        area: "Syria",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Iraq",
            "Israel",
            "Jordan",
            "Lebanon",
            "Turkey", 
        ]
    },
    {
        area: "Taiwan",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Tajikistan",
        type: "country",
        neighbors: [
            "Afghanistan",
            "China",
            "Kyrgyzstan",
            "Uzbekistan"
        ]
    },
    {
        area: "Tanzania",
        type: "country",
        neighbors: [
            "Burundi",
            "Democratic Republic of the Congo",
            "Indian Ocean",
            "Kenya",
            "Malawi",
            "Mozambique",
            "Rwanda",
            "Uganda",
            "Zambia", 
        ]
    },
    {
        area: "Tasmania",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Thailand",
        type: "country",
        neighbors: [
            "Cambodia",
            "Indian Ocean",
            "Laos",
            "Malaysia",
            "Myanmar",
            "Pacific Ocean", 
        ]
    },
    {
        area: "Togo",
        type: "country",
        neighbors: [
            "Benin",
            "Burkina Faso",
            "Ghana"
        ]
    },
    {
        area: "Tonga",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Trinidad and Tobago",
        type: "country",
        neighbors: [
            "Atlantic Ocean"
        ]
    },
    {
        area: "Tunisia",
        type: "country",
        neighbors: [
            "Algeria",
            "Libya"
        ]
    },
    {
        area: "Turkey",
        type: "country",
        neighbors: [
            "Armenia",
            "Atlantic Ocean",
            "Azerbaijan",
            "Bulgaria",
            "Georgia",
            "Greece",
            "Iran",
            "Iraq",
            "Syria", 
        ]
    },
    {
        area: "Turkmenistan",
        type: "country",
        neighbors: [
            "Afghanistan",
            "Iran",
            "Kazakhstan",
            "Uzbekistan"
        ]
    },
    {
        area: "Tuvalu",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Uganda",
        type: "country",
        neighbors: [
            "Democratic Republic of the Congo",
            "Kenya",
            "Rwanda",
            "South Sudan",
            "Tanzania", 
        ]
    },
    {
        area: "Ukraine",
        type: "country",
        neighbors: [
            "Belarus",
            "Hungary",
            "Moldova",
            "Poland",
            "Romania",
            "Russia",
            "Slovakia", 
        ]
    },
    {
        area: "United Arab Emirates",
        type: "country",
        neighbors: [
            "Indian Ocean",
            "Oman",
            "Saudi Arabia"
        ]
    },
    {
        area: "United States",
        type: "country",
        neighbors: [
            "Arctic Ocean",
            "Atlantic Ocean",
            "Canada",
            "Mexico",
            "Pacific Ocean", 
        ],
        objects: [
            "The Grand Canyon",
            "The Liberty Bell",
            "An idaho potato"
        ]
    },
    {
        area: "Uruguay",
        type: "country",
        neighbors: [
            "Argentina",
            "Atlantic Ocean",
            "Brazil"
        ]
    },
    {
        area: "Uzbekistan",
        type: "country",
        neighbors: [
            "Afghanistan",
            "Kazakhstan",
            "Kyrgyzstan",
            "Tajikistan",
            "Turkmenistan", 
        ]
    },
    {
        area: "Vanuatu",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ]
    },
    {
        area: "Vatican City",
        type: "country",
        neighbors: [
            "Italy"
        ]
    },
    {
        area: "Venezuela",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "Brazil",
            "Colombia",
            "Guyana"
        ]
    },
    {
        area: "Vietnam",
        type: "country",
        neighbors: [
            "Cambodia",
            "China",
            "Laos",
            "Pacific Ocean"
        ]
    },
    {
        area: "Wallis Island",
        type: "country",
        neighbors: [
            "Pacific Ocean"
        ],
        objects: [
            "Talietumu"
        ]
    },
    {
        area: "Wales",
        type: "country",
        neighbors: [
            "Atlantic Ocean",
            "England"
        ]
    },
    {
        area: "Western Sahara",
        type: "country",
        neighbors: [
            "Algeria",
            "Mauritania",
            "Morocco"
        ]
    },
    {
        area: "Yemen",
        type: "country",
        neighbors: [
            "Indian Ocean",
            "Oman",
            "Saudi Arabia"
        ]
    },
    {
        area: "Zambia",
        type: "country",
        neighbors: [
            "Angola",
            "Botswana",
            "Democratic Republic of the Congo",
            "Malawi",
            "Mozambique",
            "Namibia",
            "Tanzania",
            "Zimbabwe", 
        ]
    },
    {
        area: "Zimbabwe",
        type: "country",
        neighbors: [
            "Botswana",
            "Mozambique",
            "South Africa",
            "Zambia"
        ]
    }, 
];

},{"@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"ciiiV":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}]},["1Mq12","5HwUs"], "5HwUs", "parcelRequire94c2")

//# sourceMappingURL=index.d56a3cb1.js.map
