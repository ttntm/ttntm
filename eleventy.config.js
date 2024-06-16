import _ from 'lodash'
import anchor from 'markdown-it-anchor'
import dotenv from 'dotenv'
import htmlmin from 'html-minifier'
import markdownIt from 'markdown-it'
import pluginPostGraph from '@rknightuk/eleventy-plugin-post-graph'
import pluginReadingTime from 'eleventy-plugin-reading-time'
import pluginRss from '@11ty/eleventy-plugin-rss'
import pluginSyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import { minify } from 'terser'
import filters from './utils/filters.js'
import shortcodes from './utils/shortcodes.js'

dotenv.config()

const isProdDeployment = Boolean(
  process.env.ELEVENTY_RUN_MODE
  && process.env.ELEVENTY_RUN_MODE === 'build'
)

export default async function(config) {
  // PLUGINS
  config.addPlugin(pluginPostGraph, {
    sort: 'desc',
    boxColor: 'var(--border)',
    highlightColor: 'var(--sec)',
    textColor: 'var(--text)'
  })
  config.addPlugin(pluginRss)
  config.addPlugin(pluginSyntaxHighlight)
  config.addPlugin(pluginReadingTime)

  // FILTERS
  Object.keys(filters).forEach((filterName) => {
    config.addFilter(filterName, filters[filterName])
  })

  config.addNunjucksAsyncFilter('jsmin', async function(code, callback) {
    if (isProdDeployment) {
      try {
        const minified = await minify(code)
        callback(null, minified.code)
      } catch (ex) {
        console.error('Terser error: ', ex)
        // Fail gracefully.
        callback(null, code)
      }
    } else {
      // localhost: output unminified JS
      callback(null, code)
    }
  })

  // SHORTCODES
  Object.keys(shortcodes).forEach((shortcodeName) => {
    config.addShortcode(shortcodeName, shortcodes[shortcodeName])
  })

  config.addPairedShortcode('contact', (content) => {
    return `<h2 class="h4 text-center mt2">Nice to meet you! <a href="/hello/">Say hello</a>?</h2><ul class="flex align-items-center justify-content-center list-reset">${content}</ul>`
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
    }).use(anchor, {
      permalink: anchor.permalink.headerLink({ safariReaderFix: true }),
      slugify: s => _.kebabCase(s)
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
    return collection.getFilteredByGlob('./src/notes/**/*.md')
  })

  config.addCollection('postsByYear', (collection) => {
    // collection for the blog archive => posts grouped by year - see: https://darekkay.com/blog/eleventy-group-posts-by-year/
    return _.chain(collection.getFilteredByGlob('./src/blog/**/*.md'))
      .groupBy((post) => post.date.getFullYear())
      .toPairs()
      .reverse()
      .value()
  })

  config.addCollection('whisky', async(collection) => {
    return collection.getFilteredByGlob('./src/whisky/**/*.md')
  })

  // STATIC FILES
  config.addPassthroughCopy({ './src/static/': '/' })

  // TRANSFORM -- Minify HTML Output
  // Unless we're running `serve` mode for local development
  if (isProdDeployment) {
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
  }

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
