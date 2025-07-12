const redis = require('redis');

const redisClient = redis.createClient()

redisClient.connect().catch(err => {
    console.error('Error connecting to Redis:', err);
});

module.exports = redisClient;