const attackService = require('../services/attack.service');

const attackController = {
  coordinateAttack: async (req, res, next) => {
    try {
      const user = req.user;
      const { gameId, coordinate } = req.body;

      const data = { gameId, coordinate, user };
      const attackResponse = await attackService.coordinateAttack(data);

      const { statusCode, responseMessage, isHit, isWon, sunkenShips } = attackResponse;
      res.status(statusCode).json({
        success: true,
        data: {
          message: responseMessage,
          isHit: isHit,
          isWon: isWon,
          sunkenShips: sunkenShips,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = attackController;
