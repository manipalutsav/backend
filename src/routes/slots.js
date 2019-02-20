"use strict";

const express = require("express");
const router = express.Router();

const { getByRound, getByTeam } = require("../controllers/slots");

router.get("/round/:round", getByRound);
router.get("/team/:team", getByTeam);

module.exports = router;
