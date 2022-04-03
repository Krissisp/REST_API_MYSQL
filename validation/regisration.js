const config = require('../db.js');
const connection = config.connection

const regitrationUserSchema = {
  id: {
    notEmpty: true,
    errorMessage: 'id не должен быть пустым',
    custom: {
      async options(id) {
        if (id.match(/.*@.*\..*/) === null && !Number.isInteger(Number(id))) {
          throw new Error('id должен быть телефоном или почтой');
        }
        const users = await connection.awaitQuery('SELECT id FROM users');
        const isError = users.find((user) => user.id === id);
        if (isError) {
          throw new Error('Такой id уже существует');
        }
      },
    },
  },
  password: {
    notEmpty: true,
    errorMessage: 'password не должен быть пустым',
  },
};

module.exports = regitrationUserSchema;
