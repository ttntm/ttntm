const dnt = require('date-and-time')

module.exports = {
  buildDate: function(wrap = true) {
    // shortcode to display the last build date
    let now = new Date()
    let display = dnt.format(now, 'ddd, MMMM DD YYYY, HH:mm')

    return wrap
      ? `<time>${display}</time>`
      : display
  },
  ext: function(displayText, link) {
    // shortcode to create external 'target=_blank' links
    return`<a href="${link}" target="_blank" rel="noreferrer">${displayText}</a>`
  },
  oldContentNote: function(d) {
    // shortcode to show some notice for older posts
    let now = new Date()
    let then = new Date(d)
    let age = dnt.subtract(now, then).toDays()

    return age && age > 365
      ? `<p class="old-content-note">
          <span style="font-family: var(--font-mono); font-size: 1rem;">&#9432;&nbsp;</span><strong>It's been a while...</strong>
          <br>
          <span class="d-inline-block" style="padding-left: 1.6rem;">Facts and circumstances may have changed since publication. Please contact me before jumping to conclusions if something seems wrong or unclear.</span>
        </p>`
      : ''
  },
  replybtn: function(subject) {
    // shortcode to create a "reply with email" button
    const encodedSubject = encodeURIComponent(subject)

    return `<div class="text-center mt2">
      <h2 class="text-base mb1">Do you have feedback, questions or suggestions?</h2>
      <a href="mailto:ttntm@pm.me?subject=${encodedSubject}" class="d-inline-block btn">Reply With Email</a>
    </div>`
  }
}