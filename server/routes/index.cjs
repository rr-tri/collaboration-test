const express = require("express");

const router = express.Router();

router.get("/", (_, res) => {
  res.send("API is running");
});

module.exports = router;
