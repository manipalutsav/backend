"use strict";

const express = require("express");
const router = express.Router();

// TODO: replace `noop` with actual controllers
const noop = require("../middlewares/noop");
const Leaderboard = require("../controllers/leaderboard");

// Returns the leaderboard
router.get("/", Leaderboard.get);

// Create the leaderboard with initial scores
router.post("/", noop);

// Modify the leaderboard with updated scores
router.patch("/", noop);

module.exports = router;
