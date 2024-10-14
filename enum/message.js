const { error } = require('winston');

module.exports = {
  PAYLOAD: {
    GAME_STARTED: 'New game started!',
    GAME_ABANDONED: (id) => `Game ${id} has been abandoned!`,
  },

  DATABASE: {
    CONN_SUCCESS: 'Connected to the database successfully!',
    CONN_FAILED: (error) => `Failed to connect to the database: ${error.message}`,

    TABLE_CREATED: (table) => `Table '${table}' created successfully or already exists!`,
    TABLE_FAILED: (table, error) => `Failed to create database table '${table}': ${error.message}`,
  },

  GAME: {
    CREATE_FAILED: (error) => `Failed to create new game: ${error.message}`,
    GET_BY_ID_FAILED: (id, error) => `Failed to fetch the game by id ${id}: ${error.message}`,
  },
};
