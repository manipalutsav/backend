"use strict";

const express = require("express");
const router = express.Router();

// TODO: replace `noop` with actual controllers
const Events = require("../controllers/events");

// Returns the list of all events
router.get("/", Events.getAll);
// Returns the event for the given id
router.get("/:event", Events.get);
// Returns the leaderboard for the given event id
// TODO: Get this shit together
router.get("/:event/leaderboard", Events.getLeaderboard);
// Returns the list of rounds in the given event id
router.get("/:event/rounds", Events.getRounds);
// Returns the round for the given round id in the given event
router.get("/:event/rounds/:round", Events.getRound);
// Returns the slots for the given round in the given event
router.get("/:event/rounds/:round/slots", Events.getSlots);
router.get("/:event/rounds/:round/slots2", Events.getSlots2);
router.get("/:event/rounds/:round/slots2/delete", Events.deleteSlots2);
// Returns the leaderboard for the given round in the given event
router.get("/:event/rounds/:round/leaderboard", Events.getRoundLeaderboard);
// Returns the list of teams qualified for the given round in the given event
router.get("/:event/rounds/:round/teams", Events.getTeamsInRound);
// Returns the scores of given team in the given round in the given event
// router.get("/:event/rounds/:round/teams/:team/scores", noop);
// Returns the list of teams participating in the given event
router.get("/:event/teams", Events.getTeams);
// Returns the team for the given team id participating in the given event
router.get("/:event/teams/:team", Events.getTeam);
// Returns the scores of given team in the given event
// router.get("/:event/teams/:team/scores", noop);

// Create a new event
router.post("/", Events.create);
// Create a new round in the given event
router.post("/:event/edit", Events.edit);
router.post("/:event/rounds", Events.createRound);
router.post("/:event/rounds/:round", Events.updateRound);
// Create a new judge for round
// router.post("/:event/rounds/:round/judge", Events.createJudge);

// TODO: Finalize the round scores and move teams to next round.
// router.post("/:event/rounds/:round/finalize", Events.finalizeRound);
// Add scores for the given team for the given round in the given event
router.post("/:event/rounds/:round/teams/:team/scores", Events.createScore);
// Add scores for the teams in the given round in the given event
router.post("/:event/rounds/:round/slots", Events.createSlots);
router.post("/:event/rounds/:round/slots2", Events.createSlots2);

router.post("/:event/rounds/:round/scores", Events.createScores);

// Register a team to the given event
router.post("/:event/teams", Events.createTeam);
// Add members (participants) to the given team
// router.post("/:event/teams/:team/members", noop);

// Modify the given team's details for the given event
// router.patch("/:event/teams/:team", noop);
// Publish round leaderboard
router.patch("/:event/rounds/:round/leaderboard", Events.publishRoundLeaderboard);
// Update team scores (overtime, disqualification)
router.patch("/:event/rounds/:round/scores", Events.updateTeamScores);

// Deletes the specified team from the given event
router.delete("/:event/teams/:team", Events.deleteTeam);
// Deletes the specified round from the given event
router.delete("/:event/rounds/:round", Events.deleteRound);

module.exports = router;
