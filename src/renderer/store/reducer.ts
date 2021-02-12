import { IInitstate } from "./state"
import { ActionType } from "./action"
import { Context, createContext, Dispatch } from "react"

export const context: Context<any> = createContext('value')

export interface IContext {
  state: IInitstate,
  dispatch: Dispatch<ActionType>
}
let KEY = 0
export const reducer = (state: IInitstate, action: ActionType) => {
  switch (action.type) {
    case "ADD": {
      const todos = state.todos
      const obj = { ...action.payload, key: KEY++ }
      todos.push(obj)
      return {
        ...state,
        todos
      }
    }
    case "DELETE_TODO": {
      const todos = state.todos
      const index = todos.findIndex(item => action.payload.key === item.key)
      todos.splice(index, 1)
      return {
        ...state,
        todos
      }
    }
    case "CHANGE_TODO_TYPE": {
      const todos = state.todos
      const index = todos.findIndex(item => action.payload.key === item.key)
      todos[index].todoType = action.payload.todoType
      return {
        ...state,
        todos
      }
    }
    case "ADDSYNC": {
      return {
        ...state,
        point: action.payload + state.point
      }
    }
    case "ADD_FILENAME": {
      const fileName = state.fileName
      fileName.push(action.payload)
      return {
        ...state,
        fileName
      }
    }
    case "DELETE_FILE": {
      const fileName = state.fileName
      fileName.splice(action.payload, 1)
      console.log(fileName)
      return {
        ...state,
        fileName
      }
    }
    default:
      return state
  }
}