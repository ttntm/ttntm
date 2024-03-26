const _ = require('lodash')
const dnt = require('date-and-time')

module.exports = {
  buildDate: function(wrap = true) {
    // shortcode to display the last build date
    let now = new Date()
    let display = dnt.format(now, 'ddd, MMMM DD YYYY, HH:mm')
    let tag = dnt.format(now, 'YYYY-MM-DD HH:mm')

    return wrap
      ? `<time datetime="${tag}">${display}</time>`
      : display
  },

  customFilter: function(collection, filterKey, excludeKey = null, excludeValue = null) {
    const terms = collection.reduce((map, currentItem) => {
      const data = currentItem.data ?? undefined

      // `Boolean(o[null] !== null)` => `true` -- to make sure this function
      // does not break if `excludeKey` and `excludeValue` are omitted
      if (
        data
        && data.hasOwnProperty(filterKey)
        && data[filterKey]?.length > 0
        && data[excludeKey] !== excludeValue
      ) {
        const filterTerm = data[filterKey]
        const filterKeyCount = (map[filterTerm] || 0) + 1

        return {
          ...map,
          [filterTerm]: filterKeyCount
        }
      } else {
        return map
      }
    }, {})

    return Object.keys(terms)
      .sort()
      .map((t) => {
        return `<li>
          <button class="filter-btn shadow" data-term="${filterKey}" data-value="${_.kebabCase(t)}">
            ${t}&nbsp;(${terms[t]})
          </button>
        </li>`
      })
      .join('')
  },

  ext: function(displayText, link) {
    // shortcode to create external 'target=_blank' links
    return`<a href="${link}" target="_blank" rel="noreferrer">${displayText}</a>`
  },

  oldContentNote: function(d) {
    // shortcode to show a notice for posts older than 365 days
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