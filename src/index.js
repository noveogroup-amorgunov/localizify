class Localizify {
  constructor() {
    this._locale = null;
    this._defaultLocale = null;
    this._localesList = [];
    this._messages = {};
  }

  getLocale() {
    return this._locale;
  }

  isLocale(locale) {
    return !!~this._localesList.indexOf(locale);
  }

  setDefaultLocale(locale) {
    if (this.isLocale(locale)) {
      this._defaultLocale = locale;
    }
    return this;
  }

  setLocale(locale) {
    if (this.isLocale(locale)) {
      this._locale = locale;
      if (!this._defaultLocale) {
        this._defaultLocale = locale;
      }
    }
    return this;
  }

  add(locale, messages) {
    this._localesList.push(locale);
    this._messages[locale] = messages;
    return this;
  }

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
