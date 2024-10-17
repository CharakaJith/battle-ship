const db = require('../database/connection');
const { SERVICE } = require('../common/messages');
const { TABLE_NAME } = require('../enum/table');

const AttackRepository = {
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
        if (error) return reject(new Error(SERVICE.CREATE_FAILED(TABLE_NAME.ATTACK, error)));

        // get newly created attack by id
        AttackRepository.getAllAttacksByGameId(attack.gameId)
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
      const getQuery = 'SELECT * FROM attacks WHERE attack_id = ?';

      db.get(getQuery, [attackId], function (error, row) {
        if (error) return reject(new Error(SERVICE.GET_BY_ID_FAILED(TABLE_NAME.ATTACK, attackId, error)));

        resolve(row);
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
        if (error) return reject(new Error(SERVICE.GET_BY_GAME_ID_FAILED(TABLE_NAME.SHIP, gameId, error)));

        resolve(rows);
      });
    });
  },
};

module.exports = AttackRepository;
