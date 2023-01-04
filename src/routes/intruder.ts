"use strict";

import express from "express";
const router = express.Router();

import Intruder from "../controllers/intruder";

router.get("/events", Intruder.getEvents);
router.get("/slots/:round", Intruder.getSlots);
router.get("/users", Intruder.getUsers);
router.get("/events/:event/leaderboard", Intruder.getEventLeaderboard);
router.get("/events/:event/rounds/:round/leaderboard", Intruder.getRoundLeaderboard);
// router.get("/result", Intruder.getResults);

export default router;
