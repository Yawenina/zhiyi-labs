import { Action, AnyAction } from '../../src/types/actions';
import { UNKNOWN_ACTION, ADD_TODO } from "./actionTypes";

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