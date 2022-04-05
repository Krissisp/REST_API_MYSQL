const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const passport = require('passport');
const authRouter = require('./routers/auth');
const routerInfo = require('./routers/info');
const filesRouter = require('./routers/files');
const middleaware = require('./utils/middleware')
const {SERVER_PORT} = require('./config');
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./tokens/passport')(passport);

const publicRoutes = ['sign', '/signup', '/signin/new_token'];

app.use(middleaware(publicRoutes));
app.use('/', authRouter);
app.use('/', routerInfo);
app.use('/file', filesRouter);

app.listen(SERVER_PORT, (err) => {
  if (err) {
    return err;
  }
  return console.log(`Сервер запущен: порт ${SERVER_PORT}`);
});
