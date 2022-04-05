const config = require('../../db.js');
const connection = config.connection;

module.exports = async(ref_token) => {
    return await connection.awaitQuery(`SELECT user FROM tokens WHERE ref_token='${ref_token}'`);
}