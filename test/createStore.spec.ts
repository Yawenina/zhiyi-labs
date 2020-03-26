import createStore from '../src/createStore';

describe('createStore', () => {
  it('should expose public API', () => {
    const store = createStore(() => {});
    const methods = Object.keys(store);
    expect(methods.length).toBe(4);
    expect(methods).toContain('getState');
    expect(methods).toContain('dispatch');
    expect(methods).toContain('subscribe');
    expect(methods).toContain('replaceReducer');
  });

  it('throw if reducer is not a function', () => {
    // expect 里调用 createStore 来捕捉
    expect(() => createStore()).toThrow();
    expect(() => createStore('test')).toThrow();
    expect(() => createStore({})).toThrow();
    expect(() => createStore(() => {})).not.toThrow();
  });
})