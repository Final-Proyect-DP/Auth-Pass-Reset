const { createConsumer } = require('./kafkaConsumer');
const mongoose = require('mongoose');
const userService = require('../services/userService');
const User = require('../models/userModel');

const messageHandler = async (message) => {
  try {
    console.log('Mensaje recibido desde Kafka:', message.value.toString());
    const encryptedMessage = JSON.parse(message.value.toString());
    const decryptedMessage = userService.decryptMessage(encryptedMessage);
    console.log('Mensaje descifrado:', decryptedMessage);

    const userData = JSON.parse(decryptedMessage);
    const user = new User({
      _id: new mongoose.Types.ObjectId(userData._id), // Asegurar que el ID sea el mismo
      email: userData.email,
      password: userData.password
    });
    await user.save();
    console.log('Usuario insertado en la base de datos:', user);
  } catch (error) {
    console.error('Error al procesar el mensaje de Kafka:', error);
  }
};

const consumer = createConsumer('pass-recover-create-group', process.env.KAFKA_TOPIC_USER_CREATE, messageHandler);
consumer.run().catch(console.error);

module.exports = { run: consumer.run };
