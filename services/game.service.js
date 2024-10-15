const db = require('../database/connection');
const { GAME_STATUS, GRID } = require('../enum/game');
const { GAME } = require('../enum/message');

const GameService = {
  /**
   * Function to create a new record in table 'games'
   *
   * @returns a newly created game object
   */
  createNewGame: () => {
    return new Promise((resolve, reject) => {
      const insertQuery = 'INSERT INTO games (game_status, grid_size) VALUES (?, ?);';
      const values = [GAME_STATUS.IN_PROGRESS, GRID.SIZE];

      db.run(insertQuery, values, function (error) {
        if (error) {
          return reject(new Error(GAME.CREATE_FAILED(error)));
        }

        // get newly created game by id
        GameService.getGameById(this.lastID)
          .then((game) => resolve(game))
          .catch((error) => reject(error));
      });
    });
  },

  /**
   * Function to retrieve a record from table 'games' by column 'game_id'
   *
   * @param {number} id: id of the game
   * @returns a game object if exists, else null
   */
  getGameById: (id) => {
    return new Promise((resolve, reject) => {
      const selectQuery = 'SELECT * FROM games WHERE game_id = ?';
      db.get(selectQuery, [id], (error, row) => {
        if (error) {
          return reject(new Error(GAME.GET_BY_ID_FAILED(id, error)));
        }

        resolve(row);
      });
    });
  },

  /**
   * Function to update an existing record in the table 'games' by column 'game_id'
   *
   * @param {number} id: id of the game
   * @param {string} status: status of the game
   * @returns an updated game object
   */
  updateGameById: (id, status) => {
    return new Promise((resolve, reject) => {
      const updateQuery = 'UPDATE games SET game_status = ?, updated_at = CURRENT_TIMESTAMP  WHERE game_id = ?';
      const values = [status, id];

      db.run(updateQuery, values, function (error) {
        if (error) {
          return reject(new Error(GAME.UPDATE_FAILED(id, error)));
        }

        // get updated game by id
        GameService.getGameById(id)
          .then((game) => resolve(game))
          .catch((error) => reject(error));
      });
    });
  },
};

module.exports = GameService;
