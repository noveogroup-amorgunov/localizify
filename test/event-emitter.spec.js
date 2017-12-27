/* global describe,it,beforeEach */
const expect = require('chai').expect;
const EventEmitter = require('../src/event-emitter');

describe('EventEmitter', () => {
  let emitter;
  let calls = [];
  const defaultCallback = data => calls.push(data);
  const anotherCallback = () => calls.push('bar');

  beforeEach(() => {
    emitter = new EventEmitter();
    calls = [];
  });

  describe('on(event, listener)', () => {
    it('should throw exeption if callback if not a function', () => {
      const callback = 'bar';
      const wrap = () => emitter.on('foo', callback);
      expect(wrap).to.Throw(TypeError);
    });

    it('should add callback to event', () => {
      emitter.on('foo', defaultCallback);
      expect(emitter._listeners.foo).to.be.eql([defaultCallback]);
    });

    it('should add few callbacks to same event', () => {
      emitter.on('foo', defaultCallback);
      emitter.on('foo', anotherCallback);
      expect(emitter._listeners.foo).to.be.eql([defaultCallback, anotherCallback]);
    });

    it('should not add callback if it is already registered', () => {
      emitter.on('foo', defaultCallback);
      emitter.on('foo', defaultCallback);
      expect(emitter._listeners.foo).to.be.eql([defaultCallback]);
    });
  });

  describe('off(event, listener)', () => {
    it('should remove callback from event', () => {
      emitter.on('foo', defaultCallback);
      emitter.off('foo', defaultCallback);
      expect(emitter._listeners.foo).to.be.eql([]);
    });

    it('should not do something if callback is not exists', () => {
      emitter.off('foo', defaultCallback);
      expect(emitter._listeners.foo).to.be.eql(undefined);
    });
  });

  describe('emit(event, ...args)', () => {
    it('should fire event\'s callback', () => {
      emitter.on('foo', defaultCallback);
      emitter.emit('foo');
      expect(calls.length).to.eql(1);
    });

    it('should fire event\'s callback with arguments', () => {
      emitter.on('foo', defaultCallback);
      emitter.emit('foo', 'bar');
      expect(calls).to.eql(['bar']);
    });

    it('should fire all callbacks for an eventin order', () => {
      emitter.on('foo', defaultCallback);
      emitter.on('foo', anotherCallback);
      emitter.emit('foo', 'bar2');
      expect(calls).to.eql(['bar2', 'bar']);
    });
  });
});
