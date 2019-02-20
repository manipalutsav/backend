"use strict";

const express = require("express");
const router = express.Router();

const { createCollege, getCollege } = require("../controllers/college");

router.post("/", createCollege);
router.get("/:id", getCollege);

module.exports = router;
