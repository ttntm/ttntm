import dotenv from 'dotenv'
import eleventyFetch from '@11ty/eleventy-fetch'

dotenv.config()

const rdURL = 'https://api.raindrop.io/rest/v1/raindrops/-1?perpage=20'

export default async function() {
  try {
    const response = await eleventyFetch(rdURL, {
      directory: '.cache',
      duration: '1d',
      type: 'json',
      fetchOptions: {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.RD_API_KEY}`,
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    })

    if (response && response?.result && response?.items?.length > 0) {
      return response.items.map((item) => {
        return {
          description: item.excerpt,
          domain: item.domain,
          saved: item.created,
          title: item.title,
          url: item.link
        }
      })
    } else {
      return []
    }
  } catch (ex) {
    console.log(ex.message || ex)
    return []
  }
}
