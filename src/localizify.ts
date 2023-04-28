import { normalize, isBrowser } from './utils';
import { EventEmitter } from './event-emitter';

const EVENTS = {
    ChangeLocale: 'CHANGE_LOCALE',
    TranslationNotFound: 'TRANSLATION_NOT_FOUND',
    ReplacedDataNotFound: 'REPLACED_DATA_NOT_FOUND',
} as const

type KeyObject = Record<string, string | number | boolean | null> 

type Keyset<T = any> = Record<string | number | symbol, T>;

type KeysetMap<K extends string | number | symbol = string> = Record<K, Keyset>;

type Params<S, O = {}> = S extends `${string}{${infer P}}${infer R}` ? Params<R, O & { [K in P]?: string | number }> : O

type GetPath<L, K> = K extends `${infer P}.${infer R}`
    ? P extends keyof L
        ? GetPath<L[P], R>
        : never
    : K extends keyof L
        ? L[K]
        : never;

type NormaizedKeyset<L extends Keyset> = keyof {
    [K in keyof L as L[K] extends string
        ? K
        : L[K] extends Keyset
        ? `${K & string}.${NormaizedKeyset<L[K]> & string}`
        : never]: any
}

class Localizify<L = {}> {
    /**
     * Current locale (return union type of possible locales)
     * 
     * @example
     * this.locale = 'en | 'ru'
     */
    private locale: keyof L = 'en' as keyof L;

    /**
     * List of locales as tuple
     * 
     * @deprecated Will be remove in future versions
     * @example
     * this.localesList = ['en, 'ru']
     */
    private localesList: string[] = ['en'];

    /**
     * Keysets map
     * 
     * @example
     * this.keysets = {
     *   en: {
     *     hello: 'Hello, bro! How are you?',
     *     say: {
     *       awesome: 'You are awesome, {name}'
     *     }
     *   },
     *   ru: {
     *     hello: 'Привет, бро! Как сам?',
     *     say: {
     *       awesome: 'Ты прекрасен, {name}'
     *     }
     *   },
     * }
     */
    private keysets: KeysetMap<keyof L> = {} as KeysetMap<keyof L>;

    // TODO: I cant write types for infer normalized keysets
    /**
     * Normalized keysets map
     * 
     * @example
     * this.normalizedKeysets = {
     *   en: {
     *     hello: 'Hello, bro! How are you?',
     *     say.awesome: 'You are awesome, {name}'
     *   },
     *   ru: {
     *     hello: 'Привет, бро! Как сам?',
     *     say.awesome: 'Ты прекрасен, {name}',
     *   },
     * }
     */
    private normalizedKeysets: any = {}

    // TODO: use in translations
    /**
     * Global interpolations
     * 
     * @example
     * this.interpolations = {
     *   appName: 'LOCALIZIFY',
     *   // ...
     * }
     */
    private interpolations: KeyObject

    private eventEmitter: EventEmitter

    constructor(keysets: KeysetMap = {}, interpolations: KeyObject = {}) {
        Object.entries(keysets).forEach(([key, v]: [string, Keyset]) => {
            this.add(key, v);
        });

        this.translate = this.translate.bind(this)

        this.interpolations = interpolations

        this.eventEmitter = new EventEmitter()

        return this;
    }

    add<K extends string, V extends Keyset>(
        locale: K,
        keyset: V,
    ): TypedLocalizify<L & { [P in K]: V }> {
        if (!this.localesList.includes(locale)) {
            this.localesList.push(locale);
        }

        // Use cast coz in current moment type K is not assignable to type keyof L
        const typedLocale = locale as unknown as keyof L

        // Set first added locale as default
        if (!this.locale) {
            // Use cast coz in current moment type K is not assignable to type keyof L
            this.locale = typedLocale
        }

        this.keysets[typedLocale] = keyset;

        // as unknown as NormaizedKeyset<L & { [P in K]: V }>;
        this.normalizedKeysets[typedLocale] = normalize(keyset); 

        return this as TypedLocalizify<L & { [P in K]: V }>;
    }

    getLocale() {
        return this.locale;
    }

    /**
     * @deprecated Will be remove in future versions
     */
    getLocalesList() {
        return this.localesList;
    }

    setLocale(nextLocale: keyof L) {
        const prevLocale = this.locale

        if (this.isLocale(nextLocale) && this.locale !== nextLocale) {
            this.locale = nextLocale;
            this.eventEmitter.emit(EVENTS.ChangeLocale, nextLocale, prevLocale);
        }

        return this;
    }

    isLocale(locale: unknown): locale is keyof L {
        return typeof locale === 'string' && locale in this.keysets
    }

