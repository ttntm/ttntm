import _ from 'lodash'
import dnt from 'date-and-time'
import fs from 'fs'
import inputData from './gitlog_data.json' assert { type: 'json' }

const offsets = {
  Mo: 0,
  Tu: 1,
  We: 2,
  Th: 3,
  Fr: 4,
  Sa: 5,
  Su: 6
}

function getCustomData(log) {
  const dayOfYear = (d) => {
    return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  }

  return log
    .map((commit) => {
      return commit.date
    })
    .reduce((map, currentEl) => {
      const currentDate = new Date(currentEl)
      const year = dnt.format(currentDate, 'YYYY')
      const dateIndexKey = `${year}-${dayOfYear(currentDate)}`
      const currentCount = (map?.counts?.[dateIndexKey] || 0) + 1

      return {
        counts: {
          ...map.counts,
          [dateIndexKey]: currentCount
        },
        years: {
          ...map.years,
          [year]: {}
        }
      }
    }, {})
}

function main() {
  const data = getCustomData(inputData)

  for (const key in data.years) {
    const firstDay = dnt.format(new Date(`01/01/${key}`), 'dd')
    const isLeapYear = dnt.isLeapYear(Number(key))
    data.years[key].days = isLeapYear ? 366 : 365
    data.years[key].offset = offsets[firstDay]
  }

  fs.writeFileSync('./src/_data/stats.json', JSON.stringify(data))
}

main()
