import React from 'react'
import { IndexRoute, Route, Router } from 'react-router'

import About from './components/About'
import App from './components/App'
import DownloadsAndDocs from './components/DownloadsAndDocs'
import ExplorerAgency from './components/ExplorerAgency'
import ExplorerContainer from './components/ExplorerContainer'
import ExplorerUsState from './components/ExplorerUsState'
import Home from './components/Home'
import NotFound from './components/NotFound'
import history from './util/history'


const scrollToTop = () => window.scroll(0, 0)

const routes = (
  <Router history={history} onUpdate={scrollToTop}>
    <Route path='/' component={App}>
      <IndexRoute component={Home} />
      <Route path='downloads-and-docs' component={DownloadsAndDocs} />
      <Route path='explorer' component={ExplorerContainer}>
        <Route path='state/:stateName' component={ExplorerUsState} />
        <Route path='agency/:agencyOri' component={ExplorerAgency} />
      </Route>
      <Route path='about' component={About} />
      <Route path='*' component={NotFound} />
    </Route>
  </Router>
)

export default routes
