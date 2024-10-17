const logger = require('../middleware/logger/logger');
const GameService = require('../services/game.service');
const ShipService = require('../services/ship.service');
const AttackService = require('../services/attack.service');
const { LOG_TYPE } = require('../enum/log');
const { PAYLOAD } = require('../common/messages');
const { GAME_STATUS, GRID } = require('../enum/game');
const { SHIP_TYPE, SHIP_POSITION } = require('../enum/ship');

const GameController = {
  startNewGame: async (req, res) => {
    try {
      // create a new game
      const gameDetails = {
        gameStatus: GAME_STATUS.IN_PROGRESS,
        size: GRID.SIZE,
      };
      const newGame = await GameService.createNewGame(gameDetails);

      // create the grid
      const grid = await createEmptyGrid(newGame.grid_size);

      // place ships and populate the table
      const ships = await placeShipsOnGrid(grid);
      for (const ship of ships) {
        const shipDetails = {
          gameId: newGame.game_id,
          type: ship.ship,
          size: ship.size,
          position: ship.position,
          startRow: ship.startRow,
          endRow: ship.endRow,
          startCol: ship.startCol,
          endCol: ship.endCol,
        };

        await ShipService.placeShip(shipDetails);
      }

      res.status(200).json({
        success: true,
        data: {
          message: PAYLOAD.GAME_STARTED,
          game: newGame,
        },
      });
    } catch (error) {
      logger(LOG_TYPE.ERROR, false, 500, error.message, req);

      res.status(500).json({
        success: false,
        data: {
          message: error.message,
        },
      });
    }
  },

  getGameDetails: async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);

      // get the game by id and validate
      const game = await GameService.getGameById(gameId);
      if (!game || game.game_status === GAME_STATUS.OVER) {
        throw new Error(PAYLOAD.INVALID_GAME_ID(gameId));
      }

      // get ships and attacks
      const ships = await ShipService.getAllShipsByGameId(gameId);
      const attacks = await AttackService.getAllAttacksByGameId(gameId);

      res.status(200).json({
        success: true,
        data: {
          message: PAYLOAD.GAME_FETCHED(gameId),
          game: game,
          ships: ships,
          attacks: attacks,
        },
      });
    } catch (error) {
      logger(LOG_TYPE.ERROR, false, 500, error.message, req);

      res.status(500).json({
        success: false,
        data: {
          message: error.message,
        },
      });
    }
  },

  abandonGame: async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);

      // get the game by id and validate
      const game = await GameService.getGameById(gameId);
      if (!game || game.game_status === GAME_STATUS.OVER) {
        throw new Error(PAYLOAD.INVALID_GAME_ID(gameId));
      }

      // update game status
      const gameDetails = {
        id: game.game_id,
        status: GAME_STATUS.OVER,
        size: game.grid_size,
      };
      const updatedGame = await GameService.updateGameStatusById(gameDetails);

      res.status(200).json({
        success: true,
        data: {
          message: PAYLOAD.GAME_ABANDONED(gameId),
          game: updatedGame,
        },
      });
    } catch (error) {
      logger(LOG_TYPE.ERROR, false, 500, error.message, req);

      res.status(500).json({
        success: false,
        data: {
          message: error.message,
        },
      });
    }
  },
};

const createEmptyGrid = async (size) => {
  return Array.from({ length: size }, () => Array(size).fill('~'));
};

const placeShipsOnGrid = async (grid) => {
  const placedShips = [];

  // get the number of ships to place
  const shipsToPlace = Object.values(SHIP_TYPE).flatMap((ship) => Array.from({ length: ship.count }, () => ship));

  // place the ship on the grid
  for (const ship of shipsToPlace) {
    let isPlaced = false;
    // while (!isPlaced) {}

    let startPoint = Math.floor(Math.random() * grid.length);
    const isHorizontal = Math.random() >= 0.5;

    const shipSize = ship.size - 1;
    let endPoint = startPoint + shipSize;

    // check if end point is within the grid
    if (endPoint >= grid.length) {
      endPoint = startPoint - shipSize;
    }

    // validate start and end points
    if (endPoint < startPoint) {
      [startPoint, endPoint] = [endPoint, startPoint];
    }

    // assign random starting point
    let maxStart = grid.length - shipSize;
    let randomStart = Math.floor(Math.random() * (maxStart + 1));

    placedShips.push({
      ship: ship.name,
      size: ship.size,
      position: isHorizontal ? SHIP_POSITION.HORIZONTAL : SHIP_POSITION.VERTICAL,
      startRow: isHorizontal ? randomStart : startPoint,
      endRow: isHorizontal ? randomStart : endPoint,
      startCol: isHorizontal ? startPoint : randomStart,
      endCol: isHorizontal ? endPoint : randomStart,
    });
  }

  return placedShips;
};

// TODO: check and validate ship placement
const checkShipPlacement = async (grid, startingPoint, shipSize, isHorizontal) => {};

module.exports = GameController;
