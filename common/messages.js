module.exports = {
  // response payload messages
  PAYLOAD: {
    GAME: {
      STARTED: 'New game has started!',
      FETCHED: 'Game fetched successfully!',
      ABANDONED: 'Game abandoned!',
      OVER: 'Game is already over!',
      WON: 'All ships sunked! you Won!',

      INVALID_ID: (id) => `Invalid game id ${id}!`,
    },
    ATTACK: {
      HIT: 'Hit! Attack was successful!',
      MISS: 'Miss! Attack was unsuccessful',
      INVALID: 'Attck coordinate is out of boundry!',
      MADE: 'Coordinate already attacked!',

      SUNK: (ship) => `Hit! A ${ship} was sunked!`,
    },
    JWT: {
      GENERATE: {
        SUCCESS: 'JWT generated!',
        FAILED: (token, error) => `Failed to generate ${token} token: ${error.message}`,
      },
      REFRESH: {
        SUCCESS: 'JWT refreshed!',
        FAILED: (error) => `Failed to refresh access token: ${error.message}`,
      },
    },

    INVALID_CREDENTIALS: 'Invalid email or password!',
    INVALID_ENDPOINT: (method, url) => `Cannot ${method}: ${url}`,
  },

  // validation error messages
  VALIDATE: {
    PARAM: {
      EMPTY: (field) => `Field ${field} is empty!`,
      INVALID: (field) => `Invalid ${field} format!`,
    },
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
    USER: {
      CREATED: (email) => `Initial user created: ${email}`,
    },
  },

  // service error messages
  SERVICE: {
    FAILED: {
      CREATE: (table, error) => `Failed to create new ${table}: ${error.message}`,
      UPDATE: (table, id, error) => `Failed to update the ${table} by id ${id}: ${error.message}`,
      GET: {
        BY_ID: (table, id, error) => `Failed to get the ${table} by id ${id}: ${error.message}`,
        BY_EMAIL: (table, email, error) => `Failed to get the ${table} by email ${email}: ${error.message}`,
        BY_GAME_ID: (table, id, error) => `Failed to get all ${table} by game id ${id}: ${error.message}`,
      },
    },
  },
};
