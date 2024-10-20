/* eslint-disable no-undef */
const { PAYLOAD } = require('../../../../common/messages');
const { STATUS_CODE, REQ_METHOD } = require('../../../../constants/app.constant');
const { GAME_STATUS, GRID } = require('../../../../constants/game.constant');

describe('Get Game Details Route Test', () => {
  const token = Cypress.env('token');

  it('should fetch game details successfully', () => {
    cy.request({
      method: REQ_METHOD.GET,
      url: '/v1/game/4',
      headers: {
        authorization: `"${token}"`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(STATUS_CODE.OK);
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('data');

      expect(response.body.data).to.have.property('message', PAYLOAD.GAME.FETCHED);
      expect(response.body.data).to.have.property('game').that.is.an('object');
      expect(response.body.data.game).to.have.property('game_id', 4);
      expect(response.body.data.game).to.have.property('game_status', GAME_STATUS.IN_PROGRESS);
      expect(response.body.data.game).to.have.property('grid_size', GRID.SIZE);

      // check the ships array
      expect(response.body.data).to.have.property('ships').that.is.an('array');
      expect(response.body.data.ships).to.have.length.greaterThan(0);

      // check the attacks array
      expect(response.body.data).to.have.property('attacks').that.is.an('array');
    });
  });

  it('should return an error for invalid game id', () => {
    cy.request({
      method: REQ_METHOD.GET,
      url: '/v1/game/0',
      headers: {
        authorization: `"${token}"`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(STATUS_CODE.NOT_FOUND);
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('message', PAYLOAD.GAME.INVALID_ID(0));
    });
  });

  it('should return an error for fail authentication', () => {
    cy.request({
      method: REQ_METHOD.GET,
      url: '/v1/game/1',
      headers: {
        authorization: 'invalid.token',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(STATUS_CODE.UNAUTHORIZED);
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('message', PAYLOAD.AUTH.FAILED);
    });
  });
});
