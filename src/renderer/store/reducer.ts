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
    case "ADD": { // 添加todo
      const todos = state.todos
      const obj = { ...action.payload, key: KEY++ }
      todos.push(obj)
      return {
        ...state,
        todos
      }
    }
    case "DELETE_TODO": { // 删除todo
      const todos = state.todos
      const index = todos.findIndex(item => action.payload.key === item.key)
      todos.splice(index, 1)
      return {
        ...state,
        todos
      }
    }
    case "CHANGE_TODO_TYPE": { // 修改todo type
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
    case "ADD_FILENAME": { // 添加文件
      let fileName = state.fileName
      fileName = action.payload
      return {
        ...state,
        fileName
      }
    }
    case "DELETE_FILE": { // 删除文件
      const fileName = state.fileName
      fileName.splice(action.payload, 1)
      return {
        ...state,
        fileName
      }
    }
    case "ADD_USER": {
      const { userName,usingtime,wordCount,wrongWordBook } = action.payload
      console.log(userName,usingtime)
      return {
        ...state,
        user: {
          userName,
          usingtime,
          wordCount,
          wrongWordBook
        }
      }
    }
    case "EDIT_ANSWER": {
      const { key, answer } = action.payload
      state.answer[key] = answer
      return {
        ...state
      }
    }
    case "CLEAR_ANSWER": {
      state.answer = {}
      return {
        ...state
      }
    }
    case "ADD_DATA": {
      return {
        ...state,
        data:action.payload
      }
    }
    case "ADD_NOWFILENAME": {
      return {
        ...state,
        nowFileName:action.payload
      }
      }
    default:
      return state
  }
}