module.exports = {
  APP_ENV: Object.freeze({
    DEV: 'development',
    QA: 'qa',
    STAGE: 'staging',
    PROD: 'production',
  }),

  STATUS_CODE: Object.freeze({
    OK: 200,
    CREATED: 201,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDON: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPORCESSABLE: 422,

    SERVER_ERROR: 500,
  }),
};
