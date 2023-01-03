const dnt = require('date-and-time')

module.exports = {
  date: function(date, format) {
    // date formatting filter
    return dnt.format(date, format)
  },
  markdown: function(value) {
    // markdown from string filter => {{ STRING | markdown | safe }}
    let markdown = require('markdown-it')({
      html: true
    })
    return markdown.render(value)
  }
}