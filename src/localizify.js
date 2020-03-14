/* global navigator */
const EventEmitter = require('./event-emitter');
const normalize = require('./normalize');

const eventTypes = {
  CHANGE_LOCALE: 'CHANGE_LOCALE',
  TRANSLATION_NOT_FOUND: 'TRANSLATION_NOT_FOUND',
  REPLACED_DATA_NOT_FOUND: 'REPLACED_DATA_NOT_FOUND',
};

class Localizify extends EventEmitter {
  constructor() {
    super();

    this._store = {
      locale: 'en',
      localesList: ['en'],
      scope: null,
      translations: {},
      interpolations: {},
      normalizedKeys: {},
      separator: '.',
    };
  }

  /**
   * Get Localizify instance private data
   * @return {object}
   */
  getStore() {
    return this._store;
  }

  /**
   * Get selected locale
   * @return {string}
   */
  getLocale() {
    return this.getStore().locale;
  }

  /**
   * Change or set locale
   * @param {string}
   * @return {Localizify}
   */
  setLocale(locale) {
    const previous = this.getStore().locale;
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
  isLocale(locale) {
    return this.getStore().localesList.includes(locale);
  }

  /**
   * Add handler which will be executed when locale change
   * @param {function} callback
   * @return {function}
   */
  onLocaleChange(callback) {
    this.on(eventTypes.CHANGE_LOCALE, callback);
    return callback;
  }

  /**
   * Add handler which will be executed when translation is not found
   * @param {function} callback
   * @return {function}
   */
  onTranslationNotFound(callback) {
    this.on(eventTypes.TRANSLATION_NOT_FOUND, callback);
  }

  onReplacedDataNotFound(callback) {
    this.on(eventTypes.REPLACED_DATA_NOT_FOUND, callback);
  }

  /**
   * @param {string} scope
   * @return {Localizify}
   */
  setDefaultScope(scope) {
    this.getStore().scope = scope;
    return this;
  }

  /**
   * @return {Localizify}
   */
  clearDefaultScope() {
    this.getStore().scope = null;
    return this;
  }

  /**
   * @param {Object} translation
   * @return {Localizify}
   */
  registerInterpolations(translation) {
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

    store.translations[locale] = Object.assign({}, store.translations[locale], trans);
    store.normalizedKeys[locale] = Object.assign({}, store.normalizedKeys[locale], normalize(trans));

    return this;
  }

  /**
   * Detect, where is script running
   * @return {boolean}
   */
  _isBrowser() {
    return !(typeof module !== 'undefined' && module.exports) || typeof navigator !== 'undefined';
  }

  /**
   * Define user's language by browser or by request header language
   * @param  {string|false} _language
   * @return {*}
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
   * @param  {string}
   * @param  {object|null}
   * @return {string}
   */
  _replaceData(_msg, data) {
    let msg = _msg;
    const foundedTerms = msg.match(/\{(.*?)\}/gi) || [];
    foundedTerms.forEach((_term) => {
      const term = _term.replace(/[{}]/gi, '');

      const replacedTextCases = [
        data[term],
        this.getStore().interpolations[term],
        _term
      ];
      const replaceTo = replacedTextCases.find(value => typeof value !== 'undefined');

      if (replaceTo === _term) {
        this.emit(eventTypes.REPLACED_DATA_NOT_FOUND, _msg, _term, data);
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
  translate(key, data = {}) {
    if (!key) {
      throw new Error('"key" param is required');
    }

    const scope = data.scope || this.getStore().scope;
    const locale = (this.isLocale(data.locale) && data.locale) || this.getStore().locale;

    if (!locale) {
      throw new Error('Current locale is not defined');
    }

    const keys = this.getStore().normalizedKeys[locale];
    const normalizeKey = (scope ? `${scope}.` : '') + key;

    const hasTranslation = keys && keys[normalizeKey];

    if (!hasTranslation) {
      this.emit(eventTypes.TRANSLATION_NOT_FOUND, locale, key, scope);
    }

    return this._replaceData(hasTranslation ? keys[normalizeKey] : key, data);
  }
}

const localizify = new Localizify();
localizify.Instance = Localizify;
localizify.t = localizify.translate.bind(localizify);

module.exports = localizify;
