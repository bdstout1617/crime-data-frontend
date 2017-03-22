/* eslint-disable no-console */

import React from 'react'

import data from '../../data/counties-by-state.json'


const LocationCountySelect = ({ selectedState }) => {
  const handleChange = e => console.log(e.target.value)
  const counties = data[selectedState] || []

  if (!counties.length) return null

  return (
    <div className='mt1'>
      <label htmlFor='location-county-select' className='hide'>
        Choose a county in the state
      </label>
      <select
        className='block col-12 field field-sm select border'
        id='location-county-select'
        onChange={handleChange}
        defaultValue={''}
      >
        <option value='' disabled>County</option>
        {counties.map(c => (
          <option key={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  )
}

export default LocationCountySelect
