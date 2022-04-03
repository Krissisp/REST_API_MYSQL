const config = require('../db.js');
const connection = config.connection
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const { secret_key } = require('../env');
const validationResult = require('../utils/validationResult')

class Files {
  upload = async function upload(req, res) {
    try {
      if (!req.files[0]) {
        return res.status(404).json({ error: 'Выберете файл для загрузки' });
      }
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, secret_key);
      const { filename, mimetype, size } = req.files[0];
      const expansion = filename.split('.').pop();
      const local_path = `uploads/${filename}`;
      await connection.awaitQuery(`INSERT INTO files (name, expansion, mimetype, local_path, size, autor) VALUES('${filename}', '${expansion}', '${mimetype}', '${local_path}', '${size}', '${decoded.id}')`);
      return res.status(200).json({ messege: 'Файл добавлен' });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  list = async function list(req, res) {
    try {
      const list_size = req.query.list_size ? req.query.list_size : 10;
      const page = req.params.page ? req.params.page : 1;
      const list = await connection.awaitQuery(`SELECT * FROM files LIMIT ${list_size} OFFSET ${list_size * (page - 1)}`);
      return res.status(200).send(list);
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  delete = async function deleteFile(req, res) {
    try {
      const local_path = await connection.awaitQuery(`SELECT local_path FROM files WHERE id='${req.params.id}'`);
     
      validationResult(req, res);
      fs.unlinkSync(`./${local_path[0].local_path}`);
      await connection.awaitQuery(`DELETE FROM files WHERE id = '${req.params.id}'`);
      return res.status(200).json({ message: 'Файл удален' });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  getInfoByID = async function (req, res) {
    try {
      const info = await connection.awaitQuery(`SELECT * FROM files WHERE id = '${req.params.id}'`);
 
      validationResult(req, res);
      return res.status(200).send(info);
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  download = async function download(req, res) {
    try {
      const pathToFile = await connection.awaitQuery(`SELECT local_path FROM files WHERE id='${req.params.id}'`);
    
      validationResult(req, res);
      const files = path.resolve(`${__dirname}`, '../', `${pathToFile[0].local_path}`);
      return res.status(200).download(files);
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  update = async function update(req, res) {
    try {
      
      validationResult(req, res);
      if (!req.files[0]) {
        return res.status(404).json({ error: 'Выберете файл для загрузки' });
      }
      const pathToFile = await connection.awaitQuery(`SELECT local_path, id FROM files WHERE id='${req.params.id}'`);
     
      const { filename, mimetype, size } = req.files[0];
      const expansion = filename.split('.').pop();
      const local_path = `uploads/${filename}`;
      const sql = `UPDATE files SET name='${filename}', mimetype='${mimetype}', expansion='${expansion}',  local_path='${local_path}', size='${size}' WHERE id='${req.params.id}'`;
      await connection.awaitQuery(sql);
      fs.unlinkSync(`./${pathToFile[0].local_path}`);
      return res.status(200).json({ message: 'Файл заменен' });
    } catch (error) {
     return res.status(400).json({ error });
    }
  };
}
module.exports = new Files();
