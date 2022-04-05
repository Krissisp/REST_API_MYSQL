const config = require('../../db.js');
const connection = config.connection;

module.exports = async(id) => {
   return await connection.awaitQuery(`SELECT * FROM files WHERE id = '${id}'`);
}