import createStore from '../src/createStore';
import * as reducers from './helpers/reducers';
import * as actions from './helpers/actionTypes';
import { Reducer } from '../src/types/reducers';
import { Action } from '../src/types/actions';
import { unknownAction, addTodo, getStateInMiddle, subscribeInMiddle, dispatchInMiddle, throwError } from './helpers/actionCreators';

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

  // Test isDispatching
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

  // Test subscibe
  it('throw if linstner is not a function', () => {
    const store = createStore(reducers.todo);

    expect(() => store.subscribe(undefined)).toThrow();
    expect(() => store.subscribe(null)).toThrow();
    expect(() => store.subscribe(('' as unknown) as () => void)).toThrow();
    expect(() => store.subscribe(() => {})).not.toThrow();
  })

  it('support multiple subsriptions', () => {
    const store = createStore(reducers.todo);
    const listenerA = jest.fn();
    const listenerB = jest.fn();

    let unsubscribeA = store.subscribe(listenerA);
    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(1);
    expect(listenerB.mock.calls.length).toBe(0);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(2);
    expect(listenerB.mock.calls.length).toBe(0);

    const unsubscribeB = store.subscribe(listenerB);
    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(1);

    unsubscribeA();
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(1);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(2);

    unsubscribeB();
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(2);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(2);

    unsubscribeA = store.subscribe(listenerA);
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(2);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(4);
    expect(listenerB.mock.calls.length).toBe(2);
  });

  it('only remove listener when unsubscribe is called', () => {
    const store = createStore(reducers.todo);
    const listenerA = jest.fn();
    const listenerB = jest.fn();

    const unsubscribeA = store.subscribe(listenerA);
    store.subscribe(listenerB);

    unsubscribeA();
    unsubscribeA();

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(0);
    expect(listenerB.mock.calls.length).toBe(1);
  });

  it('only remove relevant listner when unsubscribe is called',() => {
    const store = createStore(reducers.todo);
    const listener = jest.fn();

    store.subscribe(listener);
    const unsubsribeSecond = store.subscribe(listener);

    unsubsribeSecond();
    unsubsribeSecond();

    store.dispatch(unknownAction());
    expect(listener.mock.calls.length).toBe(1);
  });

  it('supports removing a subscription within a subscription', () => {
    const store = createStore(reducers.todo);
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    const listenerC = jest.fn();

    store.subscribe(listenerA);
    const unSubB = store.subscribe(() => {
      listenerB();
      unSubB();
    });
    store.subscribe(listenerC);

    store.dispatch(unknownAction());
    store.dispatch(unknownAction());

    expect(listenerA.mock.calls.length).toBe(2);
    expect(listenerB.mock.calls.length).toBe(1);
    expect(listenerC.mock.calls.length).toBe(2);
  });

  // test ensureCanMutateNextListeners
  it('notifies all subscriptions regardless if any of them gets unsubscribed in the process', () => {
    const unsubscribeHandlers = [];
    const unsubscribeAll = () => unsubscribeHandlers.forEach(unsubscribe => unsubscribe());

    const store = createStore(reducers.todo);
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    const listenerC = jest.fn();

    unsubscribeHandlers.push(store.subscribe(listenerA));
    unsubscribeHandlers.push(store.subscribe(() => {
      listenerB();
      unsubscribeAll();
    }));
    unsubscribeHandlers.push(store.subscribe(listenerC));

    store.dispatch(unknownAction());
    store.dispatch(unknownAction());

    expect(listenerA.mock.calls.length).toBe(1);
    expect(listenerB.mock.calls.length).toBe(1);
    expect(listenerC.mock.calls.length).toBe(1);
  });

  it('notifies only subscriptions active at the moment of current dispatch', () => {
    const store = createStore(reducers.todo);
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    const listenerC = jest.fn();

    let isListenerCAdded = false;

    const maybeAddListenerC = () => {
      if (!isListenerCAdded) {
        isListenerCAdded = true;
        store.subscribe(listenerC);
      }
    }

    store.subscribe(listenerA);
    store.subscribe(() => {
      listenerB();
      maybeAddListenerC();
    });

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(1);
    expect(listenerB.mock.calls.length).toBe(1);
    expect(listenerC.mock.calls.length).toBe(0);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(2);
    expect(listenerB.mock.calls.length).toBe(2);
    expect(listenerC.mock.calls.length).toBe(1);
  });

  it('use the latest snapshot of subscriptions during nested dispatch', () => {
    const store = createStore(reducers.todo);
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    const listenerC = jest.fn();
    const listenerD = jest.fn();

    let unsubscribeD;
    const unsubscribeA = store.subscribe(() => {
      listenerA();
      
      expect(listenerA.mock.calls.length).toBe(1);
      expect(listenerB.mock.calls.length).toBe(0);
      expect(listenerC.mock.calls.length).toBe(0);
      expect(listenerD.mock.calls.length).toBe(0);

      unsubscribeA();
      unsubscribeD = store.subscribe(listenerD);
      store.dispatch(unknownAction());

      expect(listenerA.mock.calls.length).toBe(1);
      expect(listenerB.mock.calls.length).toBe(1);
      expect(listenerC.mock.calls.length).toBe(1);
      expect(listenerD.mock.calls.length).toBe(1);
    });

    store.subscribe(listenerB);
    store.subscribe(listenerC);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(1);
    expect(listenerB.mock.calls.length).toBe(2);
    expect(listenerC.mock.calls.length).toBe(2);
    expect(listenerD.mock.calls.length).toBe(1);    

    unsubscribeD();
    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(1);
    expect(listenerB.mock.calls.length).toBe(3);
    expect(listenerC.mock.calls.length).toBe(3);
    expect(listenerD.mock.calls.length).toBe(1);    
  });

  it('provide an up-to-date state when a subscriber is notified', done => {
    const store = createStore(reducers.todo);
    store.subscribe(() => {
      expect(store.getState()).toEqual([
        { id: 1, text: 'Hello' }
      ]);
      done();
    });
    store.dispatch(addTodo('Hello'));
  });

  it('does not leak private listeners array', done => {
    const store = createStore(reducers.todo);
    store.subscribe(() => {
      expect(this).toBe(undefined);
      done();
    })
    store.dispatch(addTodo('Hello'));
  });

  it('only accept plain object actions', () => {
    const store = createStore(reducers.todo);
    expect(() => store.dispatch(unknownAction())).not.toThrow();

    function AwesomeMap() {}
    [null, undefined, 42, 'key', new AwesomeMap()].forEach(nonObject => {
      expect(() => store.dispatch(nonObject)).toThrow(/plain/);
    })
  });

  it('recovers from an error within a reducer', () => {
    const store = createStore(reducers.errorThrowingReducer);
    expect(() => store.dispatch(throwError())).toThrow();
    expect(() => store.dispatch(unknownAction())).not.toThrow();
  });

  it('throw if action type is missing', () => {
    const store = createStore(reducers.todo);
    expect(() => store.dispatch({} as unknown as Action)).toThrow(/Actions may not have an undefined "type" property/);
    expect(() => store.dispatch({ type: undefined })).toThrow(/Actions may not have an undefined "type" property/);
  });

  it('does not throw if action type is falsy', () => {
    const store = createStore(reducers.todo);
    expect(() => store.dispatch({ type: false })).not.toThrow();
    expect(() => store.dispatch({ type: 0 })).not.toThrow();
    expect(() => store.dispatch({ type: null })).not.toThrow();
    expect(() => store.dispatch({ type: '' })).not.toThrow();
  });

  it('throw if nextReducer is not a function', () => {
    const store = createStore(reducers.todo);
    expect(() => store.replaceReducer(undefined)).toThrow(
      /expect nextReducer to be a function./
    );
    expect(() => store.replaceReducer(() => [])).not.toThrow();
  })
})