    translate<
        // @ts-expect-error Type 'L[keyof L]' does not satisfy the constraint 'Keyset<any>'
        K extends NormaizedKeyset<L[keyof L]>,
        P extends Params<GetPath<L[keyof L], K>>,
    >(key: K, params: P = {} as any) {
        if (!key) {
            throw new Error('`key` argument is required');
        }

        const locale = this.locale

        const hasTranslation = key in this.normalizedKeysets[locale]

        if (!hasTranslation) {
            this.eventEmitter.emit(EVENTS.TranslationNotFound, locale, key);
        }

        return this.interpolateTranslation(
            hasTranslation ? this.normalizedKeysets[this.locale][key] : key,
            // Argument of type '{} | { [x: string]: string | number | undefined; }'
            // is not assignable to parameter of type 'KeyObject'.
            // @ts-expect-error 🤯🤯🤯
            params
        )
    }

    private interpolateTranslation(translation: string, params: KeyObject) {
        const terms = translation.match(/\{([a-zA-Z0-9_-]+)\}/gi) || [];

        terms.forEach(term => {
            const parsedTerm = term.replace(/[{}]/gi, '');

            const replacedTextCases = [
                params[parsedTerm],
                this.interpolations[parsedTerm],
                term,
            ];

            const replaceTo = replacedTextCases.find(
                value => typeof value !== 'undefined',
            );

            if (replaceTo === term) {
                this.eventEmitter.emit(EVENTS.ReplacedDataNotFound, translation, term, params);
            }

            translation = translation.replace(term, replaceTo as string);
        });

        return translation;
    }

    registerInterpolations(interpolations: KeyObject) {
        Object.assign(this.interpolations, interpolations);

        return this;
    }

    /**
     * Define user's language by browser or by request header language
     */
    detectLocale(defaultLanguage?: string): keyof L | false {
        let language = defaultLanguage;

        if (isBrowser() && !language) {
            /**
             * Different browsers have the user locale defined
             * on different fields on the `navigator` object,
             * so we make sure to account for these different
             * by checking all of them
             */
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

    onLocaleChange(callback: (nextLocale: keyof L, prevLocale: keyof L) => void) {
        this.eventEmitter.on(EVENTS.ChangeLocale, callback);

        return callback;
    }

    onTranslationNotFound(callback: (locale: string, key: string) => void) {
        this.eventEmitter.on(EVENTS.TranslationNotFound, callback);
    }

    onReplacedDataNotFound(callback: (translation: string, term: string, data: KeyObject) => void) {
        this.eventEmitter.on(EVENTS.ReplacedDataNotFound, callback);
    }
}

/**
 * Monkey patch class constructor to infer right TypeScript types
 */
interface TypedLocalizify<L> extends Localizify<L> {}

interface TypedLocalizifyConstructor<L = {}> {
    new <LNext extends KeysetMap>(l?: LNext, interpolations?: KeyObject): TypedLocalizify<
        L & { [K in keyof LNext]: LNext[K] }
    >;
}

const TypedLocalizify: TypedLocalizifyConstructor = Localizify;

const localizify = new TypedLocalizify({});
const t = localizify.translate;

export {
    /**
     * Typed class for base usage
     */
    TypedLocalizify as Localizify,

    /**
     * Singelton functions (not recommend to use, coz lose typescript)
     */
    t,
    localizify,

    /**
     * @deprecated Will be remove in future versions
     */
    TypedLocalizify as Instance
};

// For backward compatibility export default instance
export default localizify;


//////////

// ---

// const inc = new Localizify();
// const res2 = inc.add('ru', {}).add('en', {});

// const res3 = res2.getLocales();
// //     ^?

// const res = inc.getLocales();
//     ^?


/*
const inc2 = new TypedLocalizify({
    en: { hello: 'hey, {name}', how: { are_you: 'How are you?'} },
    fr: { hello: 'bonjour, {name}', how: { are_you: 'Jopa shmel?'} },
} as const);

let clang = inc2.getLocale();
//   ^?

let inc3 = inc2.add('ru', { hello: 'йоу, {name}', how: { are_you: 'Как сам?'} } as const);
//   ^?

let clang2 = inc3.getLocale();
//   ^?

inc3.getLocales();
//     ^?
// inc2.getLocales().en

let res7 = inc3.getLocalesList();
//   ^?

let res5 = inc2.getLocales();
//   ^?

// inc2.translate('how.are_you')

inc3.setLocale('ru')

const a = inc3.locale
//    ^?

console.log(inc3.translate('how.are_you'));

inc3.translate('hello', {name: 123, locale: 'en'})

// @ts-expect-error
console.log(inc3.translate('how.are_you', {foo:true}));

// @ts-expect-error
inc3.translate('hello', 55)
// @ts-expect-error
inc3.translate('hello', {foo: 'bar'})


inc3.translate('hello', {name: 5})
inc3.translate('hello', {})
console.log(inc3.translate('hello', {name:'dick'}))


// inc3.translate('')

console.log(res7, res5);

inc3.setLocale('ru')
// inc3.translate('how.are_you', {})
*/
