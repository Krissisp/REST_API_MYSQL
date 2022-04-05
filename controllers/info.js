const jwt = require('jsonwebtoken');
const {secret_key} = require('../config');

class Info {
  info = async function (req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, secret_key);
      return res.status(200).json({ id: decoded.id });
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
};

module.exports = new Info()