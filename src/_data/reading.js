const config = require('dotenv').config()
const eleventyFetch = require('@11ty/eleventy-fetch')

const ovURL = 'https://api-prod.omnivore.app/api/graphql'
const queryData = {
  query: `
    query Search($after: String, $first: Int, $query: String) {
      search(first: $first, after: $after, query: $query) {
        ... on SearchSuccess {
          edges {
            node {
              id
              title
              description
              siteName
              url
              publishedAt
              savedAt
            }
          }
          pageInfo {
            hasNextPage
            endCursor
            totalCount
          }
        }
        ... on SearchError {
          errorCodes
        }
      }
    }
  `,
  variables: {
    after: "0",
    first: 10,
    query: 'no:subscription'
  }
}

module.exports = async function() {
  try {
    const response = await eleventyFetch(ovURL, {
      directory: '.cache',
      duration: '1d',
      type: 'json',
      fetchOptions: {
        method: 'POST',
        headers: {
          Authorization: `${process.env.OV_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryData)
      }
    })

    if (response && response?.data?.search?.edges?.length > 0) {
      return response.data.search.edges.map((item) => item.node)
    } else {
      return []
    }
  } catch (ex) {
    console.log(ex.message || ex)
    return []
  }
}
