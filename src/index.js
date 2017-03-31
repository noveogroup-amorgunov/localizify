class Localizify {
  constructor() {
    this._locale = null;
    this._defaultLocale = null;
    this._localesList = [];
    this._messages = {};
  }

  /**
   * @return {String}
   */
  getLocale() {
    return this._locale;
  }

  /**
   * @param {String}
   * @param {Object} messages [description]
   */
  add(locale, messages = {}) {
    this._localesList.push(locale);
    this._messages[locale] = messages;
    return this;
  }

  /**
   * @param {String}
   */
  setDefaultLocale(locale) {
    if (this.isLocale(locale)) {
      this._defaultLocale = locale;
    }
    return this;
  }

  /**
   * @param {String}
   */
  setLocale(locale) {
    if (this.isLocale(locale)) {
      this._locale = locale;
      if (!this._defaultLocale) {
        this._defaultLocale = locale;
      }
    }
    return this;
  }

  /**
   * Check that locale exists
   * @param  {String}
   * @return {Boolean}
   */
  isLocale(locale) {
    return !!~this._localesList.indexOf(locale);
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
   * @return {String|false}
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
    foundTerms.forEach((term) => {
      if (data[term.replace(/[{}]/gi, '')]) {
        msg = msg.replace(term, data[term.replace(/[{}]/gi, '')]);
      }
    });

    return msg;
  }

  /**
   * @param  {String}
   * @param  {Object|null}
   * @return {String}
   */
  translate(message, data = {}) {
    const msgList = this._messages[this._locale];
    const defaultMsgList = this._messages[this._defaultLocale];

    if (msgList && msgList[message]) {
      return this._replaceData(msgList[message], data);
    } else if (defaultMsgList && defaultMsgList[message]) {
      return this._replaceData(defaultMsgList[message], data);
    }
    return this._replaceData(message, data);
  }

}

const localizify = new Localizify();
module.exports = localizify;
module.exports.t = localizify.translate.bind(localizify);
