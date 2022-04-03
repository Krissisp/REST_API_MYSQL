const config = require('../db.js');
const connection = config.connection

const Crypto = require('crypto-js');
const { secret_key } = require('../env');

const signValidData = {
  id: {
    custom: {
      async options(id) {
        const users = await connection.awaitQuery('SELECT id FROM users');
        const user = users.find((user) => user.id === id);
        if (!user) {
          throw new Error('Пользователь не найден');
        }
      },
    },
  },
  password: {
    custom: {
      async options(password) {
        const hash = await connection.awaitQuery('SELECT hashPassword FROM users');
        const find = hash.find((el) => Crypto.AES.decrypt(el.hashPassword, secret_key)
          .toString(Crypto.enc.Utf8) === password);
        if (!find) {
          throw new Error('Неверный пароль');
        }
      },
    },
  },
};

module.exports = signValidData;
