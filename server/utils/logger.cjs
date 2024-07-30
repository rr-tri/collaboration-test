const { NODE_ENV } = require("./config.cjs");

const info = (...params) => {
  if (NODE_ENV !== "production") {
    console.log(...params);
  }
};

const error = (...params) => {
  if (NODE_ENV !== "production") {
    console.error(...params);
  }
};

module.exports = {
  info,
  error,
};
