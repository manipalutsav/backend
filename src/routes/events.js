"use strict";

const express = require("express");
const router = express.Router();

// TODO: replace `noop` with actual controllers
const noop = require("../middlewares/noop");
const Events = require("../controllers/events");

// Returns the list of all events
router.get("/", Events.getAll);
// Returns the event for the given id
router.get("/:event", Events.get);
// Returns the leaderboard for the given event id
router.get("/:event/leaderboard", noop);
// Returns the list of rounds in the given event id
router.get("/:event/rounds", Events.getRounds);
// Returns the round for the given round id in the given event
router.get("/:event/rounds/:round", Events.getRound);
// Returns the slots for the given round in the given event
router.get("/:event/rounds/:round/slots", Events.getSlots);
// Returns the leaderboard for the given round in the given event
router.get("/:event/rounds/:round/leaderboard", noop);
// Returns the list of teams qualified for the given round in the given event
router.get("/:event/rounds/:round/teams", Events.getTeamsInRound);
// Returns the scores of given team in the given round in the given event
router.get("/:event/rounds/:round/teams/:team/scores", noop);
// Returns the list of teams participating in the given event
router.get("/:event/teams", Events.getTeams);
// Returns the team for the given team id participating in the given event
router.get("/:event/teams/:team", Events.getTeam);
// Returns the scores of given team in the given event
router.get("/:event/teams/:team/scores", noop);

// Create a new event
router.post("/", Events.create);
// Create a new round in the given event
router.post("/:event/rounds", Events.createRound);
// Create a new judge for round
router.post("/:event/rounds/:round/judge", Events.createJudge);
// Create slotting for the given round in the given event
router.post("/:event/rounds/:round/slots", Events.createSlots);
// Add scores for the given team for the given round in the given event
router.post("/:event/rounds/:round/teams/:team/scores", noop);
// Register a team to the given round
router.post("/:event/teams", noop);
// Add members (participants) to the given team
router.post("/:event/teams/:team/members", noop);

// Modify the given team's details for the given event
router.patch("/:event/teams/:team", noop);

module.exports = router;
