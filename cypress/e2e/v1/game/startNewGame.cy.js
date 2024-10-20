/* eslint-disable no-undef */
const { PAYLOAD } = require('../../../../common/messages');
const { STATUS_CODE, REQ_METHOD } = require('../../../../constants/app.constant');
const { GAME_STATUS, GRID } = require('../../../../constants/game.constant');

describe('Start New Game Route Test', () => {
  const token = Cypress.env('token');

  it('should start a new game successfully', () => {
    cy.request({
      method: REQ_METHOD.POST,
      url: '/v1/game',
      headers: {
        authorization: `"${token}"`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(STATUS_CODE.CREATED);
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('message', PAYLOAD.GAME.STARTED);
      expect(response.body.data).to.have.property('game');
      expect(response.body.data.game).to.have.property('game_id').that.is.a('number');
      expect(response.body.data.game).to.have.property('game_status', GAME_STATUS.IN_PROGRESS);
      expect(response.body.data.game).to.have.property('grid_size', GRID.SIZE);
      expect(response.body.data.game).to.have.property('created_at').that.is.a('string');
      expect(response.body.data.game).to.have.property('updated_at').that.is.a('string');
    });
  });

  it('should return an error for unauthorized access', () => {
    cy.request({
      method: REQ_METHOD.POST,
      url: '/v1/game',
      headers: {
        authorization: 'invalid.token',
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(JSON.stringify(response));

      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('message', PAYLOAD.AUTH.FAILED);
    });
  });
});
