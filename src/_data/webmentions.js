import dotenv from 'dotenv'
import eleventyFetch from '@11ty/eleventy-fetch'

dotenv.config()

const wmMap = new Map()
const wmURL = `https://webmention.io/api/mentions.jf2?domain=ttntm.me&token=${process.env.WM_TOKEN}&per-page=1000`

export default async function() {
  try {
    const response = await eleventyFetch(wmURL, {
      directory: '.cache',
      duration: '4h',
      type: 'json',
      fetchOptions: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    })

    if (response && response.children && response.children.length > 0) {
      response.children.forEach((entry) => {
        /**
         * 'wm-property':
         *  - likes => "like-of",
         *  - reposts => "repost-of",
         *  - comments => "mention-of", "in-reply-to"
         */
        const {
          'wm-property': type,
          'wm-target': target
        } = entry

        const existing = wmMap.get(target)

        if (existing) {
          wmMap.set(target, {
            ...existing,
            [type]: (existing[type] ?? 0) + 1
          })
        } else {
          wmMap.set(target, {
            [type]: 1
          })
        }
      })
    }
  } catch (ex) {
    console.log(ex.message || ex)
  } finally {
    return wmMap
  }
}
