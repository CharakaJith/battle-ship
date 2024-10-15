const db = require('../database/connection');
const { SHIP } = require('../enum/message');

const ShipService = {
  /**
   * Function to create a new record in table 'ships'
   *
   * @param {Object} ship: ship details object
   * @returns the id of newly created ship object
   */
  placeShip: (ship) => {
    return new Promise((resolve, reject) => {
      const insertQuery = 'INSERT INTO ships (game_id, ship_type, ship_size, ship_position, ship_coordinate, is_sunck) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [ship.gameId, ship.type, ship.size, ship.position, ship.coordinate, false];

      db.run(insertQuery, values, function (error) {
        if (error) {
          console.error('Insert error:', error);
          return reject(new Error(SHIP.PLACE_FAILED(error)));
        }

        return resolve(this.lastID);
      });
    });
  },
};

module.exports = ShipService;
