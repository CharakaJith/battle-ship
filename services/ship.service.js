const db = require('../database/connection');
const { SERVICE } = require('../common/messages');
const { TABLE_NAME } = require('../enum/table');

const ShipService = {
  /**
   * Function to create a new record in table "ships"
   *
   * @param {Object} ship: ship details object
   * @returns the id of newly created ship object
   */
  placeShip: (ship) => {
    return new Promise((resolve, reject) => {
      const insertQuery =
        'INSERT INTO ships (game_id, ship_type, ship_size, ship_position, start_row, end_row, start_col, end_col, is_sunck) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [ship.gameId, ship.type, ship.size, ship.position, ship.startRow, ship.endRow, ship.startCol, ship.endCol, false];

      db.run(insertQuery, values, function (error) {
        if (error) {
          return reject(new Error(SERVICE.CREATE_FAILED(TABLE_NAME.SHIP, error)));
        }

        resolve(this.lastID);
      });
    });
  },

  /**
   * Function to fetch multiple records from table "ships" by column 'game_id'
   *
   * @param {number} gameId: id of the game
   * @returns a list of ship objects
   */
  getAllShipsByGameId: (gameId) => {
    return new Promise((resolve, reject) => {
      const getAllQuery = 'SELECT * FROM ships WHERE game_id = ?';

      db.all(getAllQuery, [gameId], function (error, rows) {
        if (error) {
          return reject(new Error(SERVICE.GET_BY_GAME_ID_FAILED(TABLE_NAME.SHIP, gameId, error)));
        }

        resolve(rows);
      });
    });
  },
};

module.exports = ShipService;
