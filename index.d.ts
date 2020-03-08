declare namespace localizify {
    type Translation = Record<string, string>;

    type Callback = (...args: Array<unknown>) => void;

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

        getLocale(): string;

        setLocale(locale: string): this;

        isLocale(locale: string): boolean;

        onLocaleChange(callback: Callback): Callback;

        onTranslationNotFound(callback: Callback): void;

        setDefaultScope(scope: string): this;

        clearDefaultScope(): this;

        registerInterpolations(translation: Translation): this;

        add(locale: string, scope: string, translations: Translation): this;

        add(locale: string, translations: Translation): this;

        detectLocale(_language?: string): boolean | string;

        translate(key: string, data?: Record<string, string>): string;
    }
}

declare const localizify: localizify.Localizify;
declare function t(key: string, data?: Record<string, string>): string;
declare const Instance: localizify.Instance;

export { t, Instance };
export default localizify;
export as namespace Localizify;
