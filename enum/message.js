const { error } = require('winston');

module.exports = {
  // response payload messages
  PAYLOAD: {
    GAME_STARTED: 'New game started!',
    INVALID_ID: (id) => `Invalid game id ${id}!`,
    GAME_ABANDONED: (id) => `Game ${id} has been abandoned!`,
  },

  // database connection and initialization messages
  DATABASE: {
    CONN_SUCCESS: 'Connected to the database successfully!',
    CONN_FAILED: (error) => `Failed to connect to the database: ${error.message}`,

    TABLE_CREATED: (table) => `Table '${table}' created successfully or already exists!`,
    TABLE_FAILED: (table, error) => `Failed to create database table '${table}': ${error.message}`,
  },

  // game service error messages
  GAME: {
    CREATE_FAILED: (error) => `Failed to create new game: ${error.message}`,
    GET_BY_ID_FAILED: (id, error) => `Failed to fetch the game by id ${id}: ${error.message}`,
    UPDATE_FAILED: (id, error) => `Failed to update the game by id ${id}: ${error.message}`,
  },
};
