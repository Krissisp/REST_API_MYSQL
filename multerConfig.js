const multer = require('multer');
const config = require('./db.js');
const path = require('path');
const connection = config.connection;

const fileFilter = async (req, file, cb) => {
  const pathToFile = await connection.awaitQuery(`SELECT local_path FROM files WHERE id='${req.params.id}'`);
  if (!pathToFile[0]) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

const storage = multer.diskStorage({
  destination:  function (req, file, callback) {
          callback(null, './uploads');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});
module.exports = { storage, fileFilter }