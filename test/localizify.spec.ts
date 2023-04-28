import {
    Localizify,
    t,
    localizify as localizifySingelton,
} from '../src/localizify';

const keyset = {
    en: {
        hello: 'Hello, bro! How are you?',
        say: {
            awesome: 'You are awesome, {name}',
            notBad: 'You are not bad',
        },
    },
    ru: {
        hello: 'Привет, бро! Как сам?',
        say: {
            awesome: 'Ты прекрасен, {name}',
            notBad: 'А ты неплох',
        },
    },
} as const;

/**
 * const registerFrLocale = (localizify: Localizify) => {
    localizify.add('fr', { hello: 'Bonjour' }).setLocale('fr');
};
const registerFrLocaleWithScopeTranslations = (localizify: Localizify) => {
    localizify.add('fr', 'bot', { hello: 'Bonjour, {name}' }).setLocale('fr');
};
 */

describe('Localizify', () => {
    let localizify = new Localizify(keyset);
    let emptyLocalizify = new Localizify();

    beforeEach(() => {
        localizify = new Localizify(keyset);
        emptyLocalizify = new Localizify();
    });

    describe('getLocale', () => {
        it('should return `en` locale by default', () => {
            expect(localizify.getLocale()).toEqual('en');
        });

        it('should return current locale', () => {
            localizify.setLocale('ru');

            expect(localizify.getLocale()).toEqual('ru');
        });
    });

    describe('setLocale', () => {
        it('should set locale', () => {
            localizify.setLocale('ru');

            expect(localizify.getLocale()).toEqual('ru');
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

            // @ts-expect-error
            localizify.setLocale('fr');

            process.nextTick(() => {
                expect(callback).toHaveBeenCalledTimes(0);
                done();
            });
        });
    });

    describe('[private]interpolateTranslation', () => {
        it('should replace values to translations in message', () => {
            // @ts-expect-error private method
            const actual = localizify.interpolateTranslation(
                'You are awesome, {name}',
                { name: 'Uncle Ben' },
            );

            expect(actual).toEqual('You are awesome, Uncle Ben');
        });

        it('should replace data to negative values except undefined', () => {
            const params: Record<string, number | string | boolean | null> = {
                count: 0,
                name: '',
                mounted: false,
                item: null,
            };

            // @ts-expect-error private method
            const actual = localizify.interpolateTranslation(
                '{count}, {name}, {mounted}, {item}',
                params,
            );
            const expected = '0, , false, null';

            expect(actual).toEqual(expected);
        });

        it('should fire event if replaced data is not passed', done => {
            const callback = jest.fn();

            localizify.onReplacedDataNotFound(callback);
            // @ts-expect-error private method
            localizify.interpolateTranslation('You are awesome, {name}', {});

            process.nextTick(() => {
                expect(callback).toHaveBeenCalledWith(
                    'You are awesome, {name}',
                    '{name}',
                    {},
                );
                done();
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

        it.skip('should not detect locale if navigator.languages is not exist', () => {
            // const originalCreateElement = window.document.createElement;
            // window.document.createElement = undefined;

            expect(localizify.detectLocale()).toBeFalsy();

            // cleanup
            // window.document.createElement = originalCreateElement;
        });
    });

    describe('isLocale', () => {
        it("should return true for 'en' locale", () => {
            expect(localizify.isLocale('en')).toBeTruthy();
        });

        it('should return true for registered locale', () => {
            emptyLocalizify.add('ru', keyset.ru);

            expect(emptyLocalizify.isLocale('ru')).toBeTruthy();
        });

        it('should return false for not registered locale', () => {
            expect(emptyLocalizify.isLocale('ru')).toBeFalsy();
        });
    });

    describe('onLocaleChange', () => {
        it('should fire event if locale was changed', done => {
            const callback = jest.fn();

            const l = emptyLocalizify.add('en', keyset.en).add('ru', keyset.ru);

            l.onLocaleChange(callback);
            l.setLocale('ru');
            l.setLocale('en');

            process.nextTick(() => {
                expect(callback).toHaveBeenCalledTimes(2);
                expect(callback).toHaveBeenLastCalledWith('en', 'ru');
                done();
            });
        });
    });

    describe('onTranslationNotFound', () => {
        it('should fire event if translation not found', done => {
            const callback = jest.fn();

            localizify.setLocale('ru');

            localizify.onTranslationNotFound(callback);

            // @ts-expect-error wrong key
            localizify.translate('foo');

            process.nextTick(() => {
                expect(callback).toHaveBeenCalledWith('ru', 'foo');
                done();
            });
        });
    });

    describe('add', () => {
        it('should register new locale', done => {
            emptyLocalizify.add('en', keyset.en);

            process.nextTick(() => {
                expect(emptyLocalizify.isLocale('en')).toBeTruthy();
                done();
            });
        });

        it('should add translations', () => {
            emptyLocalizify.add('en', keyset.en);

            // @ts-expect-error private field
            expect(emptyLocalizify.keysets.en).toEqual({
                hello: 'Hello, bro! How are you?',
                say: {
                    awesome: 'You are awesome, {name}',
                    notBad: 'You are not bad',
                },
            });
        });
    });

    it('should return translated message by key', () => {
        expect(localizify.translate('hello')).toEqual(
            'Hello, bro! How are you?',
        );
    });

    it('should throw exception if key is not provided', () => {
        // @ts-expect-error test method with wrong args
        const wrap = () => localizify.translate();

        expect(wrap).toThrowError(Error);
    });

    it('should return same message if key is not found', () => {
        // @ts-expect-error test method with not found key
        expect(localizify.translate('foo')).toEqual('foo');
    });

    it('should return same message with interpolation if key is not found', () => {
        // @ts-expect-error test method with not found key
        const actual = localizify.translate('hello, {name}', {
            name: 'foo',
        });

        expect(actual).toEqual('hello, foo');
    });

    it('should fire event if key is not found', done => {
        const callback = jest.fn();

        localizify.onTranslationNotFound(callback);

        // @ts-expect-error test method with not found key
        localizify.translate('foo');

        process.nextTick(() => {
            expect(callback).toHaveBeenCalled();
            done();
        });
    });

    describe('singelton localizify & t', () => {
        it('should works with singelton localizify', () => {
            localizifySingelton.add('ru', keyset.ru).setLocale('ru');

            expect(localizifySingelton.getLocale()).toEqual('ru');
        });

        it('should works with singelton localizify', () => {
            localizifySingelton.add('ru', keyset.ru).setLocale('ru');

            expect(t('hello')).toEqual('Привет, бро! Как сам?');
        });
    });
});
