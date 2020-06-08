"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../src/utils");
describe('normalize', function () {
    it('should not change flatten objects', function () {
        var translations = { foo: 'value' };
        expect(utils_1.normalize(translations)).toEqual(translations);
    });
    it('should normalize nested keys', function () {
        var translations = { foo: { bar: 'value' }, bar: { foo: 'value' } };
        var expected = { 'foo.bar': 'value', 'bar.foo': 'value' };
        expect(utils_1.normalize(translations)).toEqual(expected);
    });
});
describe('isBrowser()', function () {
    it('should return false', function () {
        var originalCreateElement = window.document.createElement;
        window.document.createElement = undefined;
        expect(utils_1.isBrowser()).toBeFalsy();
        // cleanup
        window.document.createElement = originalCreateElement;
    });
    it('should return true if navigator exists', function () {
        expect(utils_1.isBrowser()).toBeTruthy();
    });
});
//# sourceMappingURL=utils.spec.js.map