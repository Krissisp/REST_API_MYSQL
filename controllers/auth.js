const tokens = require('../tokens/jwt');
const crypto = require('../hashPassword');
const validationResult = require('../utils/validationResult');
const getTokenByID = require('../servises/auth/getTokenByID');
const getUserByRef_token = require('../servises/auth/getUserByRef_token');
const updateToken = require('../servises/auth/updateTokens');
const insertTokenIntoBlackList = require('../servises/auth/insertTokeIntonBlackList');
const registrationUser = require('../servises/auth/registrationUser');

const { secret_key } = require('../config');
const jwt = require('jsonwebtoken');

class Auth {
  signIn = async function signIn(req, res) {
    try {
      const { id } = req.body;
      
      validationResult(req, res);

      const old_token = await getTokenByID(id);

      await insertTokenIntoBlackList('invalid_tokens', 'token', old_token[0].token);

      const token = tokens.getToken(id);

      await updateToken(token, id);

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  registerUser = async function registerUser(req, res) {
    try {
      const { id, password } = req.body;

      validationResult(req, res);

      const hashPassword = await crypto(password);
      const token = tokens.getToken(id);
      const ref_token = tokens.getRefreshToken(id);

      await registrationUser(id, token, ref_token, hashPassword);

      return res.status(200).json({ token, ref_token });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  getNewToken = async function getNewToken(req, res) {
    try {
      const old_ref_token = req.body.ref_token;

      validationResult(req, res);

      const userId = await getUserByRef_token(old_ref_token);
      const old_token = await getTokenByID(userId[0].user);
      const new_token = tokens.getToken(userId[0].user);
      const new_ref_token = tokens.getRefreshToken(userId[0].user);
      await insertTokenIntoBlackList('invalid_ref_tokens', 'ref_token', old_ref_token);
      await insertTokenIntoBlackList('invalid_tokens', 'token', old_token[0].token);

      return res.status(200).json({ token: new_token, ref_token: new_ref_token });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  logout = async function (req, res) {
    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token.split(' ')[1], secret_key);
      await insertTokenIntoBlackList('invalid_tokens', 'token', token)
      const newToken = tokens.getToken(decoded.id);
      return res.status(200).json({ token: newToken });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };
}

module.exports = new Auth();
