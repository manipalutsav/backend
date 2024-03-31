"use strict";

const express = require("express");
const router = express.Router();

const Colleges = require("../controllers/colleges");

// Returns all colleges
router.get("/", Colleges.getAll);
// Returns the list of participants from all colleges
router.get("/participants", Colleges.getParticipants);
// Returns the list of teams from all colleges
router.get("/teams", Colleges.getTeams);
// Returns the college for the given id
router.get("/:college", Colleges.get);
// Returns the list of participants from the given college
router.get("/:college/participants", Colleges.getParticipants);
// Returns the list of teams from the given college
router.get("/:college/teams", Colleges.getTeams);
//return ranking for all events
router.get("/:college/rankings", Colleges.getAllEventsRanking);
router.get("/:college/public-rankings", Colleges.getPublishedEventsRanking);


// Create a new college
router.post("/", Colleges.create);

router.patch("/", Colleges.update)

module.exports = router;
