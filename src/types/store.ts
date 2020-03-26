import { Action, AnyAction } from './actions';
import { Dispatch } from './dispatch';
import { Reducer } from './reducers';

export interface Unsubscribe {
  (): void
}
export interface Store<
  S, 
  A extends Action = AnyAction
> {
  getState(): S
  dispatch: Dispatch<A>,
  subscribe(listener: () => void): Unsubscribe,
  replaceReducer(reducer: Reducer<S, A>): void,
}