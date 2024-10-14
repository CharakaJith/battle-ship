const chalk = require('chalk');
const db = require('./connections');
const { DATABASE } = require('../enum/message');

const Initialize = {
  createTables: () => {
    const tables = [
      // game table
      {
        table: 'games',
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
    tables.forEach(({ table, query }) => {
      db.run(query, (error) => {
        if (error) {
          console.log(chalk.white.bgRed.bold(DATABASE.CONN_FAILED(table, error)));
        } else {
          console.log(chalk.white.bgBlue.bold(DATABASE.TABLE_CREATED(table)));
        }
      });
    });
  },
};

module.exports = Initialize;
