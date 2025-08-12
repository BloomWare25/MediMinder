import { Redis } from '@upstash/redis'
import 'dotenv/config'

const client = new Redis({
    url: process.env.REDIS_URI,
    token: process.env.REDIS_TOKEN,
})

export {
    client
}