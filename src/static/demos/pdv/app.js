import { h, render } from 'https://esm.sh/preact@10.4.7'
import { useEffect, useState } from 'https://esm.sh/preact@10.4.7/hooks'
import htm from 'https://esm.sh/htm@3.0.4'
import Components from './components.js'

const html = htm.bind(h)

function createStatMap(input) {
  return input.reduce((dateMap, currentRow) => {
    const dateKey = formatDateTime(currentRow.DateOfCalculation)
    const currentDate = dateMap[dateKey] ?? []
    const currentDayCount = Number(currentDate.length <= 0)
    const currentTotals = dateMap._totals ?? {}

    const data = {
      AssetName: currentRow.DeviceId,
      DistanceOnBike: currentRow.DistanceOnBike,
      DistanceOnFoot: currentRow.DistanceOnFoot,
      MetersOfHeight: currentRow.MetersOfHeight
    }

    const newTotals = {
      DistanceOnBike: (currentTotals.DistanceOnBike || 0) + currentRow.DistanceOnBike,
      DistanceOnFoot: (currentTotals.DistanceOnFoot || 0) + currentRow.DistanceOnFoot,
      MetersOfHeight: (currentTotals.MetersOfHeight || 0) + currentRow.MetersOfHeight,
      NumberOfDays: (currentTotals.NumberOfDays || 0) + currentDayCount
    }

    return {
      ...dateMap,
      [dateKey]: currentDate.concat([data]),
      _totals: newTotals
    }
  }, {})
}

function formatDateTime(input) {
  if (input) {
    let dt = new Date(input).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
    return dt.toString()
  }
}

function objectSort(field, reverse, primer) {
  const key = primer
    ? (x) => primer(x[field])
    : (x) => x[field]

  const reversed = !reverse ? 1 : -1

  return function (a, b) {
    return a = key(a), b = key(b), reversed * (Number(a > b) - Number(b > a))
  }
}

// Initialization call for components defined in `components.js`
const {
  Stats
} = Components()

export default function App(config) {
  // Config passed from `index.html`
  const { rawStats } = config
  const sortedStats = rawStats && rawStats.length > 0
    ? rawStats.sort(objectSort('DateOfCalculation', true, (d) => new Date(d)))
    : []

  const Main = () => {
    const [firstTimeRender, setFirstTimeRender] = useState(true)
    const [statMap, setStatMap] = useState(null)

    useEffect(() => {
      if (firstTimeRender) {
        setStatMap(current => {
          return sortedStats && sortedStats.length > 0
            ? createStatMap(sortedStats)
            : null
        })

        setFirstTimeRender(false)
      }
    }, [])

    return html`
      <h1>Preact Data Viewer + Tree Demo</h1>
      <p style="margin-bottom: 3rem;">A data viewer + nav tree rendered from an array of objects (i.e. rows obtained from a DB).<br/>Built with <a href="https://ttntm.me/blog/buildless-preact-starter/">buildless Preact</a>.</p>
      <${Stats} statMap="${statMap}" />
    `
  }

  render(html`<${Main} />`, document.querySelector('#app-container'))
}
