// const express = require("express");
// const http = require("http");

const { server } = require("./app.cjs");
const initSocket = require("./utils/socket.cjs");
const { PORT } = require("./utils/config.cjs");
const logger = require("./utils/logger.cjs");

initSocket(server);

server.listen(PORT, () => {
  logger.info("Server is listening on http://localhost:3000");
});
