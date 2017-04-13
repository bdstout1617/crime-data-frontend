import React from 'react'


const ExplorerContainer = ({ appState, children, dispatch }) => {
  const hey = ''
  return (
    <div>
      <h1>Explorer Container {hey}</h1>
      {children && React.cloneElement(children, { appState, dispatch })}
    </div>
  )
}

export default ExplorerContainer
