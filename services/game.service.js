const AttackRepository = require('../repositories/attack.repository');
const GameRepository = require('../repositories/game.repository');
const ShipRepository = require('../repositories/ship.repository');
const { PAYLOAD } = require('../common/messages');
const { GAME_STATUS, GRID } = require('../enum/game');
const { SHIP_TYPE, SHIP_POSITION } = require('../enum/ship');

const GameService = {
  startNewGame: async () => {
    // create a new game
    const gameDetails = {
      gameStatus: GAME_STATUS.IN_PROGRESS,
      size: GRID.SIZE,
    };
    const newGame = await GameRepository.createNewGame(gameDetails);

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

      await ShipRepository.placeShip(shipDetails);
    }

    return {
      statusCode: 201,
      responseMessage: PAYLOAD.GAME_STARTED,
      game: newGame,
    };
  },

  getGameDetails: async (gameId) => {
    // get the game by id and validate
    const game = await GameRepository.getGameById(gameId);
    if (!game || game.game_status === GAME_STATUS.OVER) {
      throw new Error(PAYLOAD.INVALID_GAME_ID(gameId));
    }

    // get ships and attacks
    const ships = await ShipRepository.getAllShipsByGameId(gameId);
    const attacks = await AttackRepository.getAllAttacksByGameId(gameId);

    return {
      statusCode: 200,
      responseMessage: PAYLOAD.GAME_FETCHED,
      game: game,
      ships: ships,
      attacks: attacks,
    };
  },

  abandonGame: async (gameId) => {
    // get the game by id and validate
    const game = await GameRepository.getGameById(gameId);
    if (!game || game.game_status === GAME_STATUS.OVER) {
      throw new Error(PAYLOAD.INVALID_GAME_ID(gameId));
    }

    // update game status
    const gameDetails = {
      id: game.game_id,
      status: GAME_STATUS.OVER,
      size: game.grid_size,
    };
    await GameRepository.updateGameStatusById(gameDetails);

    return {
      statusCode: 200,
      responseMessage: PAYLOAD.GAME_ABANDONED,
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
      let maxStart = grid.length - shipSize;
      let randomStart = Math.floor(Math.random() * (maxStart + 1));

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

module.exports = GameService;
