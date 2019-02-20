"use strict";

const express = require("express");
const router = express.Router();

const { getAll } = require("../controllers/leaderboard");

router.get("/", getAll)

module.exports = router;
