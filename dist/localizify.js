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

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(1);
var event_emitter_1 = __webpack_require__(2);
var EventTypes;
(function (EventTypes) {
    EventTypes["ChangeLocale"] = "CHANGE_LOCALE";
    EventTypes["TranslationNotFound"] = "TRANSLATION_NOT_FOUND";
    EventTypes["ReplacedDataNotFound"] = "REPLACED_DATA_NOT_FOUND";
})(EventTypes = exports.EventTypes || (exports.EventTypes = {}));
var Localizify = /** @class */ (function (_super) {
    __extends(Localizify, _super);
    function Localizify() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.store = {
            locale: 'en',
            localesList: ['en'],
            scope: null,
            translations: {},
            interpolations: {},
            normalizedKeys: {},
            separator: '.',
        };
        return _this;
    }
    Localizify.prototype.getStore = function () {
        return this.store;
    };
    Localizify.prototype.getLocale = function () {
        return this.getStore().locale;
    };
    Localizify.prototype.setLocale = function (locale) {
        var previous = this.getStore().locale;
        if (this.isLocale(locale) && previous !== locale) {
            this.getStore().locale = locale;
            this.emit(EventTypes.ChangeLocale, locale, previous);
        }
        return this;
    };
    Localizify.prototype.isLocale = function (locale) {
        return this.getStore().localesList.indexOf(locale) !== -1;
    };
    Localizify.prototype.onLocaleChange = function (callback) {
        this.on(EventTypes.ChangeLocale, callback);
        return callback;
    };
    Localizify.prototype.onTranslationNotFound = function (callback) {
        this.on(EventTypes.TranslationNotFound, callback);
    };
    Localizify.prototype.onReplacedDataNotFound = function (callback) {
        this.on(EventTypes.ReplacedDataNotFound, callback);
    };
    Localizify.prototype.setDefaultScope = function (scope) {
        this.getStore().scope = scope;
        return this;
    };
    Localizify.prototype.clearDefaultScope = function () {
        this.getStore().scope = null;
        return this;
    };
    Localizify.prototype.registerInterpolations = function (translation) {
        Object.assign(this.getStore().interpolations, translation);
        return this;
    };
    /**
     * Register new locale
     */
    Localizify.prototype.add = function (locale, scopeOrTranslations, _translations) {
        var store = this.getStore();
        var trans = scopeOrTranslations;
        if (_translations) {
            trans = {};
            trans[scopeOrTranslations] = _translations;
        }
        if (!this.isLocale(locale)) {
            store.localesList.push(locale);
        }
        store.translations[locale] = __assign(__assign({}, store.translations[locale]), trans);
        store.normalizedKeys[locale] = __assign(__assign({}, store.normalizedKeys[locale]), utils_1.normalize(trans));
        return this;
    };
    /**
     * Define user's language by browser or by request header language
     */
    Localizify.prototype.detectLocale = function (_language) {
        var language = _language;
        if (utils_1.isBrowser() && !language) {
            // Different browsers have the user locale defined
            // on different fields on the `navigator` object, so we make sure to account
            // for these different by checking all of them
            language =
                (navigator.languages && navigator.languages[0]) ||
                    navigator.language ||
                    navigator.userLanguage;
        }
        if (!language) {
            return false;
        }
        // Split locales with a region code
        var languageWithoutRegionCode = language
            .toLowerCase()
            .split(/[_-]+/)[0];
        return this.isLocale(languageWithoutRegionCode)
            ? languageWithoutRegionCode
            : false;
    };
    Localizify.prototype.replaceData = function (_msg, data) {
        var _this = this;
        var msg = _msg;
        var terms = msg.match(/\{(.*?)\}/gi) || [];
        terms.forEach(function (_term) {
            var term = _term.replace(/[{}]/gi, '');
            var replacedTextCases = [
                data[term],
                _this.getStore().interpolations[term],
                _term,
            ];
            var replaceTo = replacedTextCases.find(function (value) { return typeof value !== 'undefined'; });
            if (replaceTo === _term) {
                _this.emit(EventTypes.ReplacedDataNotFound, _msg, _term, data);
            }
            msg = msg.replace(_term, replaceTo);
        });
        return msg;
    };
    Localizify.prototype.translate = function (key, data, translation) {
        if (data === void 0) { data = {}; }
        if (!key) {
            throw new Error('"key" param is required');
        }
        var l = data.locale, _a = data.scope, scope = _a === void 0 ? this.getStore().scope : _a;
        var locale = translation && this.getStore().localesList.includes(translation) ? translation : (this.isLocale(l) && l) || this.getStore().locale;
        if (!locale) {
            throw new Error('Current locale is not defined');
        }
        var keys = this.getStore().normalizedKeys[locale];
        var normalizeKey = (scope ? scope + "." : '') + key;
        var hasTranslation = keys && keys[normalizeKey];
        if (!hasTranslation) {
            this.emit(EventTypes.TranslationNotFound, locale, key, scope);
        }
        return this.replaceData(hasTranslation ? keys[normalizeKey] : key, data);
    };
    return Localizify;
}(event_emitter_1.EventEmitter));
exports.Localizify = Localizify;
exports.Instance = Localizify;
var localizify = new Localizify();
var t = localizify.translate.bind(localizify);
exports.t = t;
exports.default = localizify;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var isPlainObject = function (val) {
    return val !== null && Object.prototype.toString.call(val) === '[object Object]';
};
var isString = function (val) { return typeof val === 'string'; };
/**
 * Normalize not flatten object to one-level object
 */
exports.normalize = function (object, acc, results) {
    if (acc === void 0) { acc = []; }
    if (results === void 0) { results = {}; }
    if (isString(object)) {
        // eslint-disable-next-line no-param-reassign
        results[acc.join('.')] = object;
    }
    else if (isPlainObject(object)) {
        Object.keys(object).forEach(function (key) {
            exports.normalize(object[key], __spreadArrays(acc, [key]), results);
        });
    }
    return results;
};
/**
 * Detect, where is script running
 */
exports.isBrowser = function () {
    return typeof window !== 'undefined' &&
        window.document &&
        window.document.createElement;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.listeners = {};
    }
    EventEmitter.prototype.getListeners = function (event) {
        return this.listeners[event] || [];
    };
    EventEmitter.prototype.on = function (event, listener) {
        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function');
        }
        var listeners = this.getListeners(event);
        if (listeners.indexOf(listener) === -1) {
            if (!this.hasListeners(event)) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(listener);
        }
        return listener;
    };
    EventEmitter.prototype.off = function (event, listener) {
        if (this.hasListeners(event)) {
            var listeners = this.getListeners(event);
            this.listeners[event] = listeners.filter(function (l) { return listener !== l; });
        }
        return this;
    };
    EventEmitter.prototype.emit = function (event) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var listeners = this.getListeners(event);
        listeners.forEach(function (listener) { return listener.apply(_this, args); });
        return this;
    };
    EventEmitter.prototype.hasListeners = function (event) {
        var listeners = this.getListeners(event);
        return listeners.length > 0;
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;


/***/ })
/******/ ]);
});