const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const env = process.env.NODE_ENV || 'development';
const Initialize = require('./database/initialize');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// create database tables
Initialize.createTables();

// export routes
const battleship = require('./routes/battleship.routes');

// setup routing paths
app.use('/api/battleship', battleship);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    chalk.white.bgGreen.bold(' PORT ') +
      chalk.white.bgBlue.bold(` ${PORT} `) +
      chalk.white.bgGreen.bold(' MODE ') +
      chalk.white.bgRed.bold(` ${process.env.NODE_ENV} `)
  );
});
