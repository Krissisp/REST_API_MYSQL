const config = require('../db.js');

const { connection } = config;

const notFoundFile = {
  id: {
    custom: {
      async options(id) {
        const local_path = await connection.awaitQuery(`SELECT local_path FROM files WHERE id='${id}'`);
        if (!local_path[0]) {
          throw new Error('Файл с таким id не найден');
        }
      },
    },
  },
};

module.exports = notFoundFile;
