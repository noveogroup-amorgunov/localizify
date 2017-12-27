/* global describe,it,beforeEach */
const expect = require('chai').expect;
const { Instance: Localizify } = require('../src/index');


const registerFrLocale = localizify => localizify.add('fr', { hello: 'Bonjour' }).setLocale('fr');
const registerFrLocaleWithScopeTranslations = localizify =>
  localizify.add('fr', 'bot', { hello: 'Bonjour, {name}' }).setLocale('fr');

describe('Localizify', () => {
  let localizify;

  beforeEach(() => {
    localizify = new Localizify();
  });

  describe('getLocale()', () => {
    it('should return \'en\' locale by default', () => {
      expect(localizify.getLocale()).to.be.equal('en');
    });

    it('should return current locale', () => {
      registerFrLocale(localizify);

      expect(localizify.getLocale()).to.be.equal('fr');
    });
  });

  describe('setLocale(locale)', () => {
    it('should set locale', () => {
      registerFrLocale(localizify);

      expect(localizify.getLocale()).to.be.equal('fr');
    });

    it('should not set locale if it already set', () => {
      let isChangedLocale = false;
      localizify.onLocaleChange(() => (isChangedLocale = true)); // eslint-disable-line
      localizify.setLocale('en');

      setTimeout(() => expect(isChangedLocale).to.be.equal(false), 0);
    });

    it('should not set locale if it is not registered', () => {
      let isChangedLocale = false;
      localizify.onLocaleChange(() => (isChangedLocale = true)); // eslint-disable-line
      localizify.setLocale('fr');

      setTimeout(() => expect(isChangedLocale).to.be.equal(false), 0);
    });
  });

  describe('isLocale(locale)', () => {
    it('should return true for \'en\' locale', () => {
      expect(localizify.isLocale('en')).to.be.equal(true);
    });

    it('should return true for registered locale', () => {
      registerFrLocale(localizify);
      expect(localizify.isLocale('fr')).to.be.equal(true);
    });

    it('should return false for not registered locale', () => {
      expect(localizify.isLocale('fr')).to.be.equal(false);
    });
  });

  describe('onLocaleChange(callback)', () => {
    it('should fire event if locale was changed', () => {
      let isChangedLocale = false;
      registerFrLocale(localizify);
      localizify.onLocaleChange(() => (isChangedLocale = true)); // eslint-disable-line
      localizify.setLocale('fr');
      setTimeout(() => expect(isChangedLocale).to.be.equal(true), 0);
    });
  });

  describe('onTranslationNotFound(callback)', () => {
    it('should fire event if translation not found', () => {
      let isTranslationNotFound = false;
      registerFrLocale(localizify);
      localizify.onLocaleChange(() => (isTranslationNotFound = true)); // eslint-disable-line
      localizify.translate('foo');
      setTimeout(() => expect(isTranslationNotFound).to.be.equal(true), 0);
    });
  });

  describe('add(locale, scope, translations)', () => {
    it('should register new locale', () => {
      registerFrLocale(localizify);
      expect(localizify.isLocale('fr')).to.be.equal(true);
    });

    it('should add translations', () => {
      registerFrLocale(localizify);
      expect(localizify.getStore().translations.fr).to.be.eql({ hello: 'Bonjour' });
    });

    it('should add translations to scope', () => {
      registerFrLocaleWithScopeTranslations(localizify);
      expect(localizify.getStore().normalizedKeys.fr).to.be.eql({ 'bot.hello': 'Bonjour, {name}' });
    });
  });

  describe('_isBrowser()', () => {
    it('should return false', () => {
      expect(localizify._isBrowser()).to.be.equal(false);
    });

    it('should return true if navigator exists', () => {
      global.navigator = true;
      expect(localizify._isBrowser()).to.be.equal(true);
      global.navigator = undefined;
    });
  });

  describe('detectLocale()', () => {
    it('should detect browser locale', () => {
      global.navigator = { languages: ['en-US', 'en'] };
      expect(localizify.detectLocale()).to.be.equal('en');
      global.navigator = undefined;
    });

    it('should detect locale by header \'Accept-Language\'', () => {
      const headers = { 'accept-language': 'en-US,en;q=0.8' };
      expect(localizify.detectLocale(headers['accept-language'])).to.be.equal('en');
    });

    it('should not detect locale if navigator.languages is not exist', () => {
      expect(localizify.detectLocale()).to.be.equal(false);
    });
  });

  describe('_replaceData(message, data)', () => {
    it('should replace values to translations in message', () => {
      expect(localizify._replaceData('Bonjour, {name}', { name: 'foo' })).to.be.equal('Bonjour, foo');
    });
  });

  describe('translate(key, data)', () => {
    it('should return translated message by key', () => {
      registerFrLocale(localizify);
      expect(localizify.translate('hello')).to.be.eql('Bonjour');
    });

    it('should throw exeption if key is not provided', () => {
      const wrap = () => localizify.translate();
      expect(wrap).to.Throw(Error);
    });

    it('should return same message if key is not found', () => {
      expect(localizify.translate('foo')).to.be.equal('foo');
    });

    it('should return same message with interpolation if key is not found', () => {
      expect(localizify.translate('hello, {name}', { name: 'foo' })).to.be.equal('hello, foo');
    });

    it('should fire event if key is not found', () => {
      let isTranslationNotFound = false;
      registerFrLocale(localizify);
      localizify.onLocaleChange(() => (isTranslationNotFound = true)); // eslint-disable-line
      localizify.translate('foo');
      setTimeout(() => expect(isTranslationNotFound).to.be.equal(true), 0);
    });
  });
});
