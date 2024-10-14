const chalk = require('chalk');
const db = require('./connections');

const Initialize = {
  createTables: () => {
    const tables = [
      // game table
      {
        name: 'games',
        query: `CREATE TABLE IF NOT EXISTS games (
            game_id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_status TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );`,
      },

      //
    ];

    // create tables
    tables.forEach(({ name, query }) => {
      db.run(query, (error) => {
        if (error) {
          console.log(chalk.white.bgRed.bold(`Failed to create database table "${name}": ${error.message}`));
        } else {
          console.log(chalk.white.bgBlue.bold(`Table '${name}' created successfully or already exists!`));
        }
      });
    });
  },
};

module.exports = Initialize;
