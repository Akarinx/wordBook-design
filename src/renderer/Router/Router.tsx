import React, { useReducer, Dispatch, Suspense } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import s from './AppRouter.module.scss'
import { reducer, context } from '@/store/reducer'
import { initstate } from '@/store/state'
import { ActionType } from '@/store/action'
import router from './routerConfig'
import { Notfound } from '@/components/404';
import Loading from '@/components/Loading'

const isPromise = obj => {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  )
}

const middleware = (dispatch: Dispatch<ActionType>) => {
  return (action) => {
    if (isPromise(action.payload)) {
      action.payload.then(val => {
        dispatch({ type: action.type, payload: val })
      })
    } else {
      dispatch(action)
    }
  }
}

export const AppRouter: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initstate)
  const token = state.token
  console.log(token, 123)
  return (
    <div className={s.App}>
      <context.Provider value={{ state, dispatch: middleware(dispatch) }}>
        <Router>
          <Suspense fallback={<Loading />}>
            <Switch>
              {
                router.map((item, index) => {
                  return (
                    <Route key={index} path={item.path} exact render={props =>
                      (
                        !item.auth ? (<item.component {...props} />) : (token ? <item.component {...props} /> :
                          <Redirect to={{
                            pathname: '/',
                            state: { from: props.location }
                          }} />
                        )
                      )} />
                  )
                })
              }
              <Route component={Notfound} />
            </Switch>
          </Suspense>
        </Router>
      </context.Provider>
    </div>
  )
}