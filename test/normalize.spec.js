/* global describe,it */
const expect = require('chai').expect;
const normalize = require('../src/normalize');

describe('normalize', () => {
  it('should not change flatten objects', () => {
    const translations = { foo: 'value' };
    expect(normalize(translations)).to.be.eql(translations);
  });

  it('should normalize nested keys', () => {
    const translations = { foo: { bar: 'value' }, bar: { foo: 'value' } };
    expect(normalize(translations)).to.be.eql({ 'foo.bar': 'value', 'bar.foo': 'value' });
  });
});
