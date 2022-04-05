const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { secret_key } = require('../config');
const validationResult = require('../utils/validationResult');
const insertFiles = require('../servises/files/infertFiles');
const getList = require('../servises/files/getList');
const getPathToFile = require('../servises/files/pathToFile');
const deleteFileById = require('../servises/files/deleteFile');
const getFileById = require('../servises/files/getFileByID');
const updateFile = require('../servises/files/updateFile.js');

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
      
      await insertFiles(filename, expansion, mimetype, local_path, size, decoded.id);

      return res.status(200).json({ message: 'Файл добавлен' });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  list = async function list(req, res) {
    try {
      const list_size = req.query.list_size ? req.query.list_size : 10;
      const page = req.params.page ? req.params.page : 1;
      const startPage = list_size * (page - 1);
      const list = await getList(list_size, startPage);
     
      return res.status(200).send(list);
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  delete = async function deleteFile(req, res) {
    try {

      const pathToFile = await getPathToFile(req.params.id);

      validationResult(req);

      fs.unlinkSync(`./${pathToFile[0].local_path}`);

      await deleteFileById(req.params.id);
      return res.status(200).json({ message: 'Файл удален' });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  getInfoByID = async function (req, res) {
    try {
      const file = await getFileById(req.params.id);

      validationResult(req);

      return res.status(200).json( ...file );
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  download = async function download(req, res) {
    try {
      const pathToFile = await getPathToFile(req.params.id);
    
      validationResult(req);

      const files = path.resolve(`${__dirname}`, '../', `${pathToFile[0].local_path}`);
      return res.status(200).download(files);
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  update = async function update(req, res) {
    try {
     
      validationResult(req);
      if (!req.files[0]) {
        return res.status(404).json({ error: 'Выберете файл для загрузки' });
      }
      const pathToFile = await getPathToFile(req.params.id)
      const { filename, mimetype, size } = req.files[0];
      const expansion = filename.split('.').pop();
      const local_path = `uploads/${filename}`;

      await updateFile(filename, mimetype, expansion, local_path, size, req.params.id);

       fs.unlinkSync(`./${pathToFile[0].local_path}`);
       return res.status(200).json({ message: 'Файл заменен' });
    } catch (error) {
     return res.status(400).json({ error });
    }
  };
}
module.exports = new Files();
