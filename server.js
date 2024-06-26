require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

async function startServer() {
  server.listen(PORT, () => {
    console.log("Connected to Database");
  });
}

startServer();
