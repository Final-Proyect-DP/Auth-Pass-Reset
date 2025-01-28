const { Kafka } = require('kafkajs');
const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
const producer = kafka.producer();

const sendMessage = async (message) => {
  await producer.connect();
  await producer.send({
    topic: process.env.KAFKA_TOPIC,
    messages: [
      { value: JSON.stringify(message) },
    ],
  });
  await producer.disconnect();
};

module.exports = { sendMessage };
