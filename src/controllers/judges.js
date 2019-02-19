"use strict";

const JudgeModel = require("../models/Judge");

/**
 * Registers new judge into the system.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
const register = async (req, res) => {
  let {
    name
  } = req.body;

  let judge = new JudgeModel({
    name: name,
  });

  judge.save((err) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
    res.status(200).json({
      status: 200,
      message: "New judge created",
      data: {
        id: judge._id,
        name: judge.name,
      }
    });
  });
}

/**
 * Get all judges.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
const get = async (req, res) => {
  let judges = await JudgeModel.find();
  if(!judges) {
    return res.status(404).json({
      status: 404,
      message : "No judge found",
    });
  };

  res.status(200).json({
    status: 200,
    message: "Found " + judges.length + " judges",
    data: judges
  });
} 

module.exports = {
  register,
  get
};