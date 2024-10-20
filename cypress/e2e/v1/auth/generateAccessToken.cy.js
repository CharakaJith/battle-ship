/* eslint-disable no-undef */
const { PAYLOAD, VALIDATE } = require('../../../../common/messages');
const { STATUS_CODE, REQ_METHOD } = require('../../../../constants/app.constant');

describe('Generate Access Token Route Test', () => {
  const email = Cypress.env('email');
  const password = Cypress.env('password');

  it('should generate an access token successfully', () => {
    cy.request({
      method: REQ_METHOD.POST,
      url: '/v1/auth',
      body: {
        email: email,
        password: password,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(STATUS_CODE.OK);
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('message', PAYLOAD.JWT.GENERATE.SUCCESS);
    });
  });

  it('should return an error for invalid email format', () => {
    cy.request({
      method: REQ_METHOD.POST,
      url: '/v1/auth',
      body: {
        email: 'johndoe@gmail',
        password: password,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(STATUS_CODE.BAD_REQUEST);
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('statusCode', STATUS_CODE.BAD_REQUEST);
      expect(response.body.data).to.have.property('message', VALIDATE.PARAM.INVALID('user email'));
      expect(response.body.data).to.have.property('stack').that.includes(VALIDATE.PARAM.INVALID('user email'));
    });
  });

  it('should return an error for not providing email', () => {
    cy.request({
      method: 'POST',
      url: '/v1/auth',
      body: {
        password: 'randompwd0911',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('statusCode', 400);
      expect(response.body.data).to.have.property('message', 'Field email is empty!');
      expect(response.body.data).to.have.property('stack').that.includes('Field email is empty!');
    });
  });

  it('should return an error for not providing password', () => {
    cy.request({
      method: 'POST',
      url: '/v1/auth',
      body: {
        email: 'charaka.info@gmail.com',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('statusCode', 400);
      expect(response.body.data).to.have.property('message', 'Field password is empty!');
      expect(response.body.data).to.have.property('stack').that.includes('Field password is empty!');
    });
  });

  it('should return an error for invalid credentials', () => {
    cy.request({
      method: 'POST',
      url: '/v1/auth',
      body: {
        email: 'a@gmail.com',
        password: 'randompwd',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('statusCode', 401);
      expect(response.body.data).to.have.property('message', 'Invalid email or password!');
      expect(response.body.data).to.have.property('stack').that.includes('Invalid email or password!');
    });
  });
});
