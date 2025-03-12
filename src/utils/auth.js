const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(Number(process.env.PASSWORD_HASH_SALT), (err, salt) => {
      if (err) {
        reject(err);
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }

        resolve(hash);
      });
    });
  });
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
