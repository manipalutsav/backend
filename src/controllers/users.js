"use strict";

const UserModel = require("../models/User");
const hash = require("../utils/hash");
const jwt = require("../utils/jwt");

/**
 * Registers new user into the system.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
const register = async (req, res) => {
  let {
    // eslint-disable-next-line no-unused-vars
    requestersId,
    name,
    email,
    type,
    password,
    college,
  } = req.body;

  //TODO Use requestersID for validating permission

  let user = await UserModel.findOne({ email: email });

  let hashPassword = await hash.generatePasswordHash(password);
  if (!user) {
    let payload = new UserModel({
      name: name,
      email: email,
      type: type,
      password: hashPassword,
      college: college,
    });

    payload.save((err) => {
      if (err) {
        res.status(400).json(err);
      }
      res.status(200).json({
        message: "New user created",
      });
    });
  } else {
    res.status(406).json({
      message: "User already exists",
    });
  }
};

/**
 * logins user into the system.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
const login = async(req, res) => {
  let {
    email,
    password,
  } = req.body;

  let user = await UserModel.findOne({ email: email });
  
  if(!user) {
    return res.status(404).json({
      message : "User not found",
    });
  }

  let isValid = await hash.comparePasswordHash(password, user.password);

  if(isValid) {
    const token = jwt.generateToken(user.email);

    res.cookie("token", token).status(200).json({
      message: "User authenticated",
    });
  } else {
    res.status(403).json({
      message: "User authentication failed",
    });
  }
};

module.exports = {
  register,
  login,
};
