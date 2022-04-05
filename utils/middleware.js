const getBlackListTokens = require('../servises/auth/getBlackListTokens.js');

module.exports = function(publicRoutes) {
  return async (req, res, next) => {
    const url = req._parsedUrl.pathname;
    if (!publicRoutes.includes(url)) {
      const blackListTokens = await getBlackListTokens();
      const token = req.headers.authorization;
      const hasInvalidToken = blackListTokens.find((tokenDB) => tokenDB.token === token);
      if (hasInvalidToken) {
        return res.status(403).json({ errors: 'Невалидный токен' });
      }
    }
    next();
  }
}