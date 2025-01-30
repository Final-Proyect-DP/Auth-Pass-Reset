const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePasswords
};
