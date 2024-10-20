/* eslint-disable no-undef */
const { PAYLOAD } = require('../../../../common/messages');
const { STATUS_CODE, REQ_METHOD } = require('../../../../constants/app.constant');

describe('Abandon Game Route Test', () => {
  const token = Cypress.env('token');

  // it('ongoing game has been abandoned successfully', () => {
  //   cy.request({
  //     method: REQ_METHOD.DELETE,
  //     url: '/v1/game/3',
  //     headers: {
  //       authorization: `"${token}"`,
  //     },
  //     failOnStatusCode: false,
  //   }).then((response) => {
  //     expect(response.status).to.eq(STATUS_CODE.OK);
  //     expect(response.body).to.have.property('success', true);
  //     expect(response.body).to.have.property('data');
  //     expect(response.body.data).to.have.property('message', PAYLOAD.GAME.ABANDONED);
  //   });
  // });

  it('given game has been either won or already been abandoned', () => {
    cy.request({
      method: REQ_METHOD.DELETE,
      url: '/v1/game/1',
      headers: {
        authorization: `"${token}"`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(STATUS_CODE.CONFLICT);
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('message', PAYLOAD.GAME.OVER);
      expect(response.body.data).to.have.property('stack');
    });
  });

  it('should return an error for invalid game id', () => {
    cy.request({
      method: REQ_METHOD.DELETE,
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
      expect(response.body.data).to.have.property('stack');
    });
  });

  it('should return an error for unauthorized access', () => {
    cy.request({
      method: REQ_METHOD.DELETE,
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
