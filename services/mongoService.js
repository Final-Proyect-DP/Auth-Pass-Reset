const { getUserCollection } = require('../models/userCollection');

const updatePassword = async (mail, newPassword) => {
  const usersCollection = await getUserCollection();
  await usersCollection.updateOne({ email: mail }, { $set: { password: newPassword } });
  const user = await usersCollection.findOne({ email: mail });
  return user._id;
};

module.exports = { updatePassword };
