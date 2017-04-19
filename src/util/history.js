import { browserHistory } from 'react-router'


const createNewPathname = ({ change, oldPath }) => {
  if (change.placeType) {
    return `/explorer/${change.placeType}/${change.placeId}`
  }
  return oldPath
}

const createNewQuery = ({ change, oldQuery }) => {
  const { placeId, placeType, ...rest } = change /* eslint no-unused-vars: 0 */

  return {
    ...oldQuery,
    ...rest,
  }
}

export const createNewLocation = ({ change, location, params }) => {
  const pathname = createNewPathname({ change, oldPath: location.pathname })
  const query = createNewQuery({ change, oldQuery: location.query })

  return {
    ...location,
    query,
    pathname,
  }
}

export default browserHistory
