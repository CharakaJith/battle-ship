const db = require('../database/connection');
const { SERVICE } = require('../common/messages');
const { TABLE_NAME } = require('../enum/table');

const GameRepository = {
  /**
   * Function to create a new record in table "games"
   *
   * @param {Object} game: game details object
   * @returns a newly created game object
   */
  createNewGame: (game) => {
    return new Promise((resolve, reject) => {
      const insertQuery = 'INSERT INTO games (game_status, grid_size) VALUES (?, ?);';
      const values = [game.gameStatus, game.size];

      db.run(insertQuery, values, function (error) {
        if (error) return reject(new Error(SERVICE.CREATE_FAILED(TABLE_NAME.GAME, error)));

        // get newly created game by id
        GameRepository.getGameById(this.lastID)
          .then((game) => resolve(game))
          .catch((error) => reject(error));
      });
    });
  },

  /**
   * Function to fetch a record from table "games" by column 'game_id'
   *
   * @param {number} gameId: id of the game
   * @returns a game object if exists, else null
   */
  getGameById: (gameId) => {
    return new Promise((resolve, reject) => {
      const getQuery = 'SELECT * FROM games WHERE game_id = ?';

      db.get(getQuery, [gameId], function (error, row) {
        if (error) return reject(new Error(SERVICE.GET_BY_ID_FAILED(TABLE_NAME.GAME, gameId, error)));

        resolve(row);
      });
    });
  },

  /**
   * Function to update column 'game_status' in an existing record in the table "games" by column 'game_id'
   *
   * @param {object} game: game details object
   * @returns an updated game object
   */
  updateGameStatusById: (game) => {
    return new Promise((resolve, reject) => {
      const updateQuery = `UPDATE games 
          SET game_status = ?, updated_at = CURRENT_TIMESTAMP  
          WHERE game_id = ?`;
      const values = [game.status, game.id];

      db.run(updateQuery, values, function (error) {
        if (error) return reject(new Error(SERVICE.UPDATE_FAILED(TABLE_NAME.GAME, id, error)));

        // get updated game by id
        GameRepository.getGameById(game.id)
          .then((game) => resolve(game))
          .catch((error) => reject(error));
      });
    });
  },
};

module.exports = GameRepository;
