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

      // get the game by id and validate
      const game = await GameService.getGameById(gameId);
      if (!game || game.game_status === GAME_STATUS.OVER) {
        throw new Error(PAYLOAD.INVALID_GAME_ID(gameId));
      }

      // validate coordinate
      let isHit = false;
      let attackVertices;
      const isValidPoint = await Validator.validateAttackCoordinate(cooridnate);
      if (isValidPoint) {
        const ships = await ShipService.getAllShipsByGameId(gameId);
        attackVertices = await getVertices(cooridnate, game);

        // check if attack is already made
        const previousAttacks = await AttackService.getAllAttacksByGameId(gameId);
        const isAlreadyAttacked = await checkAttackAvailable(attackVertices, previousAttacks);
        if (isAlreadyAttacked) {
          throw new Error(PAYLOAD.ATTACK_ALREADY_MADE);
        }

        isHit = await checkAttackHit(attackVertices, ships);
      }

      // populate the attack table
      const attackDetails = {
        gameId: game.game_id,
        attackRow: attackVertices.row,
        attackCol: attackVertices.col,
        hit: isHit,
      };
      const newAttack = await AttackService.createNewAttack(attackDetails);

      res.status(200).json({
        success: true,
        data: {
          message: isHit ? PAYLOAD.HIT_SUCCESS : PAYLOAD.HIT_MISS,
          attack: newAttack,
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

const checkAttackHit = async (attack, ships) => {
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

module.exports = AttackController;
