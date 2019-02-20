"use strict";

const express = require("express");
const router = express.Router();

const { getForTeam } = require("../controllers/slots");

router.get("/round/:round/team/:team", getForTeam);

module.exports = router;
