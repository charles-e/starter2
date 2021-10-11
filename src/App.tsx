import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import GlobalHeader from '@/layout/GlobalHeader'
import routes from '@/router'
function App() {
  return (
    <Router>
      <GlobalHeader />

      <Switch>
        {routes.map((route) => (
          <Route exact key={route.path} path={route.path}>
            <route.component />
          </Route>
        ))}
      </Switch>
    </Router>
  )
}

export default App
