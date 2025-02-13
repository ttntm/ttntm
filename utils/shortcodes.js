import _ from 'lodash'
import dnt from 'date-and-time'

export default {
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
    // shortcode that creates a custom filter for an input collection (i.e. whisky)
    let displayLength = 0
    const terms = collection.reduce((map, currentItem) => {
      const data = currentItem.data ?? currentItem

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

        displayLength++

        return {
          ...map,
          [filterTerm]: filterKeyCount
        }
      } else {
        return map
      }
    }, {})
    const resetBtn = `<li>
      <button class="filter-btn filter-btn__active shadow" data-reset="true" data-value="${filterKey}">
        All&nbsp;(${displayLength})
      </button>
    </li>`

    return [resetBtn]
      .concat(Object.keys(terms)
        .sort()
        .map((t) => {
          return `<li>
            <button class="filter-btn shadow" data-term="${filterKey}" data-value="${_.kebabCase(t)}">
              ${t}&nbsp;(${terms[t]})
            </button>
          </li>`
        }))
      .join('')
  },

  ext: function(displayText, link) {
    // shortcode to create external links (with a marker after the link text)
    return `<a class="ext" href="${link}" rel="noopener">${displayText}</a>`
  },

  imageHeader: function(imgPath, imgSize, titleSize, title, subtitle) {
    // shortcode to create an image + text heading row (dsktp) / block (mobile)
    const slug = _.kebabCase(title)
    const content = subtitle?.length > 0
      ? `<hgroup class="image-header__text w100m">
          <h2 id="${slug}" class="${titleSize}">
            <a class="header-anchor" href="#${slug}"><span>${title}</span></a>
          </h2>
          <p class="large m0">${subtitle}</p>
        </hgroup>`
      : `<h2 id="${slug}" class="image-header__text ${titleSize} w100m m0">
          <a class="header-anchor" href="#${slug}"><span>${title}</span></a>
        </h2>`

    return `<div class="image-header flex wrap-mobile align-items-start gap1 gap2-lg mt2 mb1">
      <img class="image-header__cover w100m m0" src="${imgPath}" width="${imgSize}" alt="${title}" title="${title}" decoding="async" loading="lazy" eleventy:ignore />
      ${content}
    </div>`
  },

  oldContentNote: function(d) {
    // shortcode to show a notice for posts older than 730 days
    let now = new Date()
    let then = new Date(d)
    let age = dnt.subtract(now, then).toDays()

    return age && age > 730
      ? `<p class="old-content-note">
          <span style="font-family: var(--font-mono); font-size: 1rem;">&#9432;&nbsp;</span><strong>It's been a while...</strong>
          <br>
          <span class="d-inline-block" style="padding-left: 1.6rem;">Facts and circumstances may have changed since publication. Please contact me before jumping to conclusions if something seems wrong or unclear.</span>
        </p>`
      : ''
  }
}