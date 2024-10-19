const attackRepository = require('../repositories/attack.repository');
const gameRepository = require('../repositories/game.repository');
const shipRepository = require('../repositories/ship.repository');
const CustomError = require('../util/customError');
const { PAYLOAD } = require('../common/messages');
const { STATUS_CODE } = require('../constants/app.constant');
const { GAME_STATUS, GRID } = require('../constants/game.constant');
const { SHIP_TYPE, SHIP_POSITION } = require('../constants/ship.constant');

const gameService = {
  startNewGame: async (user) => {
    // create a new game
    const gameDetails = {
      userId: user.id,
      gameStatus: GAME_STATUS.IN_PROGRESS,
      size: GRID.SIZE,
    };
    const newGame = await gameRepository.createNewGame(gameDetails);

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

      await shipRepository.placeShip(shipDetails);
    }

    return {
      statusCode: STATUS_CODE.CREATED,
      responseMessage: PAYLOAD.GAME.STARTED,
      game: newGame,
    };
  },

  getGameDetails: async (data) => {
    const { gameId, user } = data;

    // get the game by id and validate
    const game = await gameRepository.getGameById(gameId);
    if (!game) {
      throw new CustomError(PAYLOAD.GAME.INVALID_ID(gameId), STATUS_CODE.NOT_FOUND);
    }
    if (game.user_id !== user.id) {
      throw new CustomError(PAYLOAD.PERMISSION_DENIED, STATUS_CODE.FORBIDDON);
    }

    // get ships and attacks
    const ships = await shipRepository.getAllShipsByGameId(gameId);
    const attacks = await attackRepository.getAllAttacksByGameId(gameId);

    return {
      statusCode: STATUS_CODE.OK,
      responseMessage: PAYLOAD.GAME.FETCHED,
      game: game,
      ships: ships,
      attacks: attacks,
    };
  },

  abandonGame: async (data) => {
    const { gameId, user } = data;

    // get the game by id and validate
    const game = await gameRepository.getGameById(gameId);
    if (!game) {
      throw new CustomError(PAYLOAD.GAME.INVALID_ID(gameId), STATUS_CODE.NOT_FOUND);
    }
    if (game.user_id !== user.id) {
      throw new CustomError(PAYLOAD.PERMISSION_DENIED, STATUS_CODE.FORBIDDON);
    }
    if (game.game_status !== GAME_STATUS.IN_PROGRESS) {
      throw new CustomError(PAYLOAD.GAME.OVER, STATUS_CODE.CONFLICT);
    }

    // update game status
    const gameDetails = {
      id: game.game_id,
      status: GAME_STATUS.OVER,
      size: game.grid_size,
    };
    await gameRepository.updateGameStatusById(gameDetails);

    return {
      statusCode: STATUS_CODE.OK,
      responseMessage: PAYLOAD.GAME.ABANDONED,
    };
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
    while (!isPlaced) {
      const isHorizontal = Math.random() >= 0.5;
      let startPoint = Math.floor(Math.random() * grid.length);
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
      const maxStart = grid.length - shipSize;
      const randomStart = Math.floor(Math.random() * (maxStart + 1));

      const newShip = {
        ship: ship.name,
        size: ship.size,
        position: isHorizontal ? SHIP_POSITION.HORIZONTAL : SHIP_POSITION.VERTICAL,
        startRow: isHorizontal ? randomStart : startPoint,
        endRow: isHorizontal ? randomStart : endPoint,
        startCol: isHorizontal ? startPoint : randomStart,
        endCol: isHorizontal ? endPoint : randomStart,
      };

      // check if available position
      const isAvailable = await checkShipPlacement(newShip, placedShips);

      if (isAvailable) {
        placedShips.push(newShip);

        isPlaced = true;
      }
    }
  }

  return placedShips;
};

const checkShipPlacement = async (newShip, placedShips) => {
  const { position, startRow, startCol, endRow, endCol } = newShip;

  let isAvailable = true;
  for (const placedShip of placedShips) {
    const samePosition = placedShip.position === position;

    // check horizontal overlap
    if (
      samePosition &&
      position === SHIP_POSITION.HORIZONTAL &&
      placedShip.startRow === startRow &&
      startCol <= placedShip.endCol &&
      endCol >= placedShip.startCol
    ) {
      isAvailable = false;
    }

    // check vertical overlap
    if (
      samePosition &&
      position === SHIP_POSITION.VERTICAL &&
      placedShip.startCol === startCol &&
      startRow <= placedShip.endRow &&
      endRow >= placedShip.startRow
    ) {
      isAvailable = false;
    }

    // check cross overlap
    if (
      !samePosition &&
      ((startRow >= placedShip.startRow && startRow <= placedShip.endRow && startCol === placedShip.startCol) ||
        (startCol >= placedShip.startCol && startCol <= placedShip.endCol && startRow === placedShip.startRow))
    ) {
      isAvailable = false;
    }
  }

  return isAvailable;
};

module.exports = gameService;
