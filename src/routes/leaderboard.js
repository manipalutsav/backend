"use strict";

const express = require("express");
const router = express.Router();

const Leaderboard = require("../controllers/leaderboard");

// Returns the leaderboard
router.get("/", Leaderboard.get);

// Create the leaderboard with initial scores
router.post("/", Leaderboard.init);

// Modify the leaderboard with updated scores of the given college
router.patch("/:college", Leaderboard.update);

module.exports = router;
