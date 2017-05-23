import startCase from 'lodash.startcase'
import React from 'react'

import LocationSelect from './LocationSelect'
import { oriToState } from '../util/ori'

const LocationFilter = ({ onChange, place, placeType }) => {
  const isAgency = placeType === 'agency'
  const selected = isAgency ? oriToState(place) : place

  return (
    <div id="location" className="mb4">
      <div className="mb3 fs-22 bold border-bottom">Location</div>
      <LocationSelect onChange={onChange} selected={startCase(selected)} />
    </div>
  )
}

LocationFilter.defaultProps = {
  selected: '',
}

export default LocationFilter
