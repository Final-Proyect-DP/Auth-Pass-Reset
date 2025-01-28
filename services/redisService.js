const redis = require('redis');
const redisClient = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });

const getCode = (mail) => {
  return new Promise((resolve, reject) => {
    redisClient.get(mail, (err, code) => {
      if (err) reject(err);
      resolve(code);
    });
  });
};

module.exports = { getCode };
