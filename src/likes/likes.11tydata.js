export default {
  inEverything: true,
  eleventyComputed: {
    description: "Links to interesting articles, resources and tools from {{ title }}.",
  },
  layout: "like.njk",
  image: "/img/likes.jpg",
  permalink: "likes/{{ slug }}/index.html",
  type: "Like"
}