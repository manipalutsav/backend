"use strict";

const express = require("express");
const router = express.Router();

const Participants = require("../controllers/participants");

// Returns the list of all participants
router.get("/", Participants.getAll);

module.exports = router;
