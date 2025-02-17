import dnt from 'date-and-time'

const dateFormat = 'MMM DD YYYY'

export default {
  inEverything: false,
  eleventyComputed: {
    description: (data) => {
      let d = new Date(data.page.date)
      return `Archived /now page from ${dnt.format(d, dateFormat)}`
    },
    title: (data) => {
      let d = new Date(data.page.date)
      return `Now - ${dnt.format(d, dateFormat)}`
    }
  },
  layout: 'now.then.njk',
  permalink: 'then/{{ slug }}/index.html'
}