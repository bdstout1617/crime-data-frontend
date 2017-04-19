import React from 'react'

import { updateApp } from '../actions/composite'
import { hideSidebar, showSidebar } from '../actions/sidebar'
import ExplorerAgency from './ExplorerAgency'
import ExplorerUsState from './ExplorerUsState'
import NotFound from './NotFound'
import Sidebar from './Sidebar'


class ExplorerContainer extends React.Component {
  componentDidMount() {
    const { appState, dispatch, router } = this.props
    const { since, until } = appState.filters
    const { query } = router.location

    const clean = (val, alt) => {
      const yr = +val
      return yr >= 1960 && yr <= 2014 ? yr : alt
    }

    const filters = {
      ...this.props.filters,
      ...router.params,
      crime: query.crime,
      since: clean(query.since, since),
      until: clean(query.until, until),
    }

    dispatch(updateApp(filters))
  }

  handleSidebarChange = change => {
    const { location } = this.props.router
    this.props.dispatch(updateApp(change, location))
  }

  toggleSidebar = () => {
    const { dispatch } = this.props
    const { isOpen } = this.props.appState.sidebar

    if (isOpen) return dispatch(hideSidebar())
    return dispatch(showSidebar())
  }

  render() {
    const { appState, dispatch, router } = this.props
    const { filters, sidebar } = appState

    let Child
    switch (filters.placeType) {
      case 'state': {
        Child = ExplorerUsState
        break
      }
      case 'agency': {
        Child = ExplorerAgency
        break
      }
      default: {
        Child = NotFound
      }
    }

    return (
      <div className='site-wrapper'>
        <div className='sticky top-0'>
          <div className='inline-block p1 bg-red-bright rounded-br md-hide lg-hide'>
            <button
              className='btn p1 line-height-1 border-none'
              onClick={this.toggleSidebar}
            >
              <img
                className='align-middle'
                width='22'
                height='20'
                src='/img/filters.svg'
                alt='filters'
              />
            </button>
          </div>
        </div>
        <Sidebar
          dispatch={dispatch}
          filters={filters}
          isOpen={sidebar.isOpen}
          onChange={this.handleSidebarChange}
          router={router}
        />
        <div className='site-content'>
          <Child appState={appState} dispatch={dispatch} router={router} />
        </div>
      </div>
    )
  }
}

export default ExplorerContainer
