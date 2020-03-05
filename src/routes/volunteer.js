"use strict";

const express = require("express");
const router = express.Router();

const { create, getAll, getAllWithCollegeId, getAllFromCollege } = require("../controllers/volunteer");

router.post("/addVolunteer", create);

router.get("/", getAll);
router.get("/getAllWithCollegeId", getAllWithCollegeId);
router.get("/getAllFromCollege", getAllFromCollege);


module.exports = router;
