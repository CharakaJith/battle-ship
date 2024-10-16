const { VALIDATE } = require('../common/messages');

const Validator = {
  checkIfEmptyString: async (param, fieldName) => {
    if (!param || param.trim().length === 0) {
      throw new Error(VALIDATE.EMPTY_PARAM(fieldName));
    }

    return true;
  },

  validateAttackCoordinate: async (cooridnate) => {
    const coordinateFormat = /^[A-Z][1-9]\d*(?: [A-Z][1-9]\d*)*$/;

    const isValidCoordinate = await Validator.checkIfEmptyString(cooridnate, 'cooridnate');

    if (isValidCoordinate && !String(cooridnate).match(coordinateFormat)) {
      throw new Error(VALIDATE.INVALID_PARAM('attack coordinate'));
    }

    return true;
  },
};

module.exports = Validator;
