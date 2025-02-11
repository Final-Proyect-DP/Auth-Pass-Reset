const kafka = require('../config/kafkaConfig');
const { decryptMessage } = require('../services/userService');
const User = require('../models/User');
const logger = require('../config/logger');
require('dotenv').config();

const consumer = kafka.consumer({ groupId: 'Auth-Pass-Reset-Delete-Consumer' });
let isRunning = false;

const run = async () => {
  if (isRunning) return;

  try {
    if (!consumer.connected) {
      await consumer.connect();
      logger.info('Delete Consumer: Kafka consumer connected');
      await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_DELETE, fromBeginning: true });
      logger.info(`Delete Consumer: Subscribed to topic: ${process.env.KAFKA_TOPIC_DELETE}`);
    }

    isRunning = true;
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const encryptedMessage = JSON.parse(message.value.toString());
          const decryptedMessage = decryptMessage(encryptedMessage);
          const { id } = JSON.parse(decryptedMessage);

          const user = await User.findByIdAndDelete(id);
          logger.info(`User ${user ? 'deleted successfully' : 'not found'}: ${id}`);
        } catch (error) {
          logger.error('Error processing delete message:', error);
        }
      }
    });
  } catch (error) {
    isRunning = false;
    logger.error('Delete Consumer: Error in Kafka consumer:', error);
    throw error;
  }
};

module.exports = { run };
