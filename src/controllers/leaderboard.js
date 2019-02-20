"use strict";

const LeaderboardModel = require("../models/Leaderboard");

const getAll = async (req, res, next) => {
  let leaderboard = await LeaderboardModel.find();

  return res.json({
    status: 200,
    message: "Success",
    data: leaderboard,
  });
}

module.exports = {
  getAll,
};
