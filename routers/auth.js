const Router = require('express');
const { checkSchema } = require('express-validator');

const authController = require('../controllers/auth');
const registrationUserSchema = require('../validation/regisration');
const validationLogin = require('../validation/signinValid');
const ref_tokenIsValid = require('../validation/checkedRef_token')
const authByToken = require('../utils/authByTokens')

const route = new Router();

route.post('/signin', checkSchema(validationLogin), authController.signIn);
route.post('/signup', checkSchema(registrationUserSchema), authController.registerUser);
route.post('/signin/new_token', checkSchema(ref_tokenIsValid), authController.getNewToken);
route.get('/logout', authByToken, authController.logout);

module.exports = route;
