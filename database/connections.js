const chalk = require('chalk');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.log(chalk.white.bgRed.bold(`Failed to connect to the database: ${error.message}`));
  } else {
    console.log(chalk.white.bgGreen.bold('Connected to the database successfully!'));
  }
});

module.exports = db;
