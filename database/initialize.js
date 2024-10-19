const bcrypt = require('bcrypt');
const db = require('./connection');
const UserRepository = require('../repositories/user.repository');
const { DATABASE } = require('../common/messages');
require('dotenv').config();

const Initialize = {
  createTables: async () => {
    const tables = [
      // users table
      {
        table: 'users',
        query: `CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT NOT NULL,
            user_email TEXT NOT NULL,
            user_password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
      },

      // games table
      {
        table: 'games',
        query: `CREATE TABLE IF NOT EXISTS games (
            game_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            game_status VARCHAR(20) NOT NULL,
            grid_size INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
          );`,
      },

      // ships table
      {
        table: 'ships',
        query: `CREATE TABLE IF NOT EXISTS ships (
            ship_id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_id INTEGER NOT NULL,
            ship_type VARCHAR(20) NOT NULL,
            ship_size INTEGER NOT NULL,
            ship_position VARCHAR(20) NOT NULL,
            start_row INTEGER NOT NULL,
            end_row INTEGER NOT NULL,
            start_col INTEGER NOT NULL,
            end_col INTEGER NOT NULL,
            is_sunk BOOLEAN NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
          );`,
      },

      // attacks table
      {
        table: 'attacks',
        query: `CREATE TABLE IF NOT EXISTS attacks (
            attack_id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_id INTEGER NOT NULL,
            attack_row INTEGER NOT NULL,
            attack_col INTEGER NOT NULL,
            is_hit BOOLEAN NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
          );`,
      },
    ];

    // create tables
    for (const { table, query } of tables) {
      await new Promise((resolve, reject) => {
        db.run(query, (error) => {
          if (error) {
            console.log(`${DATABASE.TABLE.FAILED(table, error)}`);
            return reject(error);
          } else {
            console.log(`${DATABASE.TABLE.CREATED(table)}`);
            return resolve();
          }
        });
      });
    }
  },

  insertUser: async () => {
    const name = process.env.USER_NAME;
    const email = process.env.USER_EMAIL;
    const password = process.env.USER_PASSWORD;

    // check if user exists
    const user = await UserRepository.getUserByEmail(email);
    if (user) {
      return;
    }

    // hash password
    const hashedPassword = bcrypt.hash(password, 10);

    // create new user
    const userDetails = {
      name: name,
      email: email,
      password: hashedPassword,
    };
    const newUser = await UserRepository.createNewUser(userDetails);

    console.log(DATABASE.USER.CREATED(newUser.user_email));
  },
};

module.exports = Initialize;
