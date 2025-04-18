"use strict";

const express = require("express");
const router = express.Router();

const Teams = require("../controllers/teams");
const upload = require("../middlewares/winnerForm");

// Returns the list of all teams
router.get("/", Teams.getAll);
router.get("/:collegeId/:eventId", Teams.getTeamByCollegeIdAndEventId);
router.post("/submitWinnerForm", upload.any() ,Teams.submitWinners);


module.exports = router;
