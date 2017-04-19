import upperFirst from 'lodash.upperfirst'

import { get } from './http'
import { mapToApiOffense, mapToApiOffenseParam } from './offenses'
import { slugify } from './text'
import lookupUsa, { nationalKey } from './usa'


const API = '/api'

const dimensionEndpoints = {
  ageNum: 'age_num',
  locationName: 'location_name',
  raceCode: 'race_code',
  relationship: 'offender_relationship',
  sexCode: 'sex_code',
}

const getNibrs = ({ crime, dim, place, type }) => {
  const field = dimensionEndpoints[dim]
  const fieldPath = `${field}/offenses`
  const loc = (place === nationalKey) ? 'national' : `states/${lookupUsa(place).toUpperCase()}`

  const url = `${API}/${type}s/count/${loc}/${fieldPath}`
  const params = {
    per_page: 50,
    aggregate_many: false,
    explorer_offense: mapToApiOffense(crime),
  }

  return get(url, params).then(d => ({
    key: `${type}${upperFirst(dim)}`,
    data: d.results,
  }))
}

const getNibrsRequests = params => {
  const { crime, place } = params

  const slices = [
    { type: 'offender', dim: 'sexCode' },
    { type: 'offender', dim: 'raceCode' },
    { type: 'offender', dim: 'ageNum' },
    { type: 'offense', dim: 'locationName' },
    { type: 'victim', dim: 'ageNum' },
    { type: 'victim', dim: 'raceCode' },
    { type: 'victim', dim: 'sexCode' },
    { type: 'victim', dim: 'relationship' },
  ]

  return slices.map(s => getNibrs({ ...s, crime, place }))
}

const buildSummaryQueryString = params => {
  const { crime, place, since, until } = params
  const offense = mapToApiOffense(crime)
  const offenseParam = mapToApiOffenseParam(crime)

  const qs = [
    `${offenseParam}=${offense}`,
    `per_page=${(until - since) + 1}`,
    `year>=${since}`,
    `year<=${until}`,
  ]

  if (place && place !== nationalKey) {
    qs.push(`state=${lookupUsa(params.place)}`)
  }

  return qs.join('&')
}

const getSummary = params => {
  const { placeId } = params
  const endpoint = `${API}/counts`
  const qs = buildSummaryQueryString(params)

  return get(`${endpoint}?${qs}`).then(d => ({
    placeId,
    results: d.results,
  }))
}

const getSummaryRequests = params => {
  const { crime, placeId, since, until } = params

  const requests = [
    getSummary({ crime, placeId, since, until }),
  ]

  // add national summary request (unless you already did)
  if (placeId !== nationalKey) {
    requests.push(getSummary({ crime, placeId: nationalKey, since, until }))
  }

  return requests
}

const getUcrParticipation = ({ placeId, placeType }) => {
  let path

  if (!placeId || placeId === nationalKey) {
    path = 'participation/national'
  } else if (placeType === 'state' && placeId) {
    path = `participation/states/${lookupUsa(placeId).toUpperCase()}`
  }

  return get(`${API}/${path}`).then(response => ({
    placeId: slugify(placeId),
    results: response.results,
  }))
}

export default {
  getNibrs,
  getNibrsRequests,
  getSummary,
  getSummaryRequests,
  getUcrParticipation,
}
