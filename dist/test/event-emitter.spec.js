"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_emitter_1 = require("../src/event-emitter");
describe('EventEmitter', function () {
    var emitter;
    var calls = [];
    var defaultCallback = function (data) {
        calls.push(data);
    };
    var anotherCallback = function () {
        calls.push('bar');
    };
    beforeEach(function () {
        emitter = new event_emitter_1.EventEmitter();
        calls = [];
    });
    describe('on(event, listener)', function () {
        it('should throw exeption if callback if not a function', function () {
            var callback = 'bar';
            var wrap = function () { return emitter.on('foo', callback); };
            expect(wrap).toThrowError(TypeError);
        });
        it('should add callback to event', function () {
            emitter.on('foo', defaultCallback);
            expect(emitter.listeners.foo).toEqual([defaultCallback]);
        });
        it('should add few callbacks to same event', function () {
            emitter.on('foo', defaultCallback);
            emitter.on('foo', anotherCallback);
            expect(emitter.listeners.foo).toEqual([
                defaultCallback,
                anotherCallback,
            ]);
        });
        it('should not add callback if it is already registered', function () {
            emitter.on('foo', defaultCallback);
            emitter.on('foo', defaultCallback);
            expect(emitter.listeners.foo).toEqual([defaultCallback]);
        });
    });
    describe('off(event, listener)', function () {
        it('should remove callback from event', function () {
            emitter.on('foo', defaultCallback);
            emitter.off('foo', defaultCallback);
            expect(emitter.listeners.foo).toEqual([]);
        });
        it('should not do something if callback is not exists', function () {
            emitter.off('foo', defaultCallback);
            expect(emitter.listeners.foo).toEqual(undefined);
        });
    });
    describe('emit(event, ...args)', function () {
        it("should fire event's callback", function () {
            emitter.on('foo', defaultCallback);
            emitter.emit('foo');
            expect(calls.length).toEqual(1);
        });
        it("should fire event's callback with arguments", function () {
            emitter.on('foo', defaultCallback);
            emitter.emit('foo', 'bar');
            expect(calls).toEqual(['bar']);
        });
        it('should fire all callbacks for an eventin order', function () {
            emitter.on('foo', defaultCallback);
            emitter.on('foo', anotherCallback);
            emitter.emit('foo', 'bar2');
            expect(calls).toEqual(['bar2', 'bar']);
        });
    });
});
//# sourceMappingURL=event-emitter.spec.js.map