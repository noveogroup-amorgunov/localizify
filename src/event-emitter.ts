export type Callback = (...args: Array<unknown>) => void;

type Event = string;

export class EventEmitter {
    private listeners: Record<string, Callback[]> = {};

    getListeners(event: string) {
        return this.listeners[event] || [];
    }

    on(event: Event, listener: Callback) {
        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function');
        }

        const listeners = this.getListeners(event);

        if (listeners.indexOf(listener) === -1) {
            if (!this.hasListeners(event)) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(listener);
        }

        return listener;
    }

    off(event: Event, listener: Callback) {
        if (this.hasListeners(event)) {
            const listeners = this.getListeners(event);
            this.listeners[event] = listeners.filter(l => listener !== l);
        }

        return this;
    }

    emit(event: Event, ...args: Array<unknown>) {
        const listeners = this.getListeners(event);
        listeners.forEach(listener => listener.apply(this, args));

        return this;
    }

    hasListeners(event: Event) {
        const listeners = this.getListeners(event);

        return listeners.length > 0;
    }
}
