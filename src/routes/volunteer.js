"use strict";

const express = require("express");
const router = express.Router();

const { addVolunteer, updateVolunteer, deleteVolunteer, getVolunteers, getVolunteer } = require("../controllers/volunteers");

router.post("/", addVolunteer);
router.patch("/:volunteerId", updateVolunteer);
router.get("/:volunteerId", getVolunteer);
router.get("/all/:type", getVolunteers);
router.delete("/:volunteerId", deleteVolunteer);

module.exports = router;
