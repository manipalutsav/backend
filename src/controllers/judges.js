"use strict";

const JudgeModel = require("../models/Judge");

const get = async (req, res) => {
  let judges = await JudgeModel.find();

  judges = judges.map(judge => ({
    id: judge.id,
    name: judge.name,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: judges,
  });
};

const create = async (req, res) => {
  let { name, round } = req.body;
  let judge = await JudgeModel.create({
    name,
    rounds: [ round ],
  });
  return res.json({
    status: 200,
    message: "Succes",
    data: judge,
  });
};

module.exports = {
  get,
  create,
};
