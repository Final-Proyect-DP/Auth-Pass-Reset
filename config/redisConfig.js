require('dotenv').config();
const redis = require('redis');
const logger = require('./logger');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (error) => {
  logger.error('Redis Client Error:', error);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

module.exports = redisClient;
