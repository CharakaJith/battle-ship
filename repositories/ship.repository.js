const db = require('../database/connection');
const CustomError = require('../util/customError');
const { SERVICE } = require('../common/messages');
const { STATUS_CODE } = require('../constants/app.constant');
const { TABLE_NAME } = require('../constants/table.constant');

const shipRepository = {
  /**
   * Function to create a new record in table "ships"
   *
   * @param {Object} ship: ship details object
   * @returns the id of newly created ship object
   */
  placeShip: (ship) => {
    return new Promise((resolve, reject) => {
      const insertQuery =
        'INSERT INTO ships (game_id, ship_type, ship_size, ship_position, start_row, end_row, start_col, end_col, is_sunk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [ship.gameId, ship.type, ship.size, ship.position, ship.startRow, ship.endRow, ship.startCol, ship.endCol, false];

      db.run(insertQuery, values, function (error) {
        if (error) return reject(new CustomError(SERVICE.FAILED.CREATE(TABLE_NAME.SHIP, error), STATUS_CODE.UNPORCESSABLE));

        return resolve(this.lastID);
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
        if (error) return reject(new CustomError(SERVICE.FAILED.GET.BY_GAME_ID(TABLE_NAME.SHIP, gameId, error), STATUS_CODE.NOT_FOUND));

        return resolve(rows);
      });
    });
  },

  /**
   * Function to update column 'is_sunk' in an existing record in the table "ships" by column 'ship_id'
   *
   * @param {Objects} ship: ship details object
   * @returns a list of all ship objects
   */
  updateShipStatusById: (ship) => {
    return new Promise((resolve, reject) => {
      const updateQuery = `UPDATE ships
          SET is_sunk = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE ship_id = ?`;
      const values = [ship.isSunk, ship.id];

      db.run(updateQuery, values, function (error) {
        if (error) return reject(new CustomError(SERVICE.FAILED.UPDATE(TABLE_NAME.SHIP, ship.id, error), STATUS_CODE.UNPORCESSABLE));

        // get all ships
        return shipRepository
          .getAllShipsByGameId(ship.gameId)
          .then((ships) => resolve(ships))
          .catch((error) => reject(error));
      });
    });
  },
};

module.exports = shipRepository;
