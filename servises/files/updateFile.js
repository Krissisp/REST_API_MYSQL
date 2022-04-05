const config = require('../../db.js');
const connection = config.connection;

module.exports = async(filename, mimetype, expansion, local_path, size, id) => {
    const sql = `UPDATE files SET name='${filename}', mimetype='${mimetype}', expansion='${expansion}',  local_path='${local_path}', size='${size}' WHERE id='${id}'`;
    await connection.awaitQuery(sql);
}