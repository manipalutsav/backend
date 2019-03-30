"use strict";

const ParticipantModel = require("../models/Participant");

const getAll = async (req, res) => {
  try {
    let participants = await ParticipantModel.find();

    return res.json({
      status: 200,
      message: "Success",
      data: participants,
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
