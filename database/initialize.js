const db = require('./connection');
const { DATABASE } = require('../common/messages');

const Initialize = {
  createTables: () => {
    const tables = [
      // games table
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
    tables.forEach(({ table, query }) => {
      db.run(query, (error) => {
        if (error) {
          console.log(`${DATABASE.TABLE.FAILED(table, error)}`);
        } else {
          console.log(`${DATABASE.TABLE.CREATED(table)}`);
        }
      });
    });
  },
};

module.exports = Initialize;
