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
exports.Instance = exports.t = exports.Localizify = exports.EventTypes = void 0;
var utils_1 = require("./utils");
var event_emitter_1 = require("./event-emitter");
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
//# sourceMappingURL=localizify.js.map