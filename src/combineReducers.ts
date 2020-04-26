import { AnyAction, Action } from "./types/actions";
import { Reducer, ReducersMapObject } from "./types/reducers";
import { CombinedState } from "./types/store";

export default function combineReducers<S>(
  reducers: ReducersMapObject<S, any>
): Reducer<CombinedState<S>>
export default function combineReducers<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>
): Reducer<CombinedState<S>, A>
export default function combineReducers(reducers: ReducersMapObject) {
  // reducer 筛选，只保留有效的 reducer;
  // ZHIYI: 类型校验，只保留合法的


  // 对 @redux 内置 action 进行校验，对它进行处理是 anti-part： https://github.com/reduxjs/redux/issues/186
}