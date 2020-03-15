declare namespace localizify {
    type Translation = Record<string, string>;

    type Callback<T = unknown> = (...args: Array<T>) => void;

    type Event = string;

    type Store = {
        locale: string;
        localesList: string[];
        separator: string;
        scope: string | null;
        translations: Record<string, Translation>;
        interpolations: Translation;
        normalizedKeys: Record<string, Translation>;
    };

    interface Instance {
        new (): Localizify;
    }

    interface EventEmitter {
        getListeners(event: string): Callback[];

        on(event: Event, listener: Callback): Callback;

        off(event: Event, listener: Callback): this;

        emit(event: Event, ...args: Array<unknown>): this;

        hasListeners(event: Event): boolean;
    }

    interface Localizify extends EventEmitter {
        getStore(): Store;

        /**
         * Get selected locale.
         */
        getLocale(): string;

        /**
         * Change or set locale.
         * If locales list includes passed locale and it's not set now,
         * set locale or emit event `CHANGE_LOCALE`.
         * Return `this` for chaining.
         */
        setLocale(locale: string): this;

        /**
         * Check that locale is registered
         */
        isLocale(locale: string): boolean;

        /**
         * Handler will be executed when locale was changed.
         */
        onLocaleChange(callback: Callback): Callback;

        /**
         * Handler will be executed when translation is not found.
         */
        onTranslationNotFound(callback: Callback): void;

        /**
         * Handler will be executed when template data is not passed.
         */
        onReplacedDataNotFound(callback: Callback): void;

        setDefaultScope(scope: string): this;

        clearDefaultScope(): this;

        /**
         * Register default interpolations.
         * Interpolations you give as options to the translate method
         * take precedence over registered interpolations.
         */
        registerInterpolations(translation: Translation): this;

        /**
         * Register new locale.
         * If scope is provided, translations will be third argument,
         * otherwise - second.
         */
        add(locale: string, scope: string, translations: Translation): this;

        add(locale: string, translations: Translation): this;

        /**
         * Define user's language by browser or by request header language.
         * `language` params should be passed from server headers
         * (`request.headers['accept-language']`).
         * In client-size this param is optional (usually not using at all).
         */
        detectLocale(_language?: string): boolean | string;

        /**
         * Translate by key!
         * If translation not found, return passed string with replacing data
         * to string and emit `TRANSLATION_NOT_FOUND` event.
         */
        translate(key: string, data?: Record<string, string>): string;
    }
}

declare const localizify: localizify.Localizify;

declare function t(key: string, data?: Record<string, string>): string;

/**
    But default returns instance of Localizify, so it's singelton.
    You can add translations in one module and use it in another.
    But you can create another Localizify instance.
 */
declare const Instance: localizify.Instance;

export { t, Instance };
export default localizify;
export as namespace Localizify;
