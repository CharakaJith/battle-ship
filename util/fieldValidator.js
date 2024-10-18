const CustomError = require('../util/customError');
const { VALIDATE } = require('../common/messages');
const { STATUS_CODE } = require('../constants/app.constant');

const FieldValidator = {
  checkIfEmptyString: async (param, fieldName) => {
    if (!param || param.trim().length === 0) {
      throw new CustomError(VALIDATE.EMPTY_PARAM(fieldName), STATUS_CODE.BAD_REQUEST);
    }

    return true;
  },

  checkIfEmptyNumber: async (param, fieldName) => {
    if (!param) {
      throw new CustomError(VALIDATE.EMPTY_PARAM(fieldName), STATUS_CODE.BAD_REQUEST);
    }
  },

  validateAttackCoordinate: async (cooridnate) => {
    const coordinateFormat = /^[A-Z][1-9]\d*(?: [A-Z][1-9]\d*)*$/;

    const isValidCoordinate = await FieldValidator.checkIfEmptyString(cooridnate, 'cooridnate');

    if (isValidCoordinate && !String(cooridnate).match(coordinateFormat)) {
      throw new CustomError(VALIDATE.INVALID_PARAM('attack coordinate'), STATUS_CODE.BAD_REQUEST);
    }

    return true;
  },
};

module.exports = FieldValidator;
