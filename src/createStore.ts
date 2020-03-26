import { Action, AnyAction } from './types/actions';
import { Reducer } from './types/reducers';
import { Store, Unsubscribe } from './types/store';
import { Dispatch } from './types/dispatch';

export default function createStore<
  S,
  A extends Action = AnyAction
>(
  reducer: Reducer<S, A>,
  initialStat: S
): Store<S, A> {
  if (typeof reducer !== 'function') {
    throw new Error('expect reducer to be a function.');
  }
  
  function getState(): S {
    
  }
  
  function dispatch(action: A) {
    
  }

  function subscribe(listener: () => void): Unsubscribe {
    
  }

  function replaceReducer<newState, newAction extends A>(nextReducer: Reducer<newState, newAction>) {
    
  }

  return {
    getState,
    dispatch: dispatch as Dispatch<A>,
    subscribe,
    replaceReducer
  }
}