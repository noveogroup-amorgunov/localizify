"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var localizify_1 = require("../src/localizify");
var registerFrLocale = function (localizify) {
    localizify.add('fr', { hello: 'Bonjour' }).setLocale('fr');
};
var registerFrLocaleWithScopeTranslations = function (localizify) {
    localizify.add('fr', 'bot', { hello: 'Bonjour, {name}' }).setLocale('fr');
};
describe('Localizify', function () {
    var localizify;
    beforeEach(function () {
        localizify = new localizify_1.Localizify();
    });
    describe('getLocale', function () {
        it("should return 'en' locale by default", function () {
            expect(localizify.getLocale()).toEqual('en');
        });
        it('should return current locale', function () {
            registerFrLocale(localizify);
            expect(localizify.getLocale()).toEqual('fr');
        });
    });
    describe('setLocale', function () {
        it('should set locale', function () {
            registerFrLocale(localizify);
            expect(localizify.getLocale()).toEqual('fr');
        });
        it('should not set locale if it already set', function (done) {
            var callback = jest.fn();
            localizify.onLocaleChange(callback);
            localizify.setLocale('en');
            process.nextTick(function () {
                expect(callback).toHaveBeenCalledTimes(0);
                done();
            });
        });
        it('should not set locale if it is not registered', function (done) {
            var callback = jest.fn();
            localizify.onLocaleChange(callback);
            localizify.setLocale('fr');
            process.nextTick(function () {
                expect(callback).toHaveBeenCalledTimes(0);
                done();
            });
        });
    });
    describe('isLocale', function () {
        it("should return true for 'en' locale", function () {
            expect(localizify.isLocale('en')).toBeTruthy();
        });
        it('should return true for registered locale', function () {
            registerFrLocale(localizify);
            expect(localizify.isLocale('fr')).toBeTruthy();
        });
        it('should return false for not registered locale', function () {
            expect(localizify.isLocale('fr')).toBeFalsy();
        });
    });
    describe('onLocaleChange', function () {
        it('should fire event if locale was changed', function (done) {
            registerFrLocale(localizify);
            var callback = jest.fn();
            localizify.onLocaleChange(callback);
            localizify.setLocale('en');
            localizify.setLocale('fr');
            process.nextTick(function () {
                expect(callback).toHaveBeenCalledTimes(2);
                expect(callback).toHaveBeenLastCalledWith('fr', 'en');
                done();
            });
        });
    });
    describe('onTranslationNotFound', function () {
        it('should fire event if translation not found', function (done) {
            registerFrLocale(localizify);
            var callback = jest.fn();
            localizify.onTranslationNotFound(callback);
            localizify.translate('foo');
            process.nextTick(function () {
                expect(callback).toHaveBeenCalledWith('fr', 'foo', null);
                done();
            });
        });
    });
    describe('add', function () {
        it('should register new locale', function (done) {
            registerFrLocale(localizify);
            process.nextTick(function () {
                expect(localizify.isLocale('fr')).toBeTruthy();
                done();
            });
        });
        it('should add translations', function () {
            registerFrLocale(localizify);
            expect(localizify.getStore().translations.fr).toEqual({
                hello: 'Bonjour',
            });
        });
        it('should add translations to scope', function () {
            registerFrLocaleWithScopeTranslations(localizify);
            expect(localizify.getStore().normalizedKeys.fr).toEqual({
                'bot.hello': 'Bonjour, {name}',
            });
        });
    });
    describe('detectLocale', function () {
        it('should detect browser locale', function () {
            global.navigator = { languages: ['en-US', 'en'] };
            expect(localizify.detectLocale()).toEqual('en');
            global.navigator = undefined;
        });
        it("should detect locale by header 'Accept-Language'", function () {
            var headers = { 'accept-language': 'en-US,en;q=0.8' };
            expect(localizify.detectLocale(headers['accept-language'])).toEqual('en');
        });
        it('should not detect locale if navigator.languages is not exist', function () {
            var originalCreateElement = window.document.createElement;
            window.document.createElement = undefined;
            expect(localizify.detectLocale()).toBeFalsy();
            // cleanup
            window.document.createElement = originalCreateElement;
        });
    });
    describe('replaceData', function () {
        it('should replace values to translations in message', function () {
            // @ts-ignore test private method
            var actual = localizify.replaceData('Bonjour, {name}', {
                name: 'foo',
            });
            expect(actual).toEqual('Bonjour, foo');
        });
        it('should replace data to negative values except undefined', function () {
            var data = {
                count: 0,
                name: '',
                mounted: false,
                item: null,
            };
            // @ts-ignore test private method
            var actual = localizify.replaceData('{count}, {name}, {mounted}, {item}', data);
            var expected = '0, , false, null';
            expect(actual).toEqual(expected);
        });
        it('should fire event if replaced data is not passed', function (done) {
            var callback = jest.fn();
            localizify.onReplacedDataNotFound(callback);
            // @ts-ignore test private method
            localizify.replaceData('My name is {name}', {});
            process.nextTick(function () {
                expect(callback).toHaveBeenCalledWith('My name is {name}', '{name}', {});
                done();
            });
        });
    });
    describe('translate', function () {
        it('should return translated message by key', function () {
            registerFrLocale(localizify);
            expect(localizify.translate('hello')).toEqual('Bonjour');
        });
        it('should throw exception if key is not provided', function () {
            // @ts-ignore test method with wrong args
            var wrap = function () { return localizify.translate(); };
            expect(wrap).toThrowError(Error);
        });
        it('should return same message if key is not found', function () {
            expect(localizify.translate('foo')).toEqual('foo');
        });
        it('should return same message with interpolation if key is not found', function () {
            var actual = localizify.translate('hello, {name}', {
                name: 'foo',
            });
            expect(actual).toEqual('hello, foo');
        });
        it('should fire event if key is not found', function (done) {
            registerFrLocale(localizify);
            var callback = jest.fn();
            localizify.onTranslationNotFound(callback);
            localizify.translate('foo');
            process.nextTick(function () {
                expect(callback).toHaveBeenCalled();
                done();
            });
        });
    });
});
//# sourceMappingURL=localizify.spec.js.map