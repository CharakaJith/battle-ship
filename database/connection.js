const chalk = require('chalk');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { DATABASE } = require('../common/messages');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.log(chalk.white.bgRed.bold(` ${DATABASE.CONNECTION.FAILED(error)} `));
  } else {
    console.log(chalk.white.bgGreen.bold(` ${DATABASE.CONNECTION.SUCCESS} `));
  }
});

module.exports = db;
