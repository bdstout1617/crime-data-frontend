import offenses from './offenses'
import { slugify } from './text'
import lookupUsa, { nationalKey } from './usa'

import data from '../../data/ucr-program-participation.json'


const lookupUcr = place => {
  const { placeId, placeType } = place
  if (placeType === 'state' && placeId) return data[slugify(placeId)]
  return data[slugify(nationalKey)]
}

const isValidUsState = placeId => lookupUsa(placeId)
const isValidCrime = crime => offenses.includes(crime)
const noNibrs = ['violent-crime', 'property-crime']

export const shouldFetchUcr = ({ placeId }) => (
  !!isValidUsState(placeId)
)

export const shouldFetchSummaries = ({ crime, placeId }) => (
  isValidCrime(crime) && isValidUsState(placeId)
)

export const shouldFetchNibrs = ({ crime, placeId }) => {
  if (noNibrs.includes(crime) || !isValidUsState(placeId)) return false
  const coverage = lookupUcr(placeId)
  return coverage && coverage.nibrs
}

export default lookupUcr
