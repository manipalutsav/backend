"use strict";

const SlotModel = require("../models/Slot");

const getByRound = async (req, res, next) => {
  let slots = await SlotModel.find({
    round: req.params.round,
  });

  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
}

const getByTeam = async (req, res, next) => {
  let slots = await SlotModel.find({
    team: req.params.team,
  });

  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
}

const getForTeam = async (req, res, next) => {
  let slots = await SlotModel.find({
    round: req.params.round,
    team: req.params.team,
  });

  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
}
