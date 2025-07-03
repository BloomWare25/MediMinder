import { Redis } from '@upstash/redis'

const client = new Redis({
  url: process.env.REDIS_URI ,
  token: process.env.REDIS_TOKEN,
})

export {
  client 
}