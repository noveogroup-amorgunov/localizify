import { normalize, isBrowser } from './utils';
import { Callback, EventEmitter } from './event-emitter';

export enum EventTypes {
    ChangeLocale = 'CHANGE_LOCALE',
    TranslationNotFound = 'TRANSLATION_NOT_FOUND',
    ReplacedDataNotFound = 'REPLACED_DATA_NOT_FOUND',
}

type Translation = Record<string, string>;

type Store = {
    locale: string;
    localesList: string[];
    separator: string;
    scope: string | null;
    translations: Record<string, Translation>;
    interpolations: Translation;
    normalizedKeys: Record<string, Translation>;
};

export class Localizify extends EventEmitter {
    private store: Store = {
        locale: 'en',
        localesList: ['en'],
        scope: null,
        translations: {},
        interpolations: {},
        normalizedKeys: {},
        separator: '.',
    };

    getStore() {
        return this.store;
    }

    getLocale() {
        return this.getStore().locale;
    }

    setLocale(locale: string) {
        const { locale: previous } = this.getStore();

        if (this.isLocale(locale) && previous !== locale) {
            this.getStore().locale = locale;
            this.emit(EventTypes.ChangeLocale, locale, previous);
        }

        return this;
    }

    isLocale(locale: string) {
        return this.getStore().localesList.includes(locale);
    }

    onLocaleChange(callback: Callback) {
        this.on(EventTypes.ChangeLocale, callback);

        return callback;
    }

    onTranslationNotFound(callback: Callback) {
        this.on(EventTypes.TranslationNotFound, callback);
    }

    onReplacedDataNotFound(callback: Callback) {
        this.on(EventTypes.ReplacedDataNotFound, callback);
    }

    setDefaultScope(scope: string) {
        this.getStore().scope = scope;

        return this;
    }

    clearDefaultScope() {
        this.getStore().scope = null;

        return this;
    }

    registerInterpolations(translation: Translation) {
        Object.assign(this.getStore().interpolations, translation);

        return this;
    }

    /**
     * Register new locale
     */
    add(
        locale: string,
        scopeOrTranslations: string | Translation,
        _translations?: Translation,
    ) {
        const store = this.getStore();
        let trans:
            | Record<string, Translation>
            | Translation
            | string = scopeOrTranslations;

        if (_translations) {
            trans = {};
            trans[scopeOrTranslations as string] = _translations;
        }

        if (!this.isLocale(locale)) {
            store.localesList.push(locale);
        }

        store.translations[locale] = {
            ...store.translations[locale],
            ...(trans as Translation),
        };
        store.normalizedKeys[locale] = {
            ...store.normalizedKeys[locale],
            ...(normalize(trans) as Translation),
        };

        return this;
    }

    /**
     * Define user's language by browser or by request header language
     */
    detectLocale(_language?: string) {
        let language = _language;

        if (isBrowser() && !language) {
            // Different browsers have the user locale defined
            // on different fields on the `navigator` object, so we make sure to account
            // for these different by checking all of them
            language =
                (navigator.languages && navigator.languages[0]) ||
                navigator.language ||
                (navigator as any).userLanguage;
        }

        if (!language) {
            return false;
        }

        // Split locales with a region code
        const languageWithoutRegionCode = language
            .toLowerCase()
            .split(/[_-]+/)[0];

        return this.isLocale(languageWithoutRegionCode)
            ? languageWithoutRegionCode
            : false;
    }

    private replaceData(_msg: string, data: Record<string, unknown> | null) {
        let msg = _msg;
        const terms = msg.match(/\{(.*?)\}/gi) || [];

        terms.forEach(_term => {
            const term = _term.replace(/[{}]/gi, '');

            const replacedTextCases = [
                data[term],
                this.getStore().interpolations[term],
                _term,
            ];
            const replaceTo = replacedTextCases.find(
                value => typeof value !== 'undefined',
            );

            if (replaceTo === _term) {
                this.emit(EventTypes.ReplacedDataNotFound, _msg, _term, data);
            }

            msg = msg.replace(_term, replaceTo as string);
        });

        return msg;
    }

    translate(key: string, data: Record<string, string> = {}) {
        if (!key) {
            throw new Error('"key" param is required');
        }

        const { locale: l, scope = this.getStore().scope } = data;
        const locale = (this.isLocale(l) && l) || this.getStore().locale;

        if (!locale) {
            throw new Error('Current locale is not defined');
        }

        const keys = this.getStore().normalizedKeys[locale];
        const normalizeKey = (scope ? `${scope}.` : '') + key;

        const hasTranslation = keys && keys[normalizeKey];

        if (!hasTranslation) {
            this.emit(EventTypes.TranslationNotFound, locale, key, scope);
        }

        return this.replaceData(
            hasTranslation ? keys[normalizeKey] : key,
            data,
        );
    }
}

const localizify = new Localizify();
const t = localizify.translate.bind(localizify);

export { t, Localizify as Instance };
export default localizify;
