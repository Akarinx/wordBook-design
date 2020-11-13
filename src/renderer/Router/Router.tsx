import React, { useReducer, Dispatch } from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom'
import {App} from '@/components/App'
import {Login} from '@/components/Login'
import s from './App.module.scss'
import {reducer, context} from '@/store/reducer'
import {initstate} from '@/store/state'
import {IAction} from '@/store/action'
const isPromise = obj => {
  return (
    !!obj && 
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  )
}

const middleware = (dispatch:Dispatch<any>) =>{
  return (action: IAction<any,any>) =>{
    if(isPromise(action.payload)){
      action.payload.then(val=>{
        dispatch({type:action.type,payload:val})
      })
    }else{
      dispatch(action)
    }
  }
}

export const AppRouter:React.FC =()=>{
  const [state,dispatch]=useReducer(reducer,initstate)
  return (
    <div className={s.App}>
      <context.Provider value={{state,dispatch:middleware(dispatch)}}>
        <Router>
          <Switch>
            <Route exact path="/" component={App}/>
            <Route path="/login" component={Login}/>
          </Switch>
        </Router>
      </context.Provider>
    </div>
  )
}