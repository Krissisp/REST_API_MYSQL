const Router = require('express');
const multer = require('multer');
const path = require('path');
const passport = require('passport');
const { checkSchema } = require('express-validator');

const validationFile = require('../validation/notFoundFile');
const filesController = require('../controllers/files');

const route = new Router();

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const auth = passport.authenticate('jwt', { session: false });
const isFileIdExist  = checkSchema(validationFile);

route.get('/list', auth, filesController.list);
route.get('/:id', auth, isFileIdExist, filesController.getInfoByID);
route.get('/download/:id', auth, isFileIdExist, filesController.download);
route.put('/update/:id', auth, isFileIdExist, upload.any('uploads'), filesController.update);
route.delete('/delete/:id', auth, isFileIdExist, filesController.delete);
route.post('/upload', auth, upload.any('uploads'), filesController.upload);

module.exports = route;
