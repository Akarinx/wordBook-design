

import {USER,ANSWER,singleData} from './state'
export interface IAction<T, U> {
  type: T;
  payload: U;
}
export interface IPureAction<T> {
  type: T;
}
type Add = IAction<'ADD', {
  todoType: 'todo' | 'pending' | 'finished';
  todoName: string;
}>;
type ChangeTodoType = IAction<'CHANGE_TODO_TYPE', { key: number, todoType: 'todo' | 'pending' | 'finished' }>
type DeleteTodo = IAction<'DELETE_TODO', { key: number }>
type AddSync = IAction<'ADDSYNC', any>
type AddFilename = IAction<'ADD_FILENAME', string[]>
type DelFile = IAction<'DELETE_FILE', number>
type AddUser = IAction<'ADD_USER', USER>
type EditAnswer = IAction<'EDIT_ANSWER', ANSWER>
type ClearAnswer = IAction<'CLEAR_ANSWER',any>
type AddData = IAction<'ADD_DATA', singleData[]>
type AddNowFileName = IAction<'ADD_NOWFILENAME',string>
export type ActionType = Add | AddSync | AddFilename | ChangeTodoType | DeleteTodo | DelFile | AddUser | EditAnswer | AddData | AddNowFileName | ClearAnswer