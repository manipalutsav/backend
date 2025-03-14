"use strict";

const express = require("express");
const router = express.Router();

const Judges = require("../controllers/judges");

// Returns the list of all judges
router.get("/", Judges.getAll);
router.get("/:round", Judges.getForRound);

// Create a new judge
router.post("/", Judges.create);

/*The requester must be an admin to delete a judge. 
This is done by using the middleware requireAdmin*/
router.delete("/:id",  Judges.deleteJudgeById);

module.exports = router;
