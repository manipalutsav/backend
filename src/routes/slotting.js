const express = require("express");
const router = express.Router();

const Slotting = require("../controllers/slotting");

// Returns the list of all teams
router.post("/getRegisteredEvents", Slotting.getEventsName);
router.post("/generateSlots", Slotting.slotCollegeById);
module.exports = router;