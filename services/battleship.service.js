const db = require('../database/connection');
const { GAME_STATUS, GRID } = require('../enum/game');
const { GAME } = require('../enum/message');

const BattleshipService = {
  /**
   * Function to create a new record in table 'games'
   *
   * @returns a newly created game object with full details
   */
  createNewGame: () => {
    return new Promise((resolve, reject) => {
      const insertQuery = 'INSERT INTO games (game_status, grid_size) VALUES (?, ?);';
      db.run(insertQuery, [GAME_STATUS.IN_PROGRESS, GRID.SIZE], function (error) {
        if (error) {
          return reject(new Error(GAME.CREATE_FAILED(error)));
        }

        const selectQuery = 'SELECT * FROM games WHERE game_id = ?';
        db.get(selectQuery, [this.lastID], (error, row) => {
          if (error) {
            return reject(new Error(GAME.CREATE_FAILED(error)));
          }

          resolve(row);
        });
      });
    });
  },
};

module.exports = BattleshipService;
