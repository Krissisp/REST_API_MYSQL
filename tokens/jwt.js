const jwt = require('jsonwebtoken');
const { secret_key, secret_ref_key } = require('../env');

class Token {
  getToken = function getToken(id) {
    const token = jwt.sign({ id }, secret_key, { expiresIn: '10m' });
    return `Bearer ${token}`;
  };

  getRefreshToken = function getRefreshToken(id) {
    const ref_token = jwt.sign({ id }, secret_ref_key, { expiresIn: '30d' });
    return ref_token;
  };
}

module.exports = new Token();
