const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { DATABASE } = require('../common/messages');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.log(`${DATABASE.CONNECTION.FAILED(error)}`);
  } else {
    console.log(`${DATABASE.CONNECTION.SUCCESS}`);
  }
});

module.exports = db;
