import { ADD_TODO } from './actionTypes';
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