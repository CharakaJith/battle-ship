module.exports = {
  // response payload messages
  PAYLOAD: {
    GAME_STARTED: 'New game has started!',
    GAME_FETCHED: 'Game fetched successfully!',
    GAME_ABANDONED: 'Game abandoned!',
    GAME_OVER: 'Game is already over!',
    GAME_WON: 'All ships sunked! you Won!',
    INVALID_COORDINATE: 'Attck coordinate is out of boundry!',
    ATTACK_ALREADY_MADE: 'Coordinate already attacked!',
    HIT_SUCCESS: 'Hit! Attack was successful!',
    HIT_MISS: 'Miss! Attack was unsuccessful',

    HIT_SUNK: (ship) => `Hit! A ${ship} was sunked!`,
    INVALID_GAME_ID: (id) => `Invalid game id ${id}!`,
    INVALID_ENDPOINT: (method, url) => `Cannot ${method}: ${url}`,
  },

  // validation error messages
  VALIDATE: {
    EMPTY_PARAM: (field) => `Field ${field} is empty!`,
    INVALID_PARAM: (field) => `Invalid ${field}!`,
  },

  // database connection and initialization messages
  DATABASE: {
    CONNECTION: {
      SUCCESS: 'Connected to the database successfully!',
      FAILED: (error) => `Failed to connect to the database: ${error.message}`,
    },
    TABLE: {
      CREATED: (table) => `Table '${table}' created successfully or already exists!`,
      FAILED: (table, error) => `Failed to create database table '${table}': ${error.message}`,
    },
  },

  // service error messages
  SERVICE: {
    CREATE_FAILED: (table, error) => `Failed to create new ${table}: ${error.message}`,
    GET_BY_ID_FAILED: (table, id, error) => `Failed to fetch the ${table} by id ${id}: ${error.message}`,
    UPDATE_FAILED: (table, id, error) => `Failed to update the ${table} by id ${id}: ${error.message}`,
    GET_BY_GAME_ID_FAILED: (table, id, error) => `Failed to get all ${table} by game id ${id}: ${error.message}`,
  },
};
