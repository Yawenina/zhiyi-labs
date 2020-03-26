import { Action, AnyAction } from './actions';
export interface Dispatch<A extends Action = AnyAction> {
  (action: A): A
}