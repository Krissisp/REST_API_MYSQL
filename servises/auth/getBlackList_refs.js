const config = require('../../db.js');
const connection = config.connection;

module.exports = async() => {
   return await connection.awaitQuery('SELECT ref_token FROM invalid_ref_tokens');
}