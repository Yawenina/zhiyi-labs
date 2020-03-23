import { Action } from './types/actions';
import { Reducer } from './types/reducers';

export default function createStore<
  S,
  A extends Action
>(
  reducer: Reducer<S, A>,
  initState: S
) {

  let currentState = initState;
  let currentReducer = reducer;
  let listeners = [];

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return function name() {
      const index = listener.findIndex(listener);
      listeners.splice(index, 1);
    }
  }

  function dispatch(action) {
    currentState = currentReducer(currentState, action);
    listeners.slice().forEach(listener => listener());
  }

  function replaceReducer() {
    
  }

  // 这样 reducer 会走到 default 分支，也即返回初始值，生成最初的 state tree
  dispatch({ types: '@@redux/INIT' });

  return {
    getState,
    subscribe,
    dispatch,
    replaceReducer,
  }
}