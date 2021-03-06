const Crypto = require('crypto-js');
const { secret_key } = require('./config');

async function crypto(password) {
  const ciphertext = Crypto.AES.encrypt(`${password}`, secret_key).toString();
  return Promise.resolve(ciphertext);
}

module.exports = crypto;
