import { ADD_TODO, GET_STATE_IN_MIDDLE, SUBSCRIBE_IN_MIDDLE, DISPATCH_IN_MIDDLE } from './actionTypes';
import { AnyAction } from '../../src/types/actions';

function id(state: {id: number}[]) {
  return state.reduce((result, item) => {
    return item.id > result ? item.id : result;
  }, 0) + 1;
}

export interface Todo {
  id: number,
  text: string
}
export type TodoAction = { type: 'ADD_TODO'; text: string } | AnyAction;

export function todo(state: Todo[] = [], action: TodoAction) {
  switch(action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: id(state),
          text: action.text
        }
      ]
    default: 
      return state;
  }
}

export function todosReverse(state: Todo[] = [], action: TodoAction) {
  switch (action.type) {
    case ADD_TODO:
      return [
        {
          id: id(state),
          text: action.text
        },
        ...state
      ]
    default:
      return state
  }
}

export function getStateInTheMiddleOfReducer(state = [], action) {
  switch (action.type) {
    case GET_STATE_IN_MIDDLE:
      action.boundGetStateFn();
      return state;
    default:
      return state;
  }
}

export function subscribeInTheMiddleOfReducer(state = [], action) {
  switch (action.type) {
    case SUBSCRIBE_IN_MIDDLE:
      action.boundSubscribeFn();
      return state;
    default:
      return state;
  }
}

export function dispatchInTheMiddleOfReducer(state = [], action) {
  switch (action.type) {
    case DISPATCH_IN_MIDDLE:
      action.boundDispatchFn();
      return state;
    default:
      return state;
  }
}