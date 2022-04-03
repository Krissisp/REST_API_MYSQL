const tokens = require('../tokens/jwt');
const crypto = require('../hashPassword');
const config = require('../db.js');
const validationResult = require('../utils/validationResult')

const { connection } = config;
const { secret_key } = require('../env');
const jwt = require('jsonwebtoken');

class Users {
  signIn = async function signIn(req, res) {
    try {
      const { id } = req.body;
      
      validationResult(req, res)

      const old_token = await connection.awaitQuery(`SELECT token FROM tokens WHERE user='${id}'`);
      await connection.awaitQuery(`INSERT INTO invalid_tokens (token) VALUES('${old_token.token}')`);
      const token = tokens.getToken(id);
      await connection.awaitQuery(`UPDATE tokens SET token='${token}' WHERE user='${id}'`);

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  registerUser = async function registerUser(req, res) {
    try {
      const { id, password } = req.body;
      validationResult(req, res)
      const hashPassword = await crypto(password);
      const token = tokens.getToken(id);
      const ref_token = tokens.getRefreshToken(id);
      await connection.awaitQuery(`INSERT INTO tokens (token, ref_token, user) VALUES('${token}', '${ref_token}', '${id}')`);
      await connection.awaitQuery(`INSERT INTO users (id, hashPassword) VALUES ('${id}', '${hashPassword}')`);
      return res.status(200).json({ token, ref_token });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  getNewToken = async function getNewToken(req, res) {
    try {
        if(!req.body.ref_token) {
          return res.status(403).json({error: 'Токен восстановления не передан'})
        }
      const invalid_ref_token = await connection.awaitQuery('SELECT ref_token FROM invalid_ref_tokens');
      const old_ref_token = req.body.ref_token;
      const find = invalid_ref_token.find((tokenDB) => tokenDB.ref_token === old_ref_token);
      if (find[0]) {
        return res.json({ message: 'Невалидный токен' });
      }

      const infoUser = await connection.awaitQuery(`SELECT user FROM tokens WHERE ref_token='${old_ref_token}'`);
      if (!infoUser[0]) {
        return res.json({ message: 'Невалидный токен восстановления' });
      }
      const new_token = tokens.getToken(infoUser[0].user);
      const new_ref_token = tokens.getRefreshToken(infoUser[0].user);
      await connection.awaitQuery(`INSERT INTO invalid_ref_tokens (ref_token) VALUES('${old_ref_token}')`);
      return res.status(200).json({ token: new_token, ref_token: new_ref_token });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  info = async function (req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, secret_key);
      return res.status(200).json({ id: decoded.id });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  logout = async function (req, res) {
    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token.split(' ')[1], secret_key);
      await connection.awaitQuery(`INSERT INTO invalid_tokens (token) VALUES('${token}')`);
      const newToken = tokens.getToken(decoded.id);
      return res.status(200).json({ token: newToken });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };
}

module.exports = new Users();
