const CustomError = require('../util/customError');
const { VALIDATE } = require('../common/messages');
const { STATUS_CODE } = require('../constants/app.constant');

const FieldValidator = {
  checkIfEmptyString: async (param, fieldName) => {
    if (!param || param.trim().length === 0) {
      throw new CustomError(VALIDATE.PARAM.EMPTY(fieldName), STATUS_CODE.BAD_REQUEST);
    }

    return true;
  },

  checkIfEmptyNumber: async (param, fieldName) => {
    if (!param) {
      throw new CustomError(VALIDATE.PARAM.EMPTY(fieldName), STATUS_CODE.BAD_REQUEST);
    }
  },

  validateEmail: async (email) => {
    const emailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    const isValidEmail = await FieldValidator.checkIfEmptyString(email, 'email');

    if (isValidEmail && !String(email).match(emailFormat)) {
      throw new CustomError(VALIDATE.PARAM.INVALID('user email'), STATUS_CODE.BAD_REQUEST);
    }
  },

  validateAttackCoordinate: async (cooridnate) => {
    const coordinateFormat = /^[A-Z][1-9]\d*(?: [A-Z][1-9]\d*)*$/;

    const isValidCoordinate = await FieldValidator.checkIfEmptyString(cooridnate, 'cooridnate');

    if (isValidCoordinate && !String(cooridnate).match(coordinateFormat)) {
      throw new CustomError(VALIDATE.PARAM.INVALID('attack coordinate'), STATUS_CODE.BAD_REQUEST);
    }

    return true;
  },
};

module.exports = FieldValidator;
