const config = require('../../db.js');
const connection = config.connection;

module.exports = async(tableName, column, old_token) => {
    await connection.awaitQuery(`INSERT INTO ${tableName} (${column}) VALUES('${old_token}')`);
}
