import createStore from '../src/createStore';
import * as reducers from './helpers/reducers';
import * as actions from './helpers/actionTypes';
import { Reducer } from '../src/types/reducers';
import { Action } from '../src/types/actions';
import { unknownAction, addTodo, getStateInMiddle, subscribeInMiddle, dispatchInMiddle } from './helpers/actionCreators';

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

  // // test getState & dispatch
  it('should pass the initial action and initial state', () => {
    const store = createStore(reducers.todo, [
      { id: 1, text: 'Hello' }
    ]);

    expect(store.getState()).toEqual([
      { id: 1, text: 'Hello' }
    ])
  });

  it('applies the reducer to the previous state', () => {
    const store = createStore(reducers.todo);
    expect(store.getState()).toEqual([]);

    store.dispatch(unknownAction());
    expect(store.getState()).toEqual([]);
    
    store.dispatch(addTodo('Hello'));
    expect(store.getState()).toEqual([
      { id: 1, text: 'Hello' }
    ]);
    
    store.dispatch(addTodo('World'));
    expect(store.getState()).toEqual([
      { id: 1, text: 'Hello' },
      { id: 2, text: 'World' }
    ]);
  })

  it('applies the reducer to the initial state', () => {
    const store = createStore(reducers.todo, [
      { id: 1, text: 'Hello' }
    ]);
    expect(store.getState()).toEqual([
      { id: 1, text: 'Hello' }
    ]);

    store.dispatch(unknownAction());
    expect(store.getState()).toEqual([{ id: 1, text: "Hello" }]);
    
    store.dispatch(addTodo('World'));
    expect(store.getState()).toEqual([
      { id: 1, text: "Hello" },
      { id: 2, text: "World" }
    ]);
  });

  it('preserves the state when replacing a reducer', () => {
    const store = createStore(reducers.todo);

    store.dispatch(addTodo('Hello'));
    store.dispatch(addTodo('World'));
    expect(store.getState()).toEqual([
      { id: 1, text: 'Hello' },
      { id: 2, text: 'World' },
    ]);

    store.replaceReducer(reducers.todosReverse);
    expect(store.getState()).toEqual([
      { id: 1, text: 'Hello' },
      { id: 2, text: 'World' },
    ]);

    store.dispatch(addTodo('Perhaps'));
    expect(store.getState()).toEqual([
      { id: 3, text: 'Perhaps' },
      { id: 1, text: 'Hello' },
      { id: 2, text: 'World' },
    ]);

    store.replaceReducer(reducers.todo);
    expect(store.getState()).toEqual([
      { id: 3, text: 'Perhaps' },
      { id: 1, text: 'Hello' },
      { id: 2, text: 'World' },
    ]);

    store.dispatch(addTodo('Surely'));
    expect(store.getState()).toEqual([
      { id: 3, text: 'Perhaps' },
      { id: 1, text: 'Hello' },
      { id: 2, text: 'World' },
      { id: 4, text: 'Surely' },
    ]);
  });

  it('does not allow getState() from within a reducer', () => {
    const store = createStore(reducers.getStateInTheMiddleOfReducer);
    expect(() => store.dispatch(getStateInMiddle(store.getState))).toThrow(/You may not call store.getState()/);
    // TODO: test regular condition
  });

  it('does not allow subscribe() from within a reducer', () => {
    const store = createStore(reducers.subscribeInTheMiddleOfReducer);
    const subscribeFn = 
    expect(() => 
      store.dispatch(subscribeInMiddle(() => {
        store.subscribe(() => {});
      }))
    ).toThrow(/You may not call store.subscribe()/);
    // TODO: test regular condition
  });

  it('does not allow dispatch() from within a reducer', () => {
    const store = createStore(reducers.dispatchInTheMiddleOfReducer);
    expect(() => 
      store.dispatch(dispatchInMiddle(() => store.dispatch(unknownAction())))
    ).toThrow(/Reducers may not dispatch actions/);
    // TODO: test regular condition
  });
})