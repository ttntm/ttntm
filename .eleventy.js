// PKGS
const _ = require('lodash')
const htmlmin = require('html-minifier')
const markdownIt = require('markdown-it')
const pluginReadingTime = require('eleventy-plugin-reading-time')
const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const { minify } = require('terser')

// LOCAL DEPS
const filters = require('./utils/filters.js')
const shortcodes = require('./utils/shortcodes.js')

module.exports = (config) => {
  // PLUGINS
  config.addPlugin(pluginRss)
  config.addPlugin(pluginSyntaxHighlight)
  config.addPlugin(pluginReadingTime)

  // FILTERS
  Object.keys(filters).forEach((filterName) => {
    config.addFilter(filterName, filters[filterName])
  })

  config.addNunjucksAsyncFilter('jsmin', async function(code, callback) {
    try {
      const minified = await minify(code)
      callback(null, minified.code)
    } catch (ex) {
      console.error('Terser error: ', ex)
      // Fail gracefully.
      callback(null, code)
    }
  })

  // SHORTCODES
  Object.keys(shortcodes).forEach((shortcodeName) => {
    config.addShortcode(shortcodeName, shortcodes[shortcodeName])
  })

  config.addPairedShortcode('contact', (content) => {
    return `<h2 class="h4 text-center mt2">Nice to meet you. Say hello?</h2><ul class="flex align-items-center justify-content-center list-reset">${content}</ul>`
  })

  // rebuild on CSS changes
  config.addWatchTarget('./src/_includes/css/')

  // Markdown
  config.setLibrary(
    'md',
    markdownIt({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true
    })
  )

  // COLLECTIONS
  config.addCollection('blog', async(collection) => {
    return collection.getFilteredByGlob('./src/blog/**/*.md')
  })

  config.addCollection('likes', async(collection) => {
    return collection.getFilteredByGlob('./src/likes/**/*.md')
  })

  config.addCollection('notes', async(collection) => {
    return collection.getFilteredByGlob('./src/notes/*.md')
  })

  config.addCollection('postsByYear', (collection) => {
    // collection for /archive => posts grouped by year - see: https://darekkay.com/blog/eleventy-group-posts-by-year/
    return _.chain(collection.getFilteredByGlob('./src/blog/**/*.md'))
      .groupBy((post) => post.date.getFullYear())
      .toPairs()
      .reverse()
      .value()
  })

  // STATIC FILES
  config.addPassthroughCopy({ './src/static/': '/' })

  // TRANSFORM -- Minify HTML Output
  config.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      })
      return minified
    }
    return content
  })

  return {
    dir: {
      input: 'src',
      output: 'public',
      data: '_data',
      includes: '_includes',
      layouts: '_layouts'
    },
    templateFormats: [
      'md',
      'njk',
      '11ty.js'
    ],
    htmlTemplateEngine: 'njk'
  }
}
