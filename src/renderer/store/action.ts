export interface IAction<T, U> {
  type: T;
  payload: U;
}
export interface IPureAction<T>{
  type:T;
}
type Add = IPureAction<'ADD'>;
type AddSync=IAction<'ADDSYNC',any>

export type ActionType = Add | AddSync 