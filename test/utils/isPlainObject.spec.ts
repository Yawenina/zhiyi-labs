import vm from 'vm';
import isPlainObject from '../../src/utils/isPlainObject';


describe('isPlainObject', () => {
  it('should returns true only if plain object', () => {
  
    class Test {
      prop = 1;
    }

    const sandbox = { fromAnotherRealm: false };
    vm.runInNewContext('fromAnotherRealm = {}', sandbox);

    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject([1, 2, 3])).toBe(false);
    expect(isPlainObject(new Test())).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(Object.create({ foo: 'bar' }))).toBe(false);

    expect(isPlainObject(sandbox.fromAnotherRealm)).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
    expect(isPlainObject({ foo: 'bar' })).toBe(true);
    expect(isPlainObject({})).toBe(true);
  })
})