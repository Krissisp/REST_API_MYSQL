const config = require('../../db.js');
const connection = config.connection;

module.exports = async(list_size, startPage) => {
   return await connection.awaitQuery(`SELECT * FROM files LIMIT ${list_size} OFFSET ${startPage}`);
}