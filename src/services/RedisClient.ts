import { createClient } from 'redis';

export default {
  getClient: async () => {
    const client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    return client;
  }
};