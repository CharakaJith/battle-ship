const express = require('express');
const routesV1 = express.Router();
const attackRoutes = require('./attack.routes');
const authRoutes = require('./auth.routes');
const gameRoutes = require('./game.routes');

routesV1.use('/attack', attackRoutes);
routesV1.use('/auth', authRoutes);
routesV1.use('/game', gameRoutes);

module.exports = routesV1;
