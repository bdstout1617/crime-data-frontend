import { format } from 'd3-format'
import React from 'react'

const getTickVals = (domain, ticks) => {
  const [s, e] = domain
  const step = (e - s) * 1.0 / (ticks - 1)
  return [...Array(ticks)].map((_, i) => s + i * step)
}

const fmt = x => {
  const val = +x
  return format(`,.${val > 10 || val % 1 === 0 ? 0 : 1}f`)(val)
}

const YAxis = ({ tickCt = 4, scale, width }) => {
  const values = getTickVals(scale.domain(), tickCt)
  const ticks = values.map((v, i) => {
    const pos = scale(v)

    return (
      <g key={i} transform={`translate(0, ${pos})`} className="tick">
        <line x2={width} y2="0" strokeOpacity={i === 0 ? '1' : '.25'} />
        <text fill="#000" x="-32" y="0" dy=".32em">{fmt(v)}</text>
      </g>
    )
  })

  return (
    <g className="axis axis--y" textAnchor="end">
      {ticks}
    </g>
  )
}

export default YAxis
