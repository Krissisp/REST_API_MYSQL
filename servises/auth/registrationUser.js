const config = require('../../db.js');
const connection = config.connection;

module.exports = async(id, token, ref_token, hashPassword) => {
    await connection.awaitQuery(`INSERT INTO tokens (token, ref_token, user) VALUES('${token}', '${ref_token}', '${id}')`);
    await connection.awaitQuery(`INSERT INTO users (id, hashPassword) VALUES ('${id}', '${hashPassword}')`);
}