import { FILTER_RESET, FILTERS_UPDATE } from './constants'
import offenses from '../util/offenses'
import lookupUsa from '../util/usa'


const isValidCrime = crime => offenses.includes(crime)
const isValidPlace = ({ type, name }) => {
  if (type === 'state') return lookupUsa(name)
  return false // TODO: add logic for non-states
}

export const resetFilter = ({ id }) => ({ type: FILTER_RESET, id })
export const updateFilters = filters => {
  const f = { ...filters }

  if (f.crime && !isValidCrime(f.crime)) delete f.crime
  if (f.place && !isValidPlace(f.place)) delete f.place

  return { type: FILTERS_UPDATE, filters: f }
}
