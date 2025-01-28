const bcrypt = require('bcrypt');

const compareCodes = (code, hashedCode) => {
  return bcrypt.compare(code, hashedCode);
};

const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

module.exports = { compareCodes, hashPassword };
