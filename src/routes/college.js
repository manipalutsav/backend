"use strict";

const express = require("express");
const router = express.Router();

const { createCollege, getCollege } = require("../controllers/colleges");

router.post("/", createCollege);
router.get("/:id", getCollege);

module.exports = router;
