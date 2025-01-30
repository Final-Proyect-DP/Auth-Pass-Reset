const redisClient = require('../config/redisConfig');
const logger = require('../config/logger');

const redisUtils = {
  async setToken(userId, token, expirationTime = 3600) {
    return new Promise((resolve, reject) => {
      redisClient.setex(userId, expirationTime, token, (err, reply) => {
        if (err) {
          logger.error('Error setting token in Redis:', err);
          reject(err);
        }
        logger.info(`Token set for user ${userId}`);
        resolve(reply);
      });
    });
  },

  async getToken(userId) {
    return new Promise((resolve, reject) => {
      redisClient.get(userId, (err, reply) => {
        if (err) {
          logger.error('Error retrieving token from Redis:', err);
          reject(err);
        }
        resolve(reply);
      });
    });
  },

  async deleteToken(userId) {
    return new Promise((resolve, reject) => {
      redisClient.del(userId, (err, reply) => {
        if (err) {
          logger.error('Error deleting token from Redis:', err);
          reject(err);
        }
        const message = reply ? 'Session successfully closed' : 'Session not found';
        logger.info(`${message} for user ${userId}`);
        resolve({ success: true, message });
      });
    });
  },

  async verifyResetCode(email, code) {
    return new Promise((resolve, reject) => {
      redisClient.get(email, (err, storedCode) => {
        if (err) {
          logger.error('Error verifying reset code:', err);
          reject(err);
        }
        if (!storedCode) {
          logger.info(`No reset code found for email ${email}`);
          resolve({ isValid: false, message: 'Código de restablecimiento no encontrado o expirado' });
          return;
        }

        // Convertir ambos códigos a string para comparación
        const isValid = String(code) === String(storedCode);
        logger.info(`Reset code validation for ${email}: ${isValid} (Stored: ${storedCode}, Received: ${code})`);
        
        resolve({
          isValid,
          message: isValid ? 'Código válido' : 'Código inválido'
        });
      });
    });
  }
};

module.exports = redisUtils;
