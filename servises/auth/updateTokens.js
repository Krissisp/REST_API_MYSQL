const config = require('../../db.js');
const connection = config.connection;

module.exports = async(token, id) => {
    await connection.awaitQuery(`UPDATE tokens SET token='${token}' WHERE user='${id}'`);
}