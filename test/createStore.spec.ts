import createStore from '../src/createStore';
import * as reducers from './helpers/reducers';
import { Reducer } from '../src/types/reducers';

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
    // use as unknown, asReducer for type check
    expect(() => createStore((undefined as unknown) as Reducer)).toThrow();
    expect(() => createStore(('test' as unknown) as Reducer)).toThrow();
    expect(() => createStore(({} as unknown) as Reducer)).toThrow();
    expect(() => createStore(() => {})).not.toThrow();
  });

  // test getState & dispatch
  it('should pass the initial action and initial state', () => {
    const store = createStore(reducers.todo, [
      { id: 1, text: 'Hello' }
    ]);

    expect(store.getState()).toEqual([
      { id: 1, text: 'Hello' }
    ])
  });

  
})