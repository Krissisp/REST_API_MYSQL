const config = require('../../db.js');
const connection = config.connection;

module.exports = async(id) => {
    await connection.awaitQuery(`DELETE FROM files WHERE id = '${id}'`);
}