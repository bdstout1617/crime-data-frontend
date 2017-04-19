import {
  UCR_PARTICIPATION_FETCHING,
  UCR_PARTICIPATION_RECEIVED,
} from './constants'
import api from '../util/api'


export const fetchingUcrParticipation = () => ({
  type: UCR_PARTICIPATION_FETCHING,
})

export const receivedUcrParticipation = ({ placeId, results }) => ({
  type: UCR_PARTICIPATION_RECEIVED,
  placeId,
  results,
})

export const fetchUcrParticipation = place => dispatch => {
  dispatch(fetchingUcrParticipation())

  return api.getUcrParticipation(place).then(d => (
    dispatch(receivedUcrParticipation(d))
  ))
}
