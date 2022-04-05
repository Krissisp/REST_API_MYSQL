const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { secret_key } = require('../config');
var config = require('../db.js');
const connection = config.connection

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret_key,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      const user = await connection.awaitQuery(`SELECT * FROM users WHERE id='${payload.id}'`);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    }),
  );
};
