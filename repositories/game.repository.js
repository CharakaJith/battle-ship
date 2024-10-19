const db = require('../database/connection');
const CustomError = require('../util/customError');
const { SERVICE } = require('../common/messages');
const { STATUS_CODE } = require('../constants/app.constant');
const { TABLE_NAME } = require('../constants/table.constant');

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
        if (error) return reject(new CustomError(SERVICE.FAILED.CREATE(TABLE_NAME.GAME, error), STATUS_CODE.UNPORCESSABLE));

        // get newly created game by id
        return GameRepository.getGameById(this.lastID)
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
      const selectQuery = 'SELECT * FROM games WHERE game_id = ?';

      db.get(selectQuery, [gameId], function (error, row) {
        if (error) return reject(new CustomError(SERVICE.FAILED.GET.BY_ID(TABLE_NAME.GAME, gameId, error), STATUS_CODE.NOT_FOUND));

        return resolve(row);
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
        if (error) return reject(new CustomError(SERVICE.FAILED.UPDATE(TABLE_NAME.GAME, game.id, error), STATUS_CODE.UNPORCESSABLE));

        // get updated game by id
        return GameRepository.getGameById(game.id)
          .then((game) => resolve(game))
          .catch((error) => reject(error));
      });
    });
  },
};

module.exports = GameRepository;
