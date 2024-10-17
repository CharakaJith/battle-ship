const GameRepository = require('../repositories/game.repository');
const AttackRepository = require('../repositories/attack.repository');
const ShipRepository = require('../repositories/ship.repository');
const FieldValidator = require('../util/field.validator');
const { PAYLOAD } = require('../common/messages');
const { GAME_STATUS } = require('../enum/game');
const { SHIP_POSITION } = require('../enum/ship');

const AttackService = {
  coordinateAttack: async (data) => {
    const { gameId, coordinate } = data;
    let payloadMessage = PAYLOAD.HIT_MISS;

    // get the game by id and validate
    const game = await GameRepository.getGameById(gameId);
    if (!game || game.game_status === GAME_STATUS.OVER) {
      throw new Error(PAYLOAD.INVALID_GAME_ID(gameId));
    }
    if (game.game_status === GAME_STATUS.WON) {
      throw new Error(PAYLOAD.GAME_OVER);
    }

    // validate coordinate
    await FieldValidator.validateAttackCoordinate(coordinate);

    // check if attack is already made
    const attackVertices = await getVertices(coordinate, game);
    const previousAttacks = await AttackRepository.getAllAttacksByGameId(gameId);
    const isAlreadyAttacked = await checkAttackAvailable(attackVertices, previousAttacks);
    if (isAlreadyAttacked) {
      throw new Error(PAYLOAD.ATTACK_ALREADY_MADE);
    }

    // check if attack hits a ship
    const ships = await ShipRepository.getAllShipsByGameId(gameId);
    const isHit = await checkAttackHit(attackVertices, ships);

    // populate the attack table
    const attackDetails = {
      gameId: game.game_id,
      attackRow: attackVertices.row,
      attackCol: attackVertices.col,
      hit: isHit,
    };
    const allAttacks = await AttackRepository.createNewAttack(attackDetails);

    // check if a ship sunk and update ship status
    if (isHit) {
      payloadMessage = PAYLOAD.HIT_SUCCESS;

      for (const ship of ships) {
        if (ship.is_sunk === 0) {
          const isSunk = await checkIfShipSunk(ship, allAttacks);

          if (isSunk) {
            payloadMessage = PAYLOAD.HIT_SUNK(ship.ship_type);

            // update ship status
            const shipDetails = {
              id: ship.ship_id,
              gameId: gameId,
              isSunk: true,
            };
            const updatedShips = await ShipRepository.updateShipStatusById(shipDetails);

            // check all ships are sunk
            const isWon = updatedShips.every((ship) => ship.is_sunk === 1);
            if (isWon) {
              payloadMessage = PAYLOAD.GAME_WON;

              // update game status
              const gameDetails = {
                id: game.game_id,
                status: GAME_STATUS.WON,
              };
              await GameRepository.updateGameStatusById(gameDetails);
            }
          }
        }
      }
    }

    return {
      statusCode: 200,
      responseMessage: payloadMessage,
    };
  },
};

const getAlphabetPosition = async (letter) => {
  return letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
};

const getVertices = async (coordinate, game) => {
  const match = coordinate.match(/^([A-Z])(\d+)$/);

  const [_, letter, number] = match;
  const colNum = await getAlphabetPosition(letter);
  const row = parseInt(number, 10) - 1;
  const col = colNum - 1;

  // validate row and column against grid size
  if (row < 0 || row >= game.grid_size || col < 0 || col >= game.grid_size) {
    throw new Error(PAYLOAD.INVALID_COORDINATE);
  }

  return { row, col };
};

const checkAttackAvailable = async (attack, previousAttacks) => {
  return previousAttacks.some((prev) => prev.attack_row === attack.row && prev.attack_col === attack.col);
};

const checkAttackHit = async (attack, ships, previousAttacks) => {
  const attackRow = attack.row;
  const attackCol = attack.col;

  let isHit = false;
  for (const ship of ships) {
    if (ship.ship_position === SHIP_POSITION.HORIZONTAL) {
      // check if the attack row matches and the column is within the ship's column range
      if (attackRow === ship.start_row && attackCol >= ship.start_col && attackCol <= ship.end_col) {
        isHit = true;
      }
    } else if (ship.ship_position === SHIP_POSITION.VERTICAL) {
      // check if the attack column matches and the row is within the ship's row range
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

module.exports = AttackService;
