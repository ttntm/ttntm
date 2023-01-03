const dnt = require('date-and-time')

module.exports = {
  buildDate: function() {
    // shortcode to display the last build date
    let now = new Date();
    let display = dnt.format(now, 'ddd, MMMM DD YYYY, HH:mm')
    return`<span>${display}</span>`
  },
  ext: function(displayText, link) {
    // shortcode to create external 'target=_blank' links
    return`<a href="${link}" title="${link}" target="_blank" rel="noopener">${displayText}</a>`
  }
}