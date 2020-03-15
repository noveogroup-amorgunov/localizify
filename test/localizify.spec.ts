import { Localizify } from '../src/localizify';

const registerFrLocale = (localizify: Localizify) => {
    localizify.add('fr', { hello: 'Bonjour' }).setLocale('fr');
};
const registerFrLocaleWithScopeTranslations = (localizify: Localizify) => {
    localizify.add('fr', 'bot', { hello: 'Bonjour, {name}' }).setLocale('fr');
};

describe('Localizify', () => {
    let localizify: Localizify;

    beforeEach(() => {
        localizify = new Localizify();
    });

    describe('getLocale', () => {
        it("should return 'en' locale by default", () => {
            expect(localizify.getLocale()).toEqual('en');
        });

        it('should return current locale', () => {
            registerFrLocale(localizify);

            expect(localizify.getLocale()).toEqual('fr');
        });
    });

    describe('setLocale', () => {
        it('should set locale', () => {
            registerFrLocale(localizify);

            expect(localizify.getLocale()).toEqual('fr');
        });

        it('should not set locale if it already set', done => {
            const callback = jest.fn();

            localizify.onLocaleChange(callback);
            localizify.setLocale('en');

            process.nextTick(() => {
                expect(callback).toHaveBeenCalledTimes(0);
                done();
            });
        });

        it('should not set locale if it is not registered', done => {
            const callback = jest.fn();

            localizify.onLocaleChange(callback);
            localizify.setLocale('fr');

            process.nextTick(() => {
                expect(callback).toHaveBeenCalledTimes(0);
                done();
            });
        });
    });

    describe('isLocale', () => {
        it("should return true for 'en' locale", () => {
            expect(localizify.isLocale('en')).toBeTruthy();
        });

        it('should return true for registered locale', () => {
            registerFrLocale(localizify);

            expect(localizify.isLocale('fr')).toBeTruthy();
        });

        it('should return false for not registered locale', () => {
            expect(localizify.isLocale('fr')).toBeFalsy();
        });
    });

    describe('onLocaleChange', () => {
        it('should fire event if locale was changed', done => {
            registerFrLocale(localizify);

            const callback = jest.fn();

            localizify.onLocaleChange(callback);
            localizify.setLocale('en');
            localizify.setLocale('fr');

            process.nextTick(() => {
                expect(callback).toHaveBeenCalledTimes(2);
                expect(callback).toHaveBeenLastCalledWith('fr', 'en');
                done();
            });
        });
    });

    describe('onTranslationNotFound', () => {
        it('should fire event if translation not found', done => {
            registerFrLocale(localizify);

            const callback = jest.fn();

            localizify.onTranslationNotFound(callback);
            localizify.translate('foo');

            process.nextTick(() => {
                expect(callback).toHaveBeenCalledWith('fr', 'foo', null);
                done();
            });
        });
    });

    describe('add', () => {
        it('should register new locale', done => {
            registerFrLocale(localizify);

            process.nextTick(() => {
                expect(localizify.isLocale('fr')).toBeTruthy();
                done();
            });
        });

        it('should add translations', () => {
            registerFrLocale(localizify);

            expect(localizify.getStore().translations.fr).toEqual({
                hello: 'Bonjour',
            });
        });

        it('should add translations to scope', () => {
            registerFrLocaleWithScopeTranslations(localizify);

            expect(localizify.getStore().normalizedKeys.fr).toEqual({
                'bot.hello': 'Bonjour, {name}',
            });
        });
    });

    describe('detectLocale', () => {
        it('should detect browser locale', () => {
            (global as any).navigator = { languages: ['en-US', 'en'] };
            expect(localizify.detectLocale()).toEqual('en');
            (global as any).navigator = undefined;
        });

        it("should detect locale by header 'Accept-Language'", () => {
            const headers = { 'accept-language': 'en-US,en;q=0.8' };
            expect(localizify.detectLocale(headers['accept-language'])).toEqual(
                'en',
            );
        });

        it('should not detect locale if navigator.languages is not exist', () => {
            const originalCreateElement = window.document.createElement;
            window.document.createElement = undefined;

            expect(localizify.detectLocale()).toBeFalsy();

            // cleanup
            window.document.createElement = originalCreateElement;
        });
    });

    describe('replaceData', () => {
        it('should replace values to translations in message', () => {
            // @ts-ignore test private method
            const actual = localizify.replaceData('Bonjour, {name}', {
                name: 'foo',
            });

            expect(actual).toEqual('Bonjour, foo');
        });

        it('should replace data to negative values except undefined', () => {
            const data: Record<string, number | string | boolean | null> = {
                count: 0,
                name: '',
                mounted: false,
                item: null,
            };

            // @ts-ignore test private method
            const actual = localizify.replaceData(
                '{count}, {name}, {mounted}, {item}',
                data,
            );
            const expected = '0, , false, null';

            expect(actual).toEqual(expected);
        });

        it('should fire event if replaced data is not passed', done => {
            const callback = jest.fn();

            localizify.onReplacedDataNotFound(callback);
            // @ts-ignore test private method
            localizify.replaceData('My name is {name}', {});

            process.nextTick(() => {
                expect(callback).toHaveBeenCalledWith(
                    'My name is {name}',
                    '{name}',
                    {},
                );
                done();
            });
        });
    });

    describe('translate', () => {
        it('should return translated message by key', () => {
            registerFrLocale(localizify);

            expect(localizify.translate('hello')).toEqual('Bonjour');
        });

        it('should throw exception if key is not provided', () => {
            // @ts-ignore test method with wrong args
            const wrap = () => localizify.translate();

            expect(wrap).toThrowError(Error);
        });

        it('should return same message if key is not found', () => {
            expect(localizify.translate('foo')).toEqual('foo');
        });

        it('should return same message with interpolation if key is not found', () => {
            const actual = localizify.translate('hello, {name}', {
                name: 'foo',
            });

            expect(actual).toEqual('hello, foo');
        });

        it('should fire event if key is not found', done => {
            registerFrLocale(localizify);

            const callback = jest.fn();

            localizify.onTranslationNotFound(callback);
            localizify.translate('foo');

            process.nextTick(() => {
                expect(callback).toHaveBeenCalled();
                done();
            });
        });
    });
});
