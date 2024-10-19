const db = require('../database/connection');
const CustomError = require('../util/customError');
const { SERVICE } = require('../common/messages');
const { STATUS_CODE } = require('../constants/app.constant');
const { TABLE_NAME } = require('../constants/table.constant');

const UserRepository = {
  createNewUser: async (user) => {
    return new Promise((resolve, reject) => {
      const insertQuery = 'INSERT INTO users (user_name, user_email, user_password) VALUES(?, ?, ?)';
      const values = [user.name, user.email, user.password];

      db.run(insertQuery, values, function (error) {
        if (error) return reject(new CustomError(SERVICE.CREATE_FAILED(TABLE_NAME.USER, error), STATUS_CODE.UNPORCESSABLE));

        return UserRepository.getUserById(this.lastID)
          .then((user) => resolve(user))
          .catch((error) => reject(error));
      });
    });
  },

  getUserById: (userId) => {
    return new Promise((resolve, reject) => {
      const selectQuery = 'SELECT * FROM users WHERE user_id = ?';

      db.get(selectQuery, [userId], function (error, row) {
        if (error) return reject(new CustomError(SERVICE.GET_BY_ID_FAILED(TABLE_NAME.USER, userId, error), STATUS_CODE.NOT_FOUND));

        return resolve(row);
      });
    });
  },

  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const selectQuery = 'SELECT * FROM users WHERE user_email = ?';

      db.get(selectQuery, [email], function (error, row) {
        if (error) return reject(new CustomError(SERVICE.GET_BY_EMAIL_FAILED(TABLE_NAME.USER, email, error), STATUS_CODE.NOT_FOUND));

        return resolve(row);
      });
    });
  },
};

module.exports = UserRepository;
