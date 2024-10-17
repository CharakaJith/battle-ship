const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const Initialize = require('./database/initialize');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// create database and tables
Initialize.createTables();

// export routes
const game = require('./routes/game.routes');
const attack = require('./routes/attack.routes');

// setup routing paths
app.use('/api/game', game);
app.use('/api/attack', attack);

const env = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    chalk.white.bgGreen.bold(' PORT ') +
      chalk.white.bgBlue.bold(` ${PORT} `) +
      chalk.white.bgGreen.bold(' MODE ') +
      chalk.white.bgRed.bold(` ${env} `)
  );
});
