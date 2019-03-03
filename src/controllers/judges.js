"use strict";

const JudgeModel = require("../models/Judge");

const get = async (req, res) => {
  let judges = await JudgeModel.find();

  judges = judges.map(judge => ({
    name: judge.name,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: judges,
  });
}

module.exports = {
  get,
}