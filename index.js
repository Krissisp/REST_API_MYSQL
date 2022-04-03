const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const routerUsers = require('./routers/userRouters');
const routerFiles = require('./routers/files');
const config = require('./db');

const { connection } = config;

app.use(passport.initialize());
require('./tokens/passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const url = req._parsedUrl.pathname;
  if (url !== '/sign' && url !== '/signup' && url !== '/signin/new_token') {
    const invalid_token = await connection.awaitQuery('SELECT token FROM invalid_tokens');
    const token = req.headers.authorization;
    const find = invalid_token.find((tokenDB) => tokenDB.token === token);
    if (find) {
      return res.status(403).json({ errors: 'Невалидный токен' });
    }
  }
  next();
});
app.use('/', routerUsers);
app.use('/file', routerFiles);

app.listen(3000, (err) => {
  if (err) {
    return err;
  }
  return console.log('Сервер запущен: порт 3000');
});
