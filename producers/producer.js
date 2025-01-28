const { Kafka } = require('kafkajs');
const crypto = require('crypto');
const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
const producer = kafka.producer();

const encryptMessage = (message) => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(JSON.stringify(message), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const sendMessage = async (message) => {
  const encryptedMessage = encryptMessage(message);
  await producer.connect();
  await producer.send({
    topic: process.env.KAFKA_TOPIC,
    messages: [
      { value: encryptedMessage },
    ],
  });
  await producer.disconnect();
};

module.exports = { sendMessage };
