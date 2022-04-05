const { validationResult } = require('express-validator');

module.exports = (req) => {
    const { errors } = validationResult(req);
    if (errors.length !== 0) {
      throw errors[0].msg;
    }
}