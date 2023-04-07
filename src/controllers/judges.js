"use strict";

const JudgeModel = require("../models/Judge");
const { USER_TYPES } = require("../utils/constants");

const getAll = async (req, res) => {
  try {
    let judges = await JudgeModel.find();

    judges = judges.map(judge => ({
      id: judge.id,
      name: judge.name,
      rounds: judge.rounds,
    }));

    return res.json({
      status: 200,
      message: "Success",
      data: judges,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const getForRound = async (req, res) => {
  try {
    let judges = await JudgeModel.find({ rounds: req.params.round });

    judges = judges.map(judge => ({
      id: judge.id,
      name: judge.name,
      rounds: judge.rounds,
    }));

    return res.json({
      status: 200,
      message: "Success",
      data: judges,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const create = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request",
      });
    }

    let judge = await JudgeModel.findOne({ name: req.body.name });

    if (judge) {
      if (req.body.round) {
        judge.rounds.push(req.body.round);
        await judge.save();
      }
    } else {
      judge = await JudgeModel.create({
        name: req.body.name,
        rounds: req.body.round ? [req.body.round] : [],
      });
    }

    return res.json({
      status: 200,
      message: "Success",
      data: {
        id: judge.id,
        name: judge.name,
        rounds: judge.rounds,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const deleteOne = async (req, res) => {
  try {
    if((req.user.type !== USER_TYPES.ADMINISTRATOR)){
      return res.status(403).json({
        status: 403,
        message: "Only admins can delete judges!",
      });
    }

    const judge_id = req.params.judge;
    if (!judge_id) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request",
      });
    }

    let judge = await JudgeModel.findById(judge_id);

    if (judge) {

      if(judge.rounds && judge.rounds.length > 0){
        return res.status(400).json({
          status:400,
          message: "Can not delete judges who have judged atleast one round!",
        });
      }

      await JudgeModel.findByIdAndDelete(judge_id);
      let judges = await JudgeModel.find();

      judges = judges.map(judge => ({
        id: judge.id,
        name: judge.name,
        rounds: judge.rounds,
      }));

      return res.status(200).json({
        status: 200,
        message: "Success",
        data: judges,
      });

    }
    // eslint-disable-next-line no-else-return
    else{
      return res.status(400).json({
        status:400,
        message: "Bad request! No judge found with this id"
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAll,
  getForRound,
  create,
  deleteOne,
};
