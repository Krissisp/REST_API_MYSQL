const getUsersId = require('../servises/auth/getUsersId.js');

const regitrationUserSchema = {
  id: {
    notEmpty: true,
    errorMessage: 'id не должен быть пустым',
    custom: {
      async options(id) {
        const regexNumber = new RegExp(/^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/)
        if (id.match(/.*@.*\..*/) === null && id.match(regexNumber) === null) {
          throw ('id должен быть телефоном или почтой');
        }
        const users = await getUsersId()
        const isExists = users.find((user) => user.id === id);
        if (isExists) {
          throw ('Такой id уже существует');
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
