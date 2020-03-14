(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["localizify"] = factory();
	else
		root["localizify"] = factory();
})((typeof window !== "undefined" ? window : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* global navigator */
var EventEmitter = __webpack_require__(2);

var normalize = __webpack_require__(3);

var eventTypes = {
  CHANGE_LOCALE: 'CHANGE_LOCALE',
  TRANSLATION_NOT_FOUND: 'TRANSLATION_NOT_FOUND',
  REPLACED_DATA_NOT_FOUND: 'REPLACED_DATA_NOT_FOUND'
};

var Localizify =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Localizify, _EventEmitter);

  function Localizify() {
    var _this;

    _classCallCheck(this, Localizify);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Localizify).call(this));
    _this._store = {
      locale: 'en',
      localesList: ['en'],
      scope: null,
      translations: {},
      interpolations: {},
      normalizedKeys: {},
      separator: '.'
    };
    return _this;
  }
  /**
   * Get Localizify instance private data
   * @return {object}
   */


  _createClass(Localizify, [{
    key: "getStore",
    value: function getStore() {
      return this._store;
    }
    /**
     * Get selected locale
     * @return {string}
     */

  }, {
    key: "getLocale",
    value: function getLocale() {
      return this.getStore().locale;
    }
    /**
     * Change or set locale
     * @param {string}
     * @return {Localizify}
     */

  }, {
    key: "setLocale",
    value: function setLocale(locale) {
      var previous = this.getStore().locale;

      if (this.isLocale(locale) && previous !== locale) {
        this.getStore().locale = locale;
        this.emit(eventTypes.CHANGE_LOCALE, locale, previous);
      }

      return this;
    }
    /**
     * Check that locale is registered
     * @param {string}
     * @return {boolean}
     */

  }, {
    key: "isLocale",
    value: function isLocale(locale) {
      return this.getStore().localesList.includes(locale);
    }
    /**
     * Add handler which will be executed when locale change
     * @param {function} callback
     * @return {function}
     */

  }, {
    key: "onLocaleChange",
    value: function onLocaleChange(callback) {
      this.on(eventTypes.CHANGE_LOCALE, callback);
      return callback;
    }
    /**
     * Add handler which will be executed when translation is not found
     * @param {function} callback
     * @return {function}
     */

  }, {
    key: "onTranslationNotFound",
    value: function onTranslationNotFound(callback) {
      this.on(eventTypes.TRANSLATION_NOT_FOUND, callback);
    }
  }, {
    key: "onReplacedDataNotFound",
    value: function onReplacedDataNotFound(callback) {
      this.on(eventTypes.REPLACED_DATA_NOT_FOUND, callback);
    }
    /**
     * @param {string} scope
     * @return {Localizify}
     */

  }, {
    key: "setDefaultScope",
    value: function setDefaultScope(scope) {
      this.getStore().scope = scope;
      return this;
    }
    /**
     * @return {Localizify}
     */

  }, {
    key: "clearDefaultScope",
    value: function clearDefaultScope() {
      this.getStore().scope = null;
      return this;
    }
    /**
     * @param {Object} translation
     * @return {Localizify}
     */

  }, {
    key: "registerInterpolations",
    value: function registerInterpolations(translation) {
      Object.assign(this.getStore().interpolations, translation);
      return this;
    }
    /**
     * Register new locale
     * @param {string}  locale
     * @param {string|object}  scopeOrTranslitions
     * @param {string|false} _translations
     * @return {Localizify}
     */

  }, {
    key: "add",
    value: function add(locale, scopeOrTranslitions) {
      var _translations = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var store = this.getStore();
      var trans = scopeOrTranslitions;

      if (_translations) {
        trans = {};
        trans[scopeOrTranslitions] = _translations;
      }

      if (!this.isLocale(locale)) {
        store.localesList.push(locale);
      }

      store.translations[locale] = Object.assign({}, store.translations[locale], trans);
      store.normalizedKeys[locale] = Object.assign({}, store.normalizedKeys[locale], normalize(trans));
      return this;
    }
    /**
     * Detect, where is script running
     * @return {boolean}
     */

  }, {
    key: "_isBrowser",
    value: function _isBrowser() {
      return !( true && module.exports) || typeof navigator !== 'undefined';
    }
    /**
     * Define user's language by browser or by request header language
     * @param  {string|false} _language
     * @return {*}
     */

  }, {
    key: "detectLocale",
    value: function detectLocale() {
      var _language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var language = _language;

      if (this._isBrowser() && !language) {
        // Different browsers have the user locale defined
        // on different fields on the `navigator` object, so we make sure to account
        // for these different by checking all of them
        language = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
      }

      if (!language) {
        return false;
      } // Split locales with a region code


      var languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
      return this.isLocale(languageWithoutRegionCode) ? languageWithoutRegionCode : false;
    }
    /**
     * @param  {string}
     * @param  {object|null}
     * @return {string}
     */

  }, {
    key: "_replaceData",
    value: function _replaceData(_msg, data) {
      var _this2 = this;

      var msg = _msg;
      var foundedTerms = msg.match(/\{(.*?)\}/gi) || [];
      foundedTerms.forEach(function (_term) {
        var term = _term.replace(/[{}]/gi, '');

        var replacedTextCases = [data[term], _this2.getStore().interpolations[term], _term];
        var replaceTo = replacedTextCases.find(function (value) {
          return typeof value !== 'undefined';
        });

        if (replaceTo === _term) {
          _this2.emit(eventTypes.REPLACED_DATA_NOT_FOUND, _msg, _term, data);
        }

        msg = msg.replace(_term, replaceTo);
      });
      return msg;
    }
    /**
     * @param  {string} key
     * @param  {object} data
     * @return {string}
     */

  }, {
    key: "translate",
    value: function translate(key) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!key) {
        throw new Error('"key" param is required');
      }

      var scope = data.scope || this.getStore().scope;
      var locale = this.isLocale(data.locale) && data.locale || this.getStore().locale;

      if (!locale) {
        throw new Error('Current locale is not defined');
      }

      var keys = this.getStore().normalizedKeys[locale];
      var normalizeKey = (scope ? "".concat(scope, ".") : '') + key;
      var hasTranslation = keys && keys[normalizeKey];

      if (!hasTranslation) {
        this.emit(eventTypes.TRANSLATION_NOT_FOUND, locale, key, scope);
      }

      return this._replaceData(hasTranslation ? keys[normalizeKey] : key, data);
    }
  }]);

  return Localizify;
}(EventEmitter);

