const EventEmitter = require('wolfy87-eventemitter');

function isPlainObject(val) {
  return val !== null && Object.prototype.toString.call(val) === '[object Object]';
}

function isString(val) {
  return typeof val === 'string';
}

function extend(target, ...args) {
  return Object.assign(target, ...args);
}

function normalize(object, acc = [], results = {}) {
  if (isString(object)) {
    results[acc.join('.')] = object;
  } else if (isPlainObject(object)) {
    Object.keys(object).forEach((key) => {
      normalize(object[key], [...acc, key], results);
    });
  }
  return results;
}

class Localizify extends EventEmitter {
  constructor() {
    super();
    this._store = {
      locale: null,
      localesList: [],
      scope: null,
      translations: {},
      interpolations: {},
      normalizedKeys: {},
      separator: '.',
    };
  }

  /**
   * @return {Object}
   */
  getStore() {
    return this._store;
  }

  /**
   * @return {String}
   */
  getLocale() {
    return this.getStore().locale;
  }

  /**
   * @param {String}
   */
  setLocale(locale) {
    const previous = this.getStore().locale;
    if (this.isLocale(locale) && previous !== locale) {
      this.getStore().locale = locale;
      this.emit('change-locale', locale, previous);
    }
    return this;
  }

  /**
   * @param  {Function} callback
   */
  onLocaleChange(callback) {
    this.addListener('change-locale', callback);
  }

  /**
   * @param  {Function} callback
   */
  onTranslationNotFound(callback) {
    this.addListener('translation-not-found', callback);
  }

  /**
   * @param {String} scope
   */
  setDefaultScope(scope) {
    this.getStore().scope = scope;
    return this;
  }

  clearDefaultScope() {
    this.getStore().scope = null;
    return this;
  }

  /**
   * @param  {String} translation
   */
  registerInterpolations(translation) {
    extend(this.getStore().interpolations, translation);
    return this;
  }

  /**
   * Check that locale exists
   * @param  {String}
   * @return {Boolean}
   */
  isLocale(locale) {
    return !!~this.getStore().localesList.indexOf(locale);
  }

  /**
   * [add description]
   * @param {String}  locale
   * @param {String|Object}  scopeOrTranslitions
   * @param {String|false} _translations
   */
  add(locale, scopeOrTranslitions, _translations = false) {
    const store = this.getStore();
    let trans = scopeOrTranslitions;

    if (_translations) {
      trans = {};
      trans[scopeOrTranslitions] = _translations;
    }

    if (!this.isLocale(locale)) {
      store.localesList.push(locale);
    }

    store.translations[locale] = extend({}, store.translations[locale], trans);
    store.normalizedKeys[locale] = extend({}, store.normalizedKeys[locale], normalize(trans));

    return this;
  }

  /**
   * Detect, where is script running
   * @return {Boolean}
   */
  _isBrowser() {
    return !(typeof module !== 'undefined' && module.exports);
  }

  /**
   * Define user's language by browser or by request header language
   * @param  {String|false} _language
   * @return {Mixed}
   */
  detectLocale(_language = false) {
    let language = _language;

    if (this._isBrowser() && !language) {
      // Different browsers have the user locale defined
      // on different fields on the `navigator` object, so we make sure to account
      // for these different by checking all of them
      language = (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        navigator.userLanguage;
    }

    if (!language) {
      return false;
    }

    // Split locales with a region code
    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
    return this.isLocale(languageWithoutRegionCode) ? languageWithoutRegionCode : false;
  }

  /**
   * @param  {String}
   * @param  {Object|null}
   * @return {String}
   */
  _replaceData(_msg, data) {
    let msg = _msg;
    const foundTerms = msg.match(/\{(.*?)\}/gi) || [];
    foundTerms.forEach((_term) => {
      const term = _term.replace(/[{}]/gi, '');
      if (data[term]) {
        msg = msg.replace(_term, data[term]);
      } else if (this.getStore().interpolations[term]) {
        msg = msg.replace(_term, this.getStore().interpolations[term]);
      }
    });

    return msg;
  }

  /**
   * @param  {String} key
   * @param  {Object} data
   * @return {String}
   */
  translate(key, data = {}) {
    if (!key) {
      throw new Error('Key param is required');
    }

    const scope = data.scope || this.getStore().scope;
    const locale = (this.isLocale(data.locale) && data.locale) || this.getStore().locale;

    if (!locale) {
      throw new Error('Current locale is not defined');
    }

    const keys = this.getStore().normalizedKeys[locale];
    const normalizeKey = (scope ? `${scope}.` : '') + key;

    if (keys[normalizeKey]) {
      return this._replaceData(keys[normalizeKey], data);
    }
    this.emit('translation-not-found', locale, key, scope);
    return this._replaceData(key, data);
  }
}

const localizify = new Localizify();
localizify.Instance = Localizify;
localizify.t = localizify.translate.bind(localizify);

module.exports = localizify;
