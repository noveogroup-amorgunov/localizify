/**
 * Very light event emitter
 * @class EventEmitter
 */
class EventEmitter {
  constructor() {
    this._listeners = {};
  }

  /**
   * @param {string} event
   * @return {array<function>}
   */
  getListeners(event) {
    return this._listeners[event] || [];
  }

  /**
   * @param {string} event
   * @param {function} listener
   * @return {function}
   */
  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    const listeners = this.getListeners(event);
    if (!listeners.includes(listener)) {
      if (!this.hasListeners(event)) {
        this._listeners[event] = [];
      }
      this._listeners[event].push(listener);
    }

    return listener;
  }

  /**
   * @param {string} event
   * @param {function} listener
   * @return {EventEmitter}
   */
  off(event, listener) {
    if (this.hasListeners(event)) {
      const listeners = this.getListeners(event);
      this._listeners[event] = listeners.filter(l => listener !== l);
    }
    return this;
  }

  /**
   * @param {string} event
   * @param {...object} args
   * @return {EventEmitter}
   */
  emit(event, ...args) {
    const listeners = this.getListeners(event);
    listeners.forEach(listener => listener.apply(this, args));
    return this;
  }

  /**
   * @param {string} event
   * @return {boolean}
   */
  hasListeners(event) {
    const listeners = this.getListeners(event);
    return listeners.length > 0;
  }
}

module.exports = EventEmitter;
