const pathToFile = require('../servises/files/pathToFile')

const notFoundFile = {
  id: {
    custom: {
      async options(id) {
        const local_path = await pathToFile(id)
        if (!local_path[0]) {
          throw ('Файл с таким id не найден');
        }
      },
    },
  },
};

module.exports = notFoundFile;
