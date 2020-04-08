import { Action, AnyAction } from './types/actions';
import { Reducer } from './types/reducers';
import { Store, Unsubscribe } from './types/store';
import { Dispatch } from './types/dispatch';
import isPlainObject from './utils/isPlainObject';
import ActionTypes from './utils/actionTypes';

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
  let currentListeners: (() => void)[] | null = [];
  let nextListeners = currentListeners;
  let isDispatching = false;

  // https://github.com/reduxjs/redux/commit/c031c0a8d900e0e95a4915ecc0f96c6fe2d6e92b
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function getState(): S {
    // added here to prevent anti-paattern: https://github.com/reduxjs/redux/issues/1568
    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing. ' +
          'The reducer has already received the state as an argument. ' +
          'Pass it down from the top reducer instead of reading it from the store.'
      )
    }
    return currentState as S;
  }

  function subscribe(listener: () => void): Unsubscribe {
    if (typeof listener !== 'function') {
      throw new Error('expect the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing. ' +
          'The reducer has already received the state as an argument. ' +
          'Pass it down from the top reducer instead of reading it from the store.'
      )
    }

    
    let isSubscribed = true;

    // 使用这种方式，可以避免每次 dispatch 的时候都生成新的数组
    // https://github.com/reduxjs/redux/commit/c031c0a8d900e0e95a4915ecc0f96c6fe2d6e92b
    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    /**
     * ZHIYI_THOUGHTS: 
     * https://github.com/reduxjs/redux/commit/b7031ce3acb23b6ecadbd977b1cfa32486447904?diff=unified
     * 增加 isSubscribed 的标志态，如果subscribe了多个相同的 listener, 
     * 其中多次调用某一个 unsubscribe，会把其他相同的listener 也给删除掉，增加 isSubscirbe, 可保证只会 unsubscribe 当前这个
     * see: playground/unsubscribe-isSubscribed.ts
     */

    return function unSubscribe() {
      if (!isSubscribed) return;

      isSubscribed = false;

      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    }
  }

  function dispatch(action: A) {
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
         'Use custom middleware for async actions.'
      )
    }

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      );
    }

    if (isDispatching) {
      throw new Error(
        'Reducers may not dispatch actions.'
      )
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    /** ZHIYI_THOUGHTS
     * https://github.com/reduxjs/redux/issues/461
     * 用 slice 保证这一轮的调用不会受影响(A unsubscribe B, BC 这一轮还是会被调用, 改变的是原数组)；
     * 不用 slice, 这一轮的调用会受影响(B unsubscribe B, C 这一轮不会被调用)。
     * 相比较来说 slice 更合理，可以保证本轮的调用。
     * see: playground/subscirbe-slice.ts
     */
    // currentListeners.slice().forEach((listener) => {
    //   listener()
    // });

    // https://github.com/reduxjs/redux/commit/c031c0a8d900e0e95a4915ecc0f96c6fe2d6e92b
    const listeners = currentListeners = nextListeners;
    // 把 forEach 换成 for 循环：https://github.com/reduxjs/redux/commit/5b586080b43ca233f78d56cbadf706c933fefd19
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
    return action;
  }



  function replaceReducer<newState, newAction extends A>(nextReducer: Reducer<newState, newAction>) {
    if (typeof nextReducer !== 'function') {
      throw new Error('expect nextReducer to be a function.');
    }
    currentReducer = nextReducer as Reducer;
    // replace 之后要生成一下默认值, 这个时候还能拿到之前的 old state;
    dispatch({ type: ActionTypes.REPLACE } as A);
    return store;
  }

  // init：触发每个 reducer 的 default, 生成 init state tree
  dispatch({ type: ActionTypes.INIT } as A);

  const store = {
    getState,
    subscribe,
    dispatch,
    replaceReducer
  }

  return store;
}