const Router = require('express');
const passport = require('passport');
const { checkSchema } = require('express-validator');

const usersController = require('../controllers/users');
const registrationUserSchema = require('../validation/regisration');
const validationLogin = require('../validation/signinValid');

const route = new Router();

const auth = passport.authenticate('jwt', { session: false });

route.post('/signin', checkSchema(validationLogin), usersController.signIn);
route.post('/signup', checkSchema(registrationUserSchema), usersController.registerUser);
route.post('/signin/new_token', usersController.getNewToken);
route.get('/info', auth, usersController.info);
route.get('/logout', auth, usersController.logout);

module.exports = route;
