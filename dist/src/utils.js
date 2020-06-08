"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowser = exports.normalize = void 0;
var isPlainObject = function (val) {
    return val !== null && Object.prototype.toString.call(val) === '[object Object]';
};
var isString = function (val) { return typeof val === 'string'; };
/**
 * Normalize not flatten object to one-level object
 */
exports.normalize = function (object, acc, results) {
    if (acc === void 0) { acc = []; }
    if (results === void 0) { results = {}; }
    if (isString(object)) {
        // eslint-disable-next-line no-param-reassign
        results[acc.join('.')] = object;
    }
    else if (isPlainObject(object)) {
        Object.keys(object).forEach(function (key) {
            exports.normalize(object[key], __spreadArrays(acc, [key]), results);
        });
    }
    return results;
};
/**
 * Detect, where is script running
 */
exports.isBrowser = function () {
    return typeof window !== 'undefined' &&
        window.document &&
        window.document.createElement;
};
//# sourceMappingURL=utils.js.map