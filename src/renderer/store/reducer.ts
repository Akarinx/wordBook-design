import { IInitstate } from "./state"
import { ActionType } from "./action"
import { Context, createContext, Dispatch } from "react"

export const context: Context<any> = createContext('value')

export interface IContext {
  state: IInitstate,
  dispatch: Dispatch<ActionType>
}

export const reducer = (state: IInitstate, action: ActionType) => {
  switch (action.type) {
    case "ADD": {
      return {
        ...state,
        point: state.point + 1
      }
    }
    case "ADDSYNC": {
      return {
        ...state,
        point: action.payload + state.point
      }
    }
    case "ADD_FILENAME": {
      return {
        ...state,
        filename: state.fileName.push(action.payload)
      }
    }
    default:
      return state
  }
}