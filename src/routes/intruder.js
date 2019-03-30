"use strict";

const express = require("express");
const router = express.Router();

const Intruder = require("../controllers/intruder");

router.get("/events", Intruder.getEvents);
router.get("/slots/:round", Intruder.getSlots);
router.get("/users", Intruder.getUsers);
// router.get("/result", Intruder.getResults);

module.exports = router;
