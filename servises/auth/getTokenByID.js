const config = require('../../db.js');
const connection = config.connection;

module.exports = async(id) => {
    return await connection.awaitQuery(`SELECT token FROM tokens WHERE user='${id}'`);
}