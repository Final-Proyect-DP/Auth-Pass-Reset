const { MongoClient } = require('mongodb');
const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

let db;

const connectDB = async () => {
  if (!db) {
    const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbName);
  }
  return db;
};

const getUserCollection = async () => {
  const database = await connectDB();
  return database.collection('users');
};

module.exports = { getUserCollection };
