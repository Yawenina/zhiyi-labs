export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S