const dnt = require('date-and-time')

module.exports = {
  date: function(date, format) {
    // date formatting filter
    let d = new Date(date)
    return dnt.format(d, format)
  },
  getCollectionTags: function(collection) {
    let tagSet = new Set()

    for (let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag))
		}

    return Array.from(tagSet)
  },
  markdown: function(value) {
    // markdown from string filter => {{ STRING | markdown | safe }}
    let markdown = require('markdown-it')({
      html: true
    })

    return markdown.render(value)
  },
  sortByTitle: function(values) {
    return values.slice().sort((a, b) => a.data?.title?.localeCompare(b.data?.title))
  },
  sortByYearPurchased: function(values) {
    return values.slice().sort((a, b) => String(a.data?.purchased)?.localeCompare(String(b.data?.purchased)))
  }
}
