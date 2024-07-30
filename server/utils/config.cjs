require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV || "production";
const PORT = process.env.PORT || 3000;

module.exports = {
  NODE_ENV,
  PORT,
};
