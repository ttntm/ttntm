import dnt from 'date-and-time'
import markdownIt from 'markdown-it'

export default {
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

  getEmailSubject: function(title) {
    const encodedSubject = encodeURIComponent(title)
    return encodedSubject
  },

  getPostMentions: function(mentions, url) {
    const data = mentions.get(`https://ttntm.me${url}`)
    return Boolean(data) ? data : undefined
  },

  markdown: function(value) {
    // markdown from string filter => {{ STRING | markdown | safe }}
    let markdown = markdownIt({ html: true })
    return markdown.render(value)
  },

  sortByOrder: function(values) {
    return values.slice().sort((a, b) => a.data?.order - b.data?.order)
  },

  sortByText: function(values, text) {
    return values.slice().sort((a, b) => a.data?.[text]?.localeCompare(b.data?.[text]))
  }
}
