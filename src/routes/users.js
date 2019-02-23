"use strict";

const express = require("express");
const router = express.Router();

// TODO: replace `noop` with actual controllers
const noop = require("../middlewares/noop");
const Users = require("../controllers/users");

// Returns the user for the given id
router.get("/:user", Users.get);

// Create a new user
router.post("/", noop);
// Register a user into the system
router.post("/register", noop);
// Authenticate a user into the system
router.post("/login", noop);

// Modify the requester's user details.
router.patch("/:user", noop);

module.exports = router;
