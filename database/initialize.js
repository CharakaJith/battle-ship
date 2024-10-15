const chalk = require('chalk');
const db = require('./connection');
const { DATABASE } = require('../enum/message');
const { query } = require('express');

const Initialize = {
  createTables: () => {
    const tables = [
      // game table
      {
        table: 'games',
        query: `CREATE TABLE IF NOT EXISTS games (
            game_id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_status VARCHAR(20) NOT NULL,
            grid_size INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );`,
      },

      // ship table
      {
        table: 'ships',
        query: `CREATE TABLE IF NOT EXISTS ships(
            ship_id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_id INTEGER NOT NULL,
            ship_type VARCHAR(20) NOT NULL,
            ship_size INTEGER NOT NULL,
            ship_position VARCHAR(20) NOT NULL,
            ship_coordinate TEXT NOT NULL,
            is_sunck BOOLEAN NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
          );`,
      },

      // shots table
      {
        table: 'shots',
        query: `CREATE TABLE IF NOT EXISTS shots(
            shot_id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_id INTEGER NOT NULL,
            shot_coordinate VARCHAR(5) NOT NULL,
            is_hit BOOLEAN NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
          )`,
      },
    ];

    // create tables
    tables.forEach(({ table, query }) => {
      db.run(query, (error) => {
        if (error) {
          console.log(chalk.white.bgRed.bold(` ${DATABASE.TABLE_FAILED(table, error)} `));
        } else {
          console.log(chalk.white.bgCyan.bold(` ${DATABASE.TABLE_CREATED(table)} `));
        }
      });
    });
  },
};

module.exports = Initialize;
