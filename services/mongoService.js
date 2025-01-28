const { getUserCollection } = require('../models/userModel');

const updatePassword = async (mail, newPassword) => {
  const usersCollection = await getUserCollection();
  await usersCollection.updateOne({ email: mail }, { $set: { password: newPassword } });
};

module.exports = { updatePassword };
