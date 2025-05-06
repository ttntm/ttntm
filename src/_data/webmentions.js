import dotenv from 'dotenv'
import Cloudflare from 'cloudflare'

dotenv.config()

export default async function() {
  const wmMap = new Map()

  try {
    const client = new Cloudflare({
      apiToken: process.env.CF_TOKEN
    })

    // Automatically fetches more pages as needed.
    for await (const key of client.kv.namespaces.keys.list('09b53c4a973e40c6b27ccf501b9151f0', {
      account_id: process.env.CF_ACC_ID
    })) {
      wmMap.set(key.name, {
        ...key.metadata
      })
    }
  } catch (ex) {
    console.log(ex.message || ex)
  } finally {
    return wmMap
  }
}
