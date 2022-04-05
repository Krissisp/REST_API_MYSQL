const Crypto = require('crypto-js');
const { secret_key } = require('../config');
const getUsersId = require('../servises/auth/getUsersId.js');
const getUsersHashPasswords = require('../servises/auth/getUsersHashPasswords.js');


const signValidData = {
  id: {
    custom: {
      async options(id) {
        const users = await getUsersId();
        const user = await users.find((user) => user.id === id);
        if (!user) {
          throw ('Пользователь не найден');
        }
      },
    },
  },
  password: {
    custom: {
      async options(password) {
        const hashs = await getUsersHashPasswords()
      
        const exists = await hashs.find((hashs) => Crypto.AES.decrypt(hashs.hashPassword, secret_key)
          .toString(Crypto.enc.Utf8) === password);
        if (!exists) {
          throw ('Неверный пароль');
        }
      },
    },
  },
};

module.exports = signValidData;
