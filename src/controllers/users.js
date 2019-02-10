"use strict";

const userModel = require("../models/users");
const hash = require("../utils/hash");

/**
 * register new user
 * @param {requestersId, name, email, contact, type, password, collegeId, teams} req
 * @param {status} res
 */
const register = async (req, res) => {
  let {
    requestersId,
    name,
    email,
    contact,
    type,
    password,
    collegeId,
    regNo,
    teams,
  } = req.body;

  let user = await userModel.find({ email: email });
  let hashPassword = await hash.generatePasswordHash(password);
  if (!user.length) {
    let payload = new userModel({
      name: name,
      email: email,
      contact: contact,
      type: type,
      password: hashPassword,
      collegeId: collegeId,
      regNo: regNo,
      teams: teams,
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

module.exports = {
  register,
};
