import { normalize, isBrowser } from '../src/utils';

describe('normalize', () => {
    it('should not change flatten objects', () => {
        const translations = { foo: 'value' };

        expect(normalize(translations)).toEqual(translations);
    });

    it('should normalize nested keys', () => {
        const translations = { foo: { bar: 'value' }, bar: { foo: 'value' } };
        const expected = { 'foo.bar': 'value', 'bar.foo': 'value' };

        expect(normalize(translations)).toEqual(expected);
    });
});

describe('isBrowser()', () => {
    it('should return false', () => {
        const originalCreateElement = window.document.createElement;
        window.document.createElement = undefined;

        expect(isBrowser()).toBeFalsy();

        // cleanup
        window.document.createElement = originalCreateElement;
    });

    it('should return true if navigator exists', () => {
        expect(isBrowser()).toBeTruthy();
    });
});
