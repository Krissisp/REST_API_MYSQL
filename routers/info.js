const Router = require('express');
const infoController = require('../controllers/info');
const authByToken = require('../utils/authByTokens')

const route = new Router();

route.get('/info', authByToken, infoController.info);

module.exports = route;