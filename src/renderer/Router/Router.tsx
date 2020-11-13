import React from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom'
import {App} from '@/components/App'
import {Header} from '@/components/Header'
export const AppRouter:React.FC =()=>{
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={App}/>
          <Route path="/login" component={Header}/>
        </Switch>
      </Router>
    </div>
  )
}