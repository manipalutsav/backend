"use strict";

const express = require("express");
const router = express.Router();

const ParticipationStatus = require("../controllers/participationStatus");

// Returns the list of all teams
router.post("/", ParticipationStatus.create);
router.get("/", ParticipationStatus.get);
router.get("/event/:event", ParticipationStatus.getByEvent);
router.get("/college/:college", ParticipationStatus.getByCollege);

module.exports = router;
