const express = require("express");
const router = express.Router();

const PracticeSlot = require("../controllers/practiceSlot");

router.post("/", PracticeSlot.createPracticeSlot);
router.get("/", PracticeSlot.getPracticeSlots);
router.delete("/", PracticeSlot.deletePracticeSlots);

module.exports = router;