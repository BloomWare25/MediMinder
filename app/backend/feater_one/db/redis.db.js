import redis from 'redis';

// redisClient.js

const client = redis.createClient({
  url: 'redis://localhost:6379', // or your Redis connection string
});

client.on('error', (err) => {
  console.error('❌ Redis Client Error:');
});

client.connect(); // Important: This returns a Promise

export {client};
