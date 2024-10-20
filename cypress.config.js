const { defineConfig } = require('cypress');
require('dotenv').config();

const port = process.env.PORT;

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: `http://localhost:${port}/api/`,
    env: {
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      token: process.env.ACCESS_TOKEN,
      refreshToken: `refreshToken=${process.env.REFRESH_TOKEN}`,
    },
  },
});
