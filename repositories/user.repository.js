const db = require('../database/connection');
const CustomError = require('../util/customError');
const { SERVICE } = require('../common/messages');
const { STATUS_CODE } = require('../constants/app.constant');
const { TABLE_NAME } = require('../constants/table.constant');

const UserRepository = {
  /**
   * Function to create a new record in table "users"
   *
   * @param {Object} user: user details object
   * @returns a newly created user object
   */
  createNewUser: async (user) => {
    return new Promise((resolve, reject) => {
      const insertQuery = 'INSERT INTO users (user_name, user_email, user_password, is_active) VALUES(?, ?, ?, ?)';
      const values = [user.name, user.email, user.password, user.isActive];

      db.run(insertQuery, values, function (error) {
        if (error) return reject(new CustomError(SERVICE.FAILED.CREATE(TABLE_NAME.USER, error), STATUS_CODE.UNPORCESSABLE));

        return UserRepository.getUserById(this.lastID)
          .then((user) => resolve(user))
          .catch((error) => reject(error));
      });
    });
  },

  /**
   * Function to fetch a record from table "users" by column 'user_id'
   *
   * @param {number} userId: id of the user
   * @returns a user object if exists, else null
   */
  getUserById: (userId) => {
    return new Promise((resolve, reject) => {
      const selectQuery = 'SELECT * FROM users WHERE user_id = ?';

      db.get(selectQuery, [userId], function (error, row) {
        if (error) return reject(new CustomError(SERVICE.FAILED.GET.BY_ID(TABLE_NAME.USER, userId, error), STATUS_CODE.NOT_FOUND));

        return resolve(row);
      });
    });
  },

  /**
   * Function to fetch a record from table "users" by column 'user_email'
   *
   * @param {string} email: email of the user
   * @returns a user object if exists, else null
   */
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const selectQuery = 'SELECT * FROM users WHERE user_email = ?';

      db.get(selectQuery, [email], function (error, row) {
        if (error) return reject(new CustomError(SERVICE.FAILED.GET.BY_EMAIL(TABLE_NAME.USER, email, error), STATUS_CODE.NOT_FOUND));

        return resolve(row);
      });
    });
  },
};

module.exports = UserRepository;
