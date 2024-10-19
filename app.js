const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const initialize = require('./database/initialize');
const errorHandler = require('./middleware/errorHandler');
const { PAYLOAD } = require('./common/messages');
const { APP_ENV, STATUS_CODE } = require('./constants/app.constant');
require('dotenv').config();

const routesV1 = require('./routes/v1/index');
const routesV2 = require('./routes/v2/index');
const CustomError = require('./util/customError');

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());

// initialize database
const initialization = async () => {
  // create database and tables
  await initialize.createTables();

  // insert initial user
  await initialize.insertUser();
};
initialization();

// setup routing paths
app.use('/api/v1', routesV1);
app.use('/api/v2', routesV2);

// route for undefined routes
app.use((req, res) => {
  const { method, originalUrl } = req;

  throw new CustomError(PAYLOAD.INVALID_ENDPOINT(method, originalUrl), STATUS_CODE.BAD_REQUEST);
});

// global custom error handler
app.use(errorHandler);

const env = process.env.NODE_ENV || APP_ENV.DEV;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    chalk.white.bgGreen.bold(' PORT ') +
      chalk.white.bgBlue.bold(` ${PORT} `) +
      chalk.white.bgGreen.bold(' MODE ') +
      chalk.white.bgRed.bold(` ${env} `)
  );
});
