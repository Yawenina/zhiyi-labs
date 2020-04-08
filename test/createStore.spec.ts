import createStore from '../src/createStore';
import * as reducers from './helpers/reducers';
import * as actions from './helpers/actionTypes';
import { Reducer } from '../src/types/reducers';
import { Action } from '../src/types/actions';

describe('createStore', () => {
  // it('should expose public API', () => {
  //   const store = createStore(() => {});
  //   const methods = Object.keys(store);
  //   expect(methods.length).toBe(4);
  //   expect(methods).toContain('getState');
  //   expect(methods).toContain('dispatch');
  //   expect(methods).toContain('subscribe');
  //   expect(methods).toContain('replaceReducer');
  // });

  // it('throw if reducer is not a function', () => {
  //   // expect 里调用 createStore 来捕捉
  //   // use as unknown, asReducer for type check
  //   expect(() => createStore((undefined as unknown) as Reducer)).toThrow();
  //   expect(() => createStore(('test' as unknown) as Reducer)).toThrow();
  //   expect(() => createStore(({} as unknown) as Reducer)).toThrow();
  //   expect(() => createStore(() => {})).not.toThrow();
  // });

  // // test getState & dispatch
  // it('should pass the initial action and initial state', () => {
  //   const store = createStore(reducers.todo, [
  //     { id: 1, text: 'Hello' }
  //   ]);

  //   expect(store.getState()).toEqual([
  //     { id: 1, text: 'Hello' }
  //   ])
  // });

  // // dispatch
  // it('action should be a plain object', () => {
  //   const store = createStore(reducers.todo, [
  //     { id: 1, text: 'Hello' }
  //   ]);
  //   expect(() => store.dispatch(('a' as unknown) as Action)).toThrow();
  //   expect(() => store.dispatch((new Date() as unknown) as Action)).toThrow();
  //   expect(() => store.dispatch((Promise.resolve() as unknown) as Action)).toThrow();
  //   expect(() => store.dispatch(({ foo: 'bar' } as unknown) as Action)).not.toThrow();
  // });

  // it('should return action', () => {
  //   const store = createStore(reducers.todo, [
  //     { id: 1, text: 'Hello' }
  //   ]);
  //   const action = { type: actions.ADD_TODO };
  //   expect(store.dispatch(action)).toBe(action);
  // });

  // it('should dispatch an action', () => {
  //   const store = createStore(reducers.todo, [
  //     { id: 1, text: 'Hello' }
  //   ]);
  //   store.dispatch({
  //     type: actions.ADD_TODO,
  //     text: 'World'
  //   });

  //   expect(store.getState()).toEqual([
  //     { id: 1, text: 'Hello' },
  //     { id: 2, text: 'World' },
  //   ])
  // })

  // // subscribe
  // it('listner should be a function', () => {
  //   const store = createStore(reducers.todo, [
  //     { id: 1, text: 'Hello' }
  //   ]);
  //   expect(() => (store.subscribe(undefined))).toThrow();
  //   expect(() => (store.subscribe(('test' as unknown) as () => void))).toThrow();
  //   expect(() => (store.subscribe(({ foo: 'bar'} as unknown) as () => void))).toThrow();
  //   expect(() => (store.subscribe(() => {}))).not.toThrow();
  // });

  // it('should call listener when state changed', () => {
  //   const store = createStore(reducers.todo, [
  //     { id: 1, text: 'Hello' }
  //   ]);
  //   const listenerA = jest.fn();
  //   store.subscribe(listenerA);
  //   store.dispatch({
  //     type: actions.ADD_TODO,
  //     text: 'World'
  //   });
  //   store.dispatch({
  //     type: actions.ADD_TODO,
  //     text: 'Foo'
  //   });

  //   expect(listenerA).toBeCalledTimes(2);


  //   const listenerB = jest.fn();
  //   store.subscribe(listenerB);
  //   store.dispatch({
  //     type: actions.ADD_TODO,
  //     text: 'Bar'
  //   });
  //   expect(listenerA).toBeCalledTimes(3);
  //   expect(listenerB).toBeCalledTimes(1);
  // })

  // it('should return a unsubscribe function', () => {
  //   const store = createStore(reducers.todo, [
  //     { id: 1, text: 'Hello' }
  //   ]);
  //   const listenerA = jest.fn();
  //   const unsubscribeA = store.subscribe(listenerA);
  //   store.dispatch({
  //     type: actions.ADD_TODO,
  //     text: 'World'
  //   });
  //   store.dispatch({
  //     type: actions.ADD_TODO,
  //     text: 'Foo'
  //   });

  //   const listenerB = jest.fn();
  //   store.subscribe(listenerB);
  //   unsubscribeA();
  //   store.dispatch({
  //     type: actions.ADD_TODO,
  //     text: 'Bar'
  //   });
  //   expect(listenerA).toBeCalledTimes(2);
  //   expect(listenerB).toBeCalledTimes(1);
  // })

  // // replaceReducer
  // it('throw if nextReducer is not a function', () => {
  //   const store = createStore(reducers.todo, [
  //     { id: 1, text: 'Hello' }
  //   ]);
  //   // expect 里调用 createStore 来捕捉
  //   // use as unknown, asReducer for type check
  //   expect(() => store.replaceReducer((undefined as unknown) as Reducer)).toThrow();
  //   expect(() => store.replaceReducer(('test' as unknown) as Reducer)).toThrow();
  //   expect(() => store.replaceReducer(({} as unknown) as Reducer)).toThrow();
  //   expect(() => store.replaceReducer((() => {}) as Reducer)).not.toThrow();
  // });
  // it('replaceReducer', () => {
  //   const store = createStore(reducers.todo, [
  //     { id: 1, text: 'Hello' }
  //   ]);
  //   store.dispatch({
  //     type: actions.ADD_TODO,
  //     text: 'World'
  //   });

  //   store.replaceReducer(reducers.todosReverse);

  //   store.dispatch({
  //     type: actions.ADD_TODO,
  //     text: 'Foo'
  //   });
  //   expect(store.getState()).toEqual([
  //     { id: 3, text: 'Foo' },
  //     { id: 1, text: 'Hello' },
  //     { id: 2, text: 'World' },
  //   ])
  // });

  it('slice listeners to avoid listener affects listeners array', () => {
    const store = createStore(() => []);

    let countA = 0;
    let countB = 0;
    let countC = 0;

    const unsubA = store.subscribe(() => {
        countA++;
    });

    const unsubB = store.subscribe(() => {
        countB++;
        unsubB();
    });

    const unsubC = store.subscribe(() => {
        countC++;
    });

    store.dispatch({type: 'X'});
    store.dispatch({type: 'Y'});
    expect(countA).toBe(2);
    expect(countB).toBe(1);
    expect(countC).toBe(2);
  })
})