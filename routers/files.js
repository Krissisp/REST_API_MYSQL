const Router = require('express');
const multer = require('multer');
const {storage, fileFilter} = require('../multerConfig')
const authByToken = require('../utils/authByTokens')

const { checkSchema } = require('express-validator');

const validationFile = require('../validation/notFoundFile');
const filesController = require('../controllers/files');

const route = new Router();
const uploadFile = multer({ storage });
const updateFile = multer({storage, fileFilter})
const isFileIdExist  = checkSchema(validationFile);

route.get('/list', authByToken, filesController.list);
route.get('/:id', authByToken, isFileIdExist, filesController.getInfoByID);
route.get('/download/:id', authByToken, isFileIdExist, filesController.download);
route.put('/update/:id', authByToken, isFileIdExist, updateFile.any('uploads'), filesController.update);
route.delete('/delete/:id', authByToken, isFileIdExist, filesController.delete);
route.post('/upload', authByToken, uploadFile.any('uploads'), filesController.upload);

module.exports = route;
