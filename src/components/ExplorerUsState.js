import startCase from 'lodash.startcase'
import React from 'react'

import AboutTheData from './AboutTheData'
import NibrsContainer from './NibrsContainer'
import NotFound from './NotFound'
import TrendContainer from './TrendContainer'
import UcrParticipationInformation from './UcrParticipationInformation'

import offenses from '../util/offenses'
import ucrParticipation from '../util/ucr'
import lookupState from '../util/usa'


const filterNibrsData = (data, { since, until }) => {
  if (!data) return false
  const filtered = {}
  Object.keys(data).forEach(key => {
    filtered[key] = data[key].filter(d => {
      const year = parseInt(d.year, 10)
      return year >= since && year <= until
    })
  })

  return filtered
}

const dataByYear = data => (
  Object.assign(
    ...Object.keys(data).map(k => ({
      [k]: Object.assign(...data[k].map(d => ({ [d.year]: d }))),
    })),
  )
)

const mungeSummaryData = (summaries, ucr, place) => {
  if (!summaries || !summaries[place]) return false

  const keys = Object.keys(summaries)
  const summaryByYear = dataByYear(summaries)
  const ucrByYear = dataByYear(ucr)

  return summaries[place].map(d => (
    Object.assign(
      { date: d.year },
      ...keys.map(k => {
        const count = summaryByYear[k][d.year].actual
        const pop = ucrByYear[k][d.year].total_population
        return { [k]: { count, pop, rate: (count / pop) * 100000 } }
      }),
    )
  ))
}

class ExplorerUsState extends React.Component {
  render() {
    const { appState, dispatch, router } = this.props
    const { params } = router
    const { crime } = router.location.query

    console.log(params)
    const place = params.placeId

    // show not found page if crime or place unfamiliar
    if (!offenses.includes(crime) || !lookupState(place)) return <NotFound />

    const { filters, nibrs, summaries, ucr } = appState
    const nibrsData = filterNibrsData(nibrs.data, filters)
    const noNibrs = ['violent-crime', 'property-crime']
    const participation = ucrParticipation(place)
    const showNibrs = (!noNibrs.includes(crime) && participation.nibrs)
    const trendData = mungeSummaryData(summaries.data, ucr.data, place)
    const trendKeys = Object.keys(summaries.data).map(k => startCase(k))

    return (
      <div className='container-main mx-auto px3 md-py3 lg-px8'>
        <div className='items-baseline my4 border-bottom border-blue-lighter'>
          <h1 className='flex-auto mt0 mb1 fs-22 sm-fs-32'>
            {startCase(place)}, {startCase(crime)}
          </h1>
        </div>
        <UcrParticipationInformation
          dispatch={dispatch}
          place={place}
          until={filters.until}
          ucr={ucr}
        />
        <hr className='mt0 mb3' />
        <TrendContainer
          crime={crime}
          place={place}
          filters={filters}
          data={trendData}
          dispatch={dispatch}
          loading={summaries.loading}
          keys={trendKeys}
        />
        {showNibrs && (<NibrsContainer
          crime={crime}
          data={nibrsData}
          dispatch={dispatch}
          error={nibrs.error}
          filters={filters}
          loading={nibrs.loading}
          place={place}
        />)}
        <hr className='mt0 mb3' />
        <AboutTheData crime={crime} place={place} />
      </div>
    )
  }
}

ExplorerUsState.defaultProps = {
}

export default ExplorerUsState
