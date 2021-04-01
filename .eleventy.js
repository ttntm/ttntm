const _ = require('lodash');
const htmlmin = require("html-minifier");
const markdownIt = require('markdown-it');
const moment = require('moment');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  // PLUGINS
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  // date formatting filter
  eleventyConfig.addFilter('date', function(date, format) {
    return moment(date).format(format);
  });

  // shortcode to render markdown from string => {{ STRING | markdown | safe }}
  eleventyConfig.addFilter('markdown', function(value) {
    let markdown = require('markdown-it')({
      html: true
    });
    return markdown.render(value);
  });

  // shortcode to create external 'target=_blank' links
  eleventyConfig.addShortcode('ext', function(displayText, link) {
    return`<a href="${link}" title="${link}" target="_blank" rel="noopener">${displayText}</a>`
  });

  eleventyConfig.addPairedShortcode('contact', function(content) {
    return `<h2 class="h4 text-center mt2">Wanna stay in touch?</h2><section class="flex align-items-center justify-content-center mb1">${content}</section>`;
  });

  // rebuild on CSS changes
  eleventyConfig.addWatchTarget('./src/_includes/css/');

  // Markdown
  eleventyConfig.setLibrary(
    'md',
    markdownIt({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true
    })
  )

  //create collections
  eleventyConfig.addCollection('blog', async (collection) => {
    return collection.getFilteredByGlob('./src/blog/*.md');
  });

  eleventyConfig.addCollection('postsByYear', (collection) => {
    // collection for /archive => posts grouped by year - see: https://darekkay.com/blog/eleventy-group-posts-by-year/
    return _.chain(collection.getFilteredByGlob('./src/blog/*.md'))
      .groupBy((post) => post.date.getFullYear())
      .toPairs()
      .reverse()
      .value();
  });

  eleventyConfig.addCollection('til', async (collection) => {
    return collection.getFilteredByGlob('./src/til/*.md');
  });

  // STATIC FILES
  eleventyConfig.addPassthroughCopy({ './src/static/': '/' });

  // TRANSFORM -- Minify HTML Output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if( outputPath && outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

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
  };
};