const config = require('../../db.js');
const connection = config.connection;

module.exports = async() => {
    return await connection.awaitQuery('SELECT hashPassword FROM users');
}