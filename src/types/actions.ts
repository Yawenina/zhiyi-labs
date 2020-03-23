export interface Action<T = any> {
  action: T
}

export interface AnyAction extends Action{
  [extraProps: string]: any
}