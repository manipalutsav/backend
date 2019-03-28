"use strict";

const TeamModel = require("../models/Team");

const getAll = async (req, res) => {
  try {
    let teams = await TeamModel.find();

    return res.json({
      status: 200,
      message: "Success",
      data: teams,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAll,
};
