const dnt = require('date-and-time')

module.exports = {
  buildDate: function() {
    // shortcode to display the last build date
    let now = new Date();
    let display = dnt.format(now, 'ddd, MMMM DD YYYY, HH:mm')
    return`<time>${display}</time>`
  },
  ext: function(displayText, link) {
    // shortcode to create external 'target=_blank' links
    return`<a href="${link}" title="${link}" target="_blank" rel="noopener">${displayText}</a>`
  },
  replybtn: function(subject) {
    // shortcode to create a "reply with email" button
    const encodedSubject = encodeURIComponent(subject)
    return `<div class="text-center mt2">
      <p>Do you have feedback, questions or suggestions?</p>
      <a href="mailto:ttntm@pm.me?subject=${encodedSubject}" class="d-inline-block btn">Reply With Email</a>
    </div>`
  }
}