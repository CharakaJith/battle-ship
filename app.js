const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const Initialize = require('./database/initialize');
const routesV1 = require('./routes/v1/index');
const routesV2 = require('./routes/v2/index');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// create database and tables
Initialize.createTables();

// setup routing paths
app.use('/api/v1', routesV1);
// app.use('/api/attack', attack);

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
