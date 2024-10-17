const logger = require('../middleware/logger/logger');
const GameService = require('../services/game.service');
const ShipService = require('../services/ship.service');
const AttackService = require('../services/attack.service');
const Validator = require('../util/validator');
const { PAYLOAD } = require('../common/messages');
const { GAME_STATUS } = require('../enum/game');
const { LOG_TYPE } = require('../enum/log');
const { SHIP_POSITION } = require('../enum/ship');

const AttackController = {
  coordinateAttack: async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const { cooridnate } = req.body;
      let payloadMessage = PAYLOAD.HIT_MISS;

      // get the game by id and validate
      const game = await GameService.getGameById(gameId);
      if (!game || game.game_status === GAME_STATUS.OVER) {
        throw new Error(PAYLOAD.INVALID_GAME_ID(gameId));
      }
      if (game.game_status === GAME_STATUS.WON) {
        throw new Error(PAYLOAD.GAME_OVER);
      }

      // validate coordinate
      await Validator.validateAttackCoordinate(cooridnate);

      // check if attack is already made
      const attackVertices = await getVertices(cooridnate, game);
      const previousAttacks = await AttackService.getAllAttacksByGameId(gameId);
      const isAlreadyAttacked = await checkAttackAvailable(attackVertices, previousAttacks);
      // if (isAlreadyAttacked) {
      //   throw new Error(PAYLOAD.ATTACK_ALREADY_MADE);
      // }

      // check if attack hits a ship
      const ships = await ShipService.getAllShipsByGameId(gameId);
      const isHit = await checkAttackHit(attackVertices, ships);

      // populate the attack table
      const attackDetails = {
        gameId: game.game_id,
        attackRow: attackVertices.row,
        attackCol: attackVertices.col,
        hit: isHit,
      };
      const allAttacks = await AttackService.createNewAttack(attackDetails);

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
              const updatedShips = await ShipService.updateShipStatusById(shipDetails);

              // check all ships are sunk
              const isWon = updatedShips.every((ship) => ship.is_sunk === 1);
              if (isWon) {
                payloadMessage = PAYLOAD.GAME_WON;

                // update game status
                const gameDetails = {
                  id: game.game_id,
                  status: GAME_STATUS.WON,
                };
                await GameService.updateGameStatusById(gameDetails);
              }
            }
          }
        }
      }

      res.status(200).json({
        success: true,
        data: {
          message: payloadMessage,
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

module.exports = AttackController;
