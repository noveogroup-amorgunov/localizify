import { Localizify } from '../src/localizify';
import { isBrowser } from '../src/utils';

const registerFrLocale = (localizify: Localizify) =>
    localizify.add('fr', { hello: 'Bonjour' }).setLocale('fr');
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

        it('should not set locale if it already set', () => {
            let isChangedLocale = false;
            localizify.onLocaleChange(() => {
                isChangedLocale = true;
            });
            localizify.setLocale('en');

            setTimeout(() => expect(isChangedLocale).toBeFalsy(), 0);
        });

        it('should not set locale if it is not registered', () => {
            let isChangedLocale = false;
            localizify.onLocaleChange(() => {
                isChangedLocale = true;
            });
            localizify.setLocale('fr');

            setTimeout(() => expect(isChangedLocale).toBeFalsy(), 0);
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
            let isChangedLocale = false;

            registerFrLocale(localizify);
            localizify.setLocale('en');
            localizify.onLocaleChange(() => {
                isChangedLocale = true;
            });
            localizify.setLocale('fr');

            setTimeout(() => {
                expect(isChangedLocale).toBeTruthy();
                done();
            }, 0);
        });
    });

    describe('onTranslationNotFound', () => {
        it('should fire event if translation not found', done => {
            let isTranslationNotFound = false;
            registerFrLocale(localizify);
            localizify.onTranslationNotFound(
                () => (isTranslationNotFound = true)
            ); // eslint-disable-line
            localizify.translate('foo');
            setTimeout(() => {
                expect(isTranslationNotFound).toBeTruthy();
                done();
            }, 0);
        });
    });

    describe('add', () => {
        it('should register new locale', done => {
            registerFrLocale(localizify);
            setTimeout(() => {
                expect(localizify.isLocale('fr')).toBeTruthy();
                done();
            }, 0);
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
                'en'
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
            expect(
                (localizify as any).replaceData('Bonjour, {name}', {
                    name: 'foo',
                })
            ).toEqual('Bonjour, foo');
        });

        it('should replace data to negative values except undefined', () => {
            const data: Record<string, any> = {
                count: 0,
                name: '',
                mounted: false,
                item: null
            };
            const expected = '0, , false, null';

            expect((localizify as any).replaceData('{count}, {name}, {mounted}, {item}', data)).toEqual(expected);
        });

        it('should fire event if replaced data is not passed', (done) => {
            let isTemplateDataNotFound = false;
            localizify.onReplacedDataNotFound(() => (isTemplateDataNotFound = true)); // eslint-disable-line
            (localizify as any).replaceData('My name is {name}', {});

            setTimeout(() => {
                expect(isTemplateDataNotFound).toBeTruthy();
                done();
            }, 0);
        });
    });

    describe('translate', () => {
        it('should return translated message by key', () => {
            registerFrLocale(localizify);
            expect(localizify.translate('hello')).toEqual('Bonjour');
        });

        it('should throw exception if key is not provided', () => {
            const wrap = () => (localizify as any).translate();
            expect(wrap).toThrowError(Error);
        });

        it('should return same message if key is not found', () => {
            expect(localizify.translate('foo')).toEqual('foo');
        });

        it('should return same message with interpolation if key is not found', () => {
            expect(
                localizify.translate('hello, {name}', { name: 'foo' })
            ).toEqual('hello, foo');
        });

        it('should fire event if key is not found', done => {
            let isTranslationNotFound = false;
            registerFrLocale(localizify);
            localizify.onTranslationNotFound(
                () => (isTranslationNotFound = true)
            ); // eslint-disable-line
            localizify.translate('foo');
            setTimeout(() => {
                expect(isTranslationNotFound).toEqual(true);
                done();
            }, 0);
        });
    });
});
