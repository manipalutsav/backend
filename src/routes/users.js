"use strict";

const express = require("express");
const router = express.Router();

// TODO: replace `noop` with actual controllers
const noop = require("../middlewares/noop");

// Returns the user for the given id
router.get("/:user", noop);

// Create a new user
router.post("/", noop);
// Register a user into the system
router.post("/register", noop);
// Authenticate a user into the system
router.post("/login", noop);

// Modify the requester's user details.
router.patch("/:user", noop);

module.exports = router;
