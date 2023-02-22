"use strict";

const express = require("express");
const router = express.Router();

const { addVolunteer, updateVolunteer, deleteVolunteer, getVolunteers, getVolunteer } = require("../controllers/coreVolunteer");

router.post("/", addVolunteer);
router.patch("/:volunteerId", updateVolunteer);
router.delete("/:volunteerId", deleteVolunteer);
router.get("/:volunteerId", getVolunteer);
router.get("/", getVolunteers);

module.exports = router;
