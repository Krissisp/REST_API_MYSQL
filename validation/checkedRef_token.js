const getBlackList_refs = require('../servises/auth/getBlackList_refs')

const ref_tokenIsValid = {
  ref_token: {
    notEmpty: true,
    errorMessage: 'Токен восстановления не передан',
    custom: {
      async options(refToken) {
        const invalid_ref_tokens = await getBlackList_refs();
        const isNotValid = invalid_ref_tokens.find((tokenDB) => tokenDB.ref_token === refToken);
        if (isNotValid) {
          throw('Невалидный токен восстановления');
        }
      },
    },
  }
};
module.exports = ref_tokenIsValid;