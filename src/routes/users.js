"use strict";

const express = require("express");
const router = express.Router();

const Users = require("../controllers/users");

// Returns all users
router.get("/", Users.getAll);
// Returns the user for the given id
router.get("/:user", Users.get);

// Create a new user
router.post("/", Users.create);
// Authenticate a user into the system
router.post("/login", Users.login);

// Modify the requester's user details.
router.patch("/:user", Users.update);
router.post("/:user", Users.updateUser);

module.exports = router;
