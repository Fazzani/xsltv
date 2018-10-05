// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
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
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"lang/english.js":[function(require,module,exports) {
var loadingtext = 'Loading';
var errortext = 'Error';
var filetext = 'File';
var notfoundtext = 'not found';
var preferenceslink = 'Preferences';
var datepickerbutton = 'Go!';
var earliertext = 'Earlier';
var latertext = 'Later';
var gridtab = 'Grid';
var displayhourslabel = 'Display Hours';
var displayhourshint = 'Select the number of hours to display.';
var autosizelabel = 'Automatic table size';
var autosizehint = 'Check to automatically select a table width based on number of columns. Uncheck to enable the next field.';
var tablewidthlabel = 'Table width (in pixels)';
var tablewidthhint = 'Specify the width of the table in pixels. Check the above box to set this automatically.';
var offsetminuteslabel = 'Start with next hour after';
var offsetminuteshint = 'Set the minutes portion of the time after which the grid will start with the next hour on initial load.';
var refreshonthelabel = 'Refresh every hour at';
var refreshonthehint = 'XSLTv can automatically refresh the listings every hour to keep the grid up-to-date, if the browser is kept open. Select the time each hour to perform the refresh.';
var norefreshoption = 'Do not refresh';
var timebarfrequencylabel = 'Time Bar Frequency';
var timebarfrequencyhint = 'How often to repeat the time header row.';
var toponlyoption = 'Top Line Only';
var popupstab = 'Popups';
var channelpopupslabel = 'Channel Popups';
var channelpopupshint = 'Check to enable the popups when the mouse is over the channel names.';
var descriptionpopupslabel = 'Description Popups';
var descriptionpopupshint = 'Check to enable the popups when the mouse is over a program.';
var popupdelaylabel = 'Popup Delay (in ms)';
var popupdelayhint = 'Set the delay in milliseconds before popups will appear. Set at 0 to disable delay.';
var popuptimeslabel = 'Times';
var popuptimeshint = 'Check to show start and end times in the program popups.';
var popupratinglabel = 'Rating';
var popupratinghint = 'Check to show MPAA ratings in the program popups.';
var popupsubtitlelabel = 'Subtitle';
var popupsubtitlehint = 'Check to show program subtitles in the program popups.';
var popupdescriptionlabel = 'Description';
var popupdescriptionhint = 'Check to show program descriptions in the program popups.';
var popupdatelabel = 'Date';
var popupdatehint = 'Check to show dates in the program popups. Dates are either release dates for movies or first-aired dates for shows.';
var popupcategorieslabel = 'Categories';
var popupcategorieshint = 'Check to show show categories or genres in the program popups.';
var popupstarratinglabel = 'Star Rating';
var popupstarratinghint = 'Check to show a graphical star rating in the program popups.';
var localoptionstab = 'Local Options';
var languagelabel = 'Language';
var fixgapslabel = 'Fix gaps in listings';
var fixgapshint = 'Check to enable gap-detection in listings which are not contiguous. This option requires listings to be sorted with --by-channel to work. This option will cause listings to load much more slowly, so do not check unnecessarily.';
var fixgapsconfirm = 'To fill gaps in listings, please ensure the XML file has been sorted with the --by-channel option!';
var absoluteiconslabel = 'Absolute icon references';
var absoluteiconshint = 'XSLTv looks for channel icons in an \'icons\' directory. Check this box if your xml file contains absolute url references to icons.';
var dayfirstlabel = 'Display day first in dates';
var dayfirsthint = 'Check this box to show dates in dd/mm/yyyy format. Uncheck for mm/dd/yyyy format.';
var grabberlabel = 'Grabber: tv_grab_';
var grabberhint = 'Select your grabber to apply localized channel-name settings.';
var otheroptionstab = 'Other Options';
var loadonclicklabel = 'On click:';
var loadonclicknothing = 'Do Nothing';
var loadonclickIMDB = 'Search IMDB';
var loadonclickURL = 'URL in XML';
var categorycolorslabel = 'Category Highlighting';
var categorycolorshint = 'Select to enable category highlighting (colors must be defined in CSS files). Deselect for a small speed improvement. This is separate from the ratings-based highlighting.';
var dailyfileslabel = 'Use daily files';
var dailyfileshint = 'Select to use daily files in the format YYYYMMDD.xml instead of a single tv.xml file.';
var highlightclickablelabel = 'Highlight linked programs';
var highlightclickablehint = 'Highlight programs which are linked to a URL (set above). The type of highlighting depends on the stylesheet. It is recommended to disable this if all programs are to be links, or if none are.';
var highlightmovieslabel = 'Highlight movies rated at or over:';
var highlightmovieshint = 'Highlight movies rated at or over this number of stars. The type of highlighting depends on the stylesheet, but is generally a brighter color. This is separate from the category highlighting below.';
var highlightnewlabel = 'Highlight new shows';
var highlightnewhint = 'Highlight shows which are airing for the first time. The highlighting is generally a darker or thicker border.';
var printdateslabel = 'Show movie release dates';
var printdateshint = 'Show movie release dates in the grid. This is separate from the dates in the popup, and only applies to movies.';
var twelvehourlabel = 'Use twelve-hour clock';
var twelvehourhint = 'Use twelve-hour (with AM and PM) instead of twenty-four-hour clock.';
var showclocklabel = 'Show clock in upper right';
var showclockhint = 'Check to show current time and date in the top right of page.';
var showbarclocklabel = 'Show clock in top bar';
var showbarclockhint = 'Check to show current time in the top bar.';
var reloadbutton = 'Reload';
var monthnames = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
var shortmonthnames = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
var daynames = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
var dayletters = new Array('S', 'M', 'T', 'W', 'T', 'F', 'S');
var alllabel = 'All';
var nonelabel = 'None';
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55367" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","lang/english.js"], null)
//# sourceMappingURL=/english.9eaa270b.map