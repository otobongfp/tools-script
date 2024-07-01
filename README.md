# lto-tools-api

This is a simple rest api that queries data from the public chain into local jsonfiles that can be parsed by the dashboard app.

## Features

- Queries data from the chain to json files that can be served.
- Provides scripts that handles the testnet faucet

## Usage

- Get started using - [npm run start]
- app.js contains cron jobs that runs scripts in the scripts folder.
- The script folder contains scripts that runs queries and create data as needed.
- faucet.json should always have a default [] i.e empty square bracket. It clears out every 24hrs
