"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.listeners = {};
    }
    EventEmitter.prototype.getListeners = function (event) {
        return this.listeners[event] || [];
    };
    EventEmitter.prototype.on = function (event, listener) {
        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function');
        }
        var listeners = this.getListeners(event);
        if (listeners.indexOf(listener) === -1) {
            if (!this.hasListeners(event)) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(listener);
        }
        return listener;
    };
    EventEmitter.prototype.off = function (event, listener) {
        if (this.hasListeners(event)) {
            var listeners = this.getListeners(event);
            this.listeners[event] = listeners.filter(function (l) { return listener !== l; });
        }
        return this;
    };
    EventEmitter.prototype.emit = function (event) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var listeners = this.getListeners(event);
        listeners.forEach(function (listener) { return listener.apply(_this, args); });
        return this;
    };
    EventEmitter.prototype.hasListeners = function (event) {
        var listeners = this.getListeners(event);
        return listeners.length > 0;
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=event-emitter.js.map