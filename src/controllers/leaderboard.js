"use strict";

const LeaderboardModel = require("../models/Leaderboard");

const get = async (req, res, next) => {
  let leaderboard = await Leaderboard.find();

  return res.json({
    status: 200,
    message: "Success",
    data: leaderboard,
  });
}
