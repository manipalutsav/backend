"use strict";

import express from "express";
const router = express.Router();

import Stats from "../controllers/stats";

// Returns some stats
router.get("/", Stats.get);

export default router;
