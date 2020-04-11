import { Action, AnyAction } from '../../src/types/actions';
import { UNKNOWN_ACTION, ADD_TODO, GET_STATE_IN_MIDDLE, SUBSCRIBE_IN_MIDDLE, DISPATCH_IN_MIDDLE } from "./actionTypes";

export function addTodo(text: string): AnyAction {
  return {
    type: ADD_TODO,
    text
  }
}
export function unknownAction(): Action {
  return {
    type: UNKNOWN_ACTION,
  };
}

export function getStateInMiddle(boundGetStateFn) {
  return {
    type: GET_STATE_IN_MIDDLE,
    boundGetStateFn
  }
}

export function subscribeInMiddle(boundSubscribeFn) {
  return {
    type: SUBSCRIBE_IN_MIDDLE,
    boundSubscribeFn
  }
}

export function dispatchInMiddle(boundDispatchFn) {
  return {
    type: DISPATCH_IN_MIDDLE,
    boundDispatchFn
  }
}