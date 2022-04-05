const config = require('../../db.js');
const connection = config.connection;

module.exports = async(filename, expansion, mimetype, local_path, size, id) => {
    const sql = `INSERT INTO files (name, expansion, mimetype, local_path, size, author) VALUES('${filename}', '${expansion}', 
    '${mimetype}', '${local_path}', '${size}', '${id}')`
    await connection.awaitQuery(sql);
}