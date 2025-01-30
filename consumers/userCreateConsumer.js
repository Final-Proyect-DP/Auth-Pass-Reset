const kafka = require('../config/kafkaConfig');
const logger = require('../config/logger');
const userService = require('../services/userService');
const User = require('../models/User');
require('dotenv').config();

const consumer = kafka.consumer({ groupId: 'APR-service-create-group' });

const run = async () => {
  try {
    await consumer.connect();
    logger.info('Create Consumer: Kafka consumer connected');
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_USER_CREATE, fromBeginning: true });
    logger.info(`Create Consumer: Subscribed to topic: ${process.env.KAFKA_TOPIC_USER_CREATE}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const encryptedMessage = JSON.parse(message.value.toString());
          console.log('Encrypted message:', encryptedMessage);

          const decryptedData = JSON.parse(userService.decryptMessage(encryptedMessage));
          

          const userData = {
            _id : decryptedData.id,
            email: decryptedData.email,
            password: decryptedData.password
          };

          console.log('User data to save:', userData);
          const savedUser = await User.create(userData);
          logger.info(`User saved successfully with ID: ${savedUser._id}`);

        } catch (error) {
          console.log('Error processing message:', error);
        }
      },
    });
  } catch (error) {
    logger.error('Create Consumer: Error starting consumer:', error);
    throw error;
  }
};

module.exports = { run };
