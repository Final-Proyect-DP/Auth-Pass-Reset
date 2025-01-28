const { Kafka } = require('kafkajs');
const crypto = require('crypto');
const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
const producer = kafka.producer();

const encryptMessage = (message) => {
  const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(JSON.stringify(message), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
};

const sendMessage = async (message) => {
  const encryptedMessage = encryptMessage(message);
  await producer.connect();
  await producer.send({
    topic: process.env.KAFKA_TOPIC,
    messages: [
      { value: JSON.stringify(encryptedMessage) },
    ],
  });
  await producer.disconnect();
};

module.exports = { sendMessage };
