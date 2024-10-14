module.exports = {
  PAYLOAD: Object.freeze({
    GAME_STARTED: 'New game started!',
  }),

  DATABASE: {
    CONN_SUCCESS: 'Connected to the database successfully!',
    CONN_FAILED: (error) => `Failed to connect to the database: ${error.message}`,

    TABLE_CREATED: (table) => `Table '${table}' created successfully or already exists!`,
    TABLE_FAILED: (table, error) => `Failed to create database table '${table}': ${error.message}`,
  },

  GAME: {
    CREATE_FAILED: (error) => `Failed to create new game: ${error.message}`,
  },
};
