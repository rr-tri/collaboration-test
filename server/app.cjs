const express = require("express");
const http = require("http");
const path = require("path");

const router = require("./routes/index.cjs");
const { errorHandler, unknownEndpoint } = require("./utils/middleware.cjs");

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.use("/api/v1", router);

const DIST_PATH = path.resolve(__dirname, "../dist");
const INDEX_PATH = path.resolve(DIST_PATH, "index.html");
app.use(express.static(DIST_PATH));
app.get("*", (req, res) => res.sendFile(INDEX_PATH));

app.use(errorHandler);
app.use(unknownEndpoint);

module.exports = {
  app,
  server,
};
