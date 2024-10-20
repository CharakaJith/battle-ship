const gameRepository = require('../repositories/game.repository');
const attackRepository = require('../repositories/attack.repository');
const shipRepository = require('../repositories/ship.repository');
const fieldValidator = require('../util/fieldValidator');
const CustomError = require('../util/customError');
const { PAYLOAD } = require('../common/messages');
const { STATUS_CODE } = require('../constants/app.constant');
const { GAME_STATUS } = require('../constants/game.constant');
const { SHIP_POSITION } = require('../constants/ship.constant');

const attackService = {
  coordinateAttack: async (data) => {
    const { gameId, coordinate, user } = data;
    let gameWon = false;
    let payloadMessage = PAYLOAD.ATTACK.MISS;

    // validate game id and coordinate
    await fieldValidator.checkIfEmptyNumber(gameId, 'gameId');
    await fieldValidator.validateAttackCoordinate(coordinate);

    // get the game by id and validate
    const game = await gameRepository.getGameById(gameId);
    if (!game || game.game_status === GAME_STATUS.OVER) {
      throw new CustomError(PAYLOAD.GAME.INVALID_ID(gameId), STATUS_CODE.NOT_FOUND);
    }
    if (game.user_id !== user.id) {
      throw new CustomError(PAYLOAD.PERMISSION_DENIED, STATUS_CODE.FORBIDDON);
    }
    if (game.game_status === GAME_STATUS.WON) {
      gameWon = true;
      const ships = await shipRepository.getAllShipsByGameId(gameId);
      const sunkenShips = ships.filter((ship) => ship.is_sunk === 1);

      return {
        statusCode: STATUS_CODE.OK,
        responseMessage: PAYLOAD.GAME.WON,
        isHit: false,
        isWon: gameWon,
        sunkenShips: sunkenShips,
      };
    }

    // check if attack is already made
    const attackVertices = await getVertices(coordinate, game);
    const previousAttacks = await attackRepository.getAllAttacksByGameId(gameId);
    const isAlreadyAttacked = await checkAttackAvailable(attackVertices, previousAttacks);
    if (isAlreadyAttacked) {
      throw new CustomError(PAYLOAD.ATTACK.MADE, STATUS_CODE.CONFLICT);
    }

    // check if attack hits a ship
    const ships = await shipRepository.getAllShipsByGameId(gameId);
    const sunkenShips = ships.filter((ship) => ship.is_sunk === 1);
    const isHit = await checkAttackHit(attackVertices, ships);

    // populate the attack table
    const attackDetails = {
      gameId: game.game_id,
      attackRow: attackVertices.row,
      attackCol: attackVertices.col,
      hit: isHit,
    };
    const allAttacks = await attackRepository.createNewAttack(attackDetails);

    // check if a ship sunk and update ship status
    if (isHit) {
      payloadMessage = PAYLOAD.ATTACK.HIT;

      for (const ship of ships) {
        if (ship.is_sunk === 0) {
          const isSunk = await checkIfShipSunk(ship, allAttacks);

          if (isSunk) {
            sunkenShips.push(ship);
            payloadMessage = PAYLOAD.ATTACK.SUNK(ship.ship_type);

            // update ship status
            const shipDetails = {
              id: ship.ship_id,
              gameId: gameId,
              isSunk: true,
            };
            const updatedShips = await shipRepository.updateShipStatusById(shipDetails);

            // check all ships are sunk
            const isWon = updatedShips.every((ship) => ship.is_sunk === 1);
            if (isWon) {
              gameWon = true;

              // update game status
              const gameDetails = {
                id: game.game_id,
                status: GAME_STATUS.WON,
              };
              await gameRepository.updateGameStatusById(gameDetails);
            }
          }
        }
      }
    }

    return {
      statusCode: STATUS_CODE.OK,
      responseMessage: payloadMessage,
      isHit: isHit,
      isWon: gameWon,
      sunkenShips: sunkenShips,
    };
  },
};

const getAlphabetPosition = async (letter) => {
  return letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
};

const getVertices = async (coordinate, game) => {
  const match = coordinate.match(/^([A-Z])(\d+)$/);

  // eslint-disable-next-line no-unused-vars
  const [_, letter, number] = match;
  const colNum = await getAlphabetPosition(letter);
  const row = parseInt(number, 10) - 1;
  const col = colNum - 1;

  // validate row and column against grid size
  if (row < 0 || row >= game.grid_size || col < 0 || col >= game.grid_size) {
    throw new CustomError(PAYLOAD.ATTACK.INVALID, STATUS_CODE.BAD_REQUEST);
  }

  return { row, col };
};

const checkAttackAvailable = async (attack, previousAttacks) => {
  return previousAttacks.some((prev) => prev.attack_row === attack.row && prev.attack_col === attack.col);
};

const checkAttackHit = async (attack, ships) => {
  const attackRow = attack.row;
  const attackCol = attack.col;

  let isHit = false;
  for (const ship of ships) {
    if (ship.ship_position === SHIP_POSITION.HORIZONTAL) {
      // check attack row match and column is hit
      if (attackRow === ship.start_row && attackCol >= ship.start_col && attackCol <= ship.end_col) {
        isHit = true;
      }
    } else if (ship.ship_position === SHIP_POSITION.VERTICAL) {
      // check attack column match and row is hit
      if (attackCol === ship.start_col && attackRow >= ship.start_row && attackRow <= ship.end_row) {
        isHit = true;
      }
    }
  }

  return isHit;
};

const checkIfShipSunk = async (ship, allAttacks) => {
  // get successful hits
  const hits = allAttacks.filter((attack) => attack.is_hit === 1);

  // get ship coordinates
  const shipPositions = [];
  if (ship.ship_position === SHIP_POSITION.VERTICAL) {
    for (let row = ship.start_row; row <= ship.end_row; row++) {
      shipPositions.push({ row, col: ship.start_col });
    }
  } else if (ship.ship_position === SHIP_POSITION.HORIZONTAL) {
    for (let col = ship.start_col; col <= ship.end_col; col++) {
      shipPositions.push({ row: ship.start_row, col });
    }
  }

  return shipPositions.every((pos) => hits.some((attack) => attack.attack_row === pos.row && attack.attack_col === pos.col));
};

module.exports = attackService;
