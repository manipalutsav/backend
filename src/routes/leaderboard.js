"use strict";

const express = require("express");
const router = express.Router();

const { getAll } = require("../controllers/leaderboard");

router.post("/", getAll)

module.exports = router;