var localizify = new Localizify();
localizify.Instance = Localizify;
localizify.t = localizify.translate.bind(localizify);
module.exports = localizify;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Very light event emitter
 * @class EventEmitter
 */
var EventEmitter =
/*#__PURE__*/
function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this._listeners = {};
  }
  /**
   * @param {string} event
   * @return {array<function>}
   */


  _createClass(EventEmitter, [{
    key: "getListeners",
    value: function getListeners(event) {
      return this._listeners[event] || [];
    }
    /**
     * @param {string} event
     * @param {function} listener
     * @return {function}
     */

  }, {
    key: "on",
    value: function on(event, listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('Listener must be a function');
      }

      var listeners = this.getListeners(event);

      if (!listeners.includes(listener)) {
        if (!this.hasListeners(event)) {
          this._listeners[event] = [];
        }

        this._listeners[event].push(listener);
      }

      return listener;
    }
    /**
     * @param {string} event
     * @param {function} listener
     * @return {EventEmitter}
     */

  }, {
    key: "off",
    value: function off(event, listener) {
      if (this.hasListeners(event)) {
        var listeners = this.getListeners(event);
        this._listeners[event] = listeners.filter(function (l) {
          return listener !== l;
        });
      }

      return this;
    }
    /**
     * @param {string} event
     * @param {...object} args
     * @return {EventEmitter}
     */

  }, {
    key: "emit",
    value: function emit(event) {
      var _this = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var listeners = this.getListeners(event);
      listeners.forEach(function (listener) {
        return listener.apply(_this, args);
      });
      return this;
    }
    /**
     * @param {string} event
     * @return {boolean}
     */

  }, {
    key: "hasListeners",
    value: function hasListeners(event) {
      var listeners = this.getListeners(event);
      return listeners.length > 0;
    }
  }]);

  return EventEmitter;
}();

module.exports = EventEmitter;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var isPlainObject = function isPlainObject(val) {
  return val !== null && Object.prototype.toString.call(val) === '[object Object]';
};

var isString = function isString(val) {
  return typeof val === 'string';
};
/**
 * Normalize not flatten object to one-level object
 * @param {*} object
 * @param {array} acc
 * @param {object} results
 */


var normalize = function normalize(object) {
  var acc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var results = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (isString(object)) {
    results[acc.join('.')] = object; // eslint-disable-line
  } else if (isPlainObject(object)) {
    Object.keys(object).forEach(function (key) {
      return normalize(object[key], _toConsumableArray(acc).concat([key]), results);
    });
  }

  return results;
};

module.exports = normalize;

/***/ })
/******/ ]);
});