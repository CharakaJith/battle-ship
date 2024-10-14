const chalk = require('chalk');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { DATABASE } = require('../enum/message');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.log(chalk.white.bgRed.bold(DATABASE.CONN_FAILED(error)));
  } else {
    console.log(chalk.white.bgGreen.bold(DATABASE.CONN_SUCCESS));
  }
});

module.exports = db;
