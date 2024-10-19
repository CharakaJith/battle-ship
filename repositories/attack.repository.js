const db = require('../database/connection');
const CustomError = require('../util/customError');
const { SERVICE } = require('../common/messages');
const { STATUS_CODE } = require('../constants/app.constant');
const { TABLE_NAME } = require('../constants/table.constant');

const attackRepository = {
  /**
   * Function to create a new record in table "attacks"
   *
   * @param {Object} attack: attack details object
   * @returns a newly created attack object
   */
  createNewAttack: (attack) => {
    return new Promise((resolve, reject) => {
      const insertQuery = 'INSERT INTO attacks (game_id, attack_row, attack_col, is_hit) VALUES (?, ?, ?, ?)';
      const values = [attack.gameId, attack.attackRow, attack.attackCol, attack.hit];

      db.run(insertQuery, values, function (error) {
        if (error) return reject(new CustomError(SERVICE.FAILED.CREATE(TABLE_NAME.ATTACK, error), STATUS_CODE.UNPORCESSABLE));

        // get newly created attack by id
        return attackRepository
          .getAllAttacksByGameId(attack.gameId)
          .then((attacks) => resolve(attacks))
          .catch((error) => reject(error));
      });
    });
  },

  /**
   * Function to fetch a record from table "attacks" by column 'attack_id'
   *
   * @param {number} attackId: id of the attack
   * @returns an attack object if exists, else null
   */
  getAttackById: (attackId) => {
    return new Promise((resolve, reject) => {
      const selectQuery = 'SELECT * FROM attacks WHERE attack_id = ?';

      db.get(selectQuery, [attackId], function (error, row) {
        if (error) return reject(new CustomError(SERVICE.FAILED.GET.BY_ID(TABLE_NAME.ATTACK, attackId, error), STATUS_CODE.NOT_FOUND));

        return resolve(row);
      });
    });
  },

  /**
   * Function to fetch multiple records from table "attacks" by column 'game_id'
   *
   * @param {number} gameId: id of the game
   * @returns a list of attack objects
   */
  getAllAttacksByGameId: (gameId) => {
    return new Promise((resolve, reject) => {
      const getAllQuery = 'SELECT * FROM attacks WHERE game_id = ?';

      db.all(getAllQuery, [gameId], function (error, rows) {
        if (error) return reject(new CustomError(SERVICE.FAILED.GET.BY_GAME_ID(TABLE_NAME.SHIP, gameId, error), STATUS_CODE.NOT_FOUND));

        return resolve(rows);
      });
    });
  },
};

module.exports = attackRepository;
