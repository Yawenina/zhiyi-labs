import { Action, AnyAction } from './types/actions';
import { Reducer } from './types/reducers';
import { Store, Unsubscribe } from './types/store';
import { Dispatch } from './types/dispatch';
import isPlainObject from './utils/isPlainObject';

export var ActionTypes = {
  INIT: '@@redux/INIT'
};

export default function createStore<
  S,
  A extends Action
>(
  reducer: Reducer<S, A>,
  initialState?: S
): Store<S, A> {
  if (typeof reducer !== 'function') {
    throw new Error('expect reducer to be a function.');
  }

  let currentReducer = reducer;
  let currentState = initialState as S;

  function getState(): S {
    return currentState as S;
  }
  
  function dispatch(action: A) {
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
         'Use custom middleware for async actions.'
      )
    }
    currentState = currentReducer(currentState, action);
    return action;
  }

  function subscribe(listener: () => void): Unsubscribe {
    
  }

  function replaceReducer<newState, newAction extends A>(nextReducer: Reducer<newState, newAction>) {
    
  }

  // init：触发每个 reducer 的 default, 生成 init state tree
  dispatch({ type: ActionTypes.INIT } as A)

  return {
    getState,
    dispatch: dispatch as Dispatch<A>,
    subscribe,
    replaceReducer
  }
}