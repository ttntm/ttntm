const moment = require('moment');

module.exports = {
  date: function(date, format) {
    // date formatting filter
    return moment(date).format(format);
  },
  markdown: function(value) {
    // markdown from string filter => {{ STRING | markdown | safe }}
    let markdown = require('markdown-it')({
      html: true
    });
    return markdown.render(value);
  }
}