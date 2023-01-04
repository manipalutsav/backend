"use strict";

import express from "express";
const router = express.Router();

import { create } from "../controllers/Vol";

router.post("/add", create);

export default router;
