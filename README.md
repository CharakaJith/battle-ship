<div align="center">
  <h2 ="center">battleship-api</h2>
</div>

## Overview

Battleship is a traditional strategy game where players aim to sink their opponent's fleet of ships. This repository contains a simple implementation of a one-sided Battleship game, allowing a human player to compete against a computer opponent on a 10x10 grid.
The API follows RESTful principles and provides endpoints for players to generate and refresh access tokens, start and abandon a game of battleship, inspect the game details with ships, and attack and attack any given grid.

## Features

- **Grip setup**: the game features a 10x10 grid where ships are randomly placed
- **Ship types**:
  - 1 battleship (5 squares)
  - 2 destroyers (4 squares each)
- **User input**: players can perform attacks by using a coordinate system (eg - "A5")
- **Feedback**: the game provides immediate feedback on each attack, indicating whether it is a hit or a miss. It also informs the player if any ships have been sunk and whether the game has been won.

## How to play

### Prerequisites

- node.js: [Node.js download page](https://nodejs.org/en/download)
- SQLite: [SQLite download page](https://www.sqlite.org/download.html)
- Docker: [Docker Desktop download page](https://docs.docker.com/desktop/install/windows-install/) (optional)

### Installation

1. Clone the repository
   ```bash
   https://github.com/CharakaJith/battle-ship.git
   ```
2. Step into project directory
   ```bash
   cd battle-ship
   ```
3. Install packages and libraries
   ```bash
   npm install
   ```
4. Create `.env` file
   ```bash
   touch .env
   ```
5. Add the following content to the `.env` file

   ```bash
   # environment variables
   NODE_ENV=development
   PORT=8000

   # initial user details
   USER_NAME=<name of the initial user>
   USER_EMAIL=<user email>
   USER_PASSWORD=<random password>

   # jwt secret
   ACCESS_TOKEN_SECRET=<random secure string>
   REFRESH_TOKEN_SECRET=<random secure string>
   ```

### Start the development server

    ```bash
    npm run dev
    ```

## Documentations

- [Postman API Documentation](https://documenter.getpostman.com/view/28014836/2sAXxWZUUV)

## Contact

Email: [charaka.info@gmail.com](mailto:charaka.info@gmail.com) | LinkedIn: [Charaka Jith Gunasinghe](https://www.linkedin.com/in/charaka-gunasinghe-6742861b9/)
