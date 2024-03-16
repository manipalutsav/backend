"use strict";

const express = require("express");
const router = express.Router();

const Setting = require("../controllers/settings");

router.get("/", Setting.getAll);
router.get("/:setting/", Setting.get);
router.post("/", Setting.updateSettings);

module.exports = router;
