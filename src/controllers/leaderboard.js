"use strict";

const LeaderboardModel = require("../models/Leaderboard");
const CollegeModel = require("../models/College");
const RoundModel = require("../models/Round");
const EventModel = require("../models/Event");
const ScoreModel = require("../models/Score");
const TeamModel = require("../models/Team");
const Slot2Model = require("../models/Slot2");
const JudgeScoreModel = require("../models/JudgeScore");


//same code as getOvertimeMinusPoints on events
const getOvertimeMinusPoints = (overtime = 0) => {
  return overtime > 0 ? 5 * (Math.ceil(overtime / 15)) : 0;
}
//same code as getRoundLeaderboard2 without req,res
const getRoundLeaderboard = async (roundId) => {
  let round = await RoundModel.findById(roundId);

  if (!round) {
    throw "Round does not exist to get leaderboard";
  }

  let scores = await JudgeScoreModel.find({
    round: round._id
  })

  //fetch slots for the round
  let slots = await Slot2Model.find({
    round: round._id
  }).populate('college');

  //get all slot ids from scores
  let slotIds = new Set();

  //Add up points by judges
  scores.forEach(score => {
    score.total = score.points.reduce((p1, p2) => p1 + p2);
    slotIds.add(score.slot);
  })
  //add up totals for each slot
  let leaderboard = [];
  Array.from(slotIds)
    .map(slotId => slots.find(slot => String(slot._id) == slotId))//add slot details
    .filter(slot => !slot.disqualified)//filter out disqualified teams
    .forEach(slot => {
      let total = scores.filter(score => score.slot == String(slot._id)).reduce((total, score) => total + score.total, 0);
      let bias = getOvertimeMinusPoints(slot.overtime)
      total = total - bias;
      if (!leaderboard.find(leaderboardItem => leaderboardItem.slot._id == slot._id))
        leaderboard.push({ slot: slot, total })
    })

  //sort leaderboard
  leaderboard.sort((p1, p2) => p2.total - p1.total);

  //remove duplicates (keep only one entry per slot)

  //Add Rank
  let scoreOrder = Array.from(new Set(leaderboard.map(item => item.total)));
  leaderboard.forEach(item => {
    item.rank = scoreOrder.indexOf(item.total) + 1;
  })
  return leaderboard;
}
// Colleges and results to be removed
const remove_college_list = [{name:"Cultural Coordination Committee", location:"Manipal"}, {name:"Kasturba Hospital", location:"Manipal"}, {name:"MAHE", location:"Manipal"}];
const remove_event_list = ["Staff Cooking: Vegetarian", "Staff Cooking: Non-Vegetarian", "Staff Cooking: Dessert", "Staff Vegetable & Fruit Carving", "Staff Variety Entertainment", "Poetry (Kannada)"];
const get2 = async (req, res) => {
  try {
    let events = await EventModel.find({ $and:[ { faculty: false }, { "name": { "$nin": remove_event_list } } ]  });
    let colleges = (await CollegeModel.find({ $or: [ { "name": { "$nin": remove_college_list.map(c => c.name) } }, { "location": { "$nin": remove_college_list.map(c => c.location) } } ] }));
    let board = [];
    colleges.forEach(college => {
      college = college.toObject();
      college.points = 0;
      board.push(college);
    })
    // console.log({ board })

    const POINTS = {
      GROUP: [14, 10, 8],
      INDIVIDUAL: [10, 8, 6]
    }

    //get the latest leaderboard of all events
    await Promise.all(events.map(async event => {
      //if event doesn't have any rounds, move to next event.
      if (event.rounds.length == 0)
        return;
      //get last round id
      let roundId = event.rounds[event.rounds.length - 1];
      let leaderboard = await getRoundLeaderboard(roundId);
      leaderboard.forEach(item => {

        let point = POINTS[event.maxMembersPerTeam == 1 ? "INDIVIDUAL" : "GROUP"][item.rank - 1];
        if (point) {
          let college = board.find(college => {
            return String(college._id) == String(item.slot.college._id)
          });
          college.points += Number(point);
        }
      })
    }))

    board.sort((c1, c2) => c2.points - c1.points)

    console.log(board)

    let ranks = Array.from(new Set(board.map(college => college.points)));
    console.log({ ranks })
    board.forEach(college => {
      college.rank = ranks.findIndex(point => point === college.points) + 1;
    });


    return res.json({
      status: 200,
      message: "Success",
      data: board,
    });
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      status: 500,
      message: e.message,
    });
  }

}

const get = async (req, res) => {
  let events = await EventModel.find({ faculty: false });

  let disqulifiedTeams = await TeamModel.find({ disqualified: true });
  disqulifiedTeams = disqulifiedTeams.map(team => team._id.toString());

  let overallLeaderboard = [];
  for (let event of events) {
    let scores = await ScoreModel.find({
      round: { $in: event.rounds },
    });

    scores = scores.filter(score => !disqulifiedTeams.includes(score.team.toString()));


    scores = scores.map(score => ({
      team: score.team,
      points: score.points - (score.overtime > 0 ? 5 * (Math.ceil(score.overtime / 15)) : 0),
    }));

    //add up points from all judges for each team
    let mappedScores = scores.reduce((acc, curr) => {
      let points = acc.get(curr.team) || 0;
      acc.set(curr.team, curr.points + points);
      return acc;
    }, new Map());


    //convert to object with {team,points} mapping
    let leaderboard = [...mappedScores].map(([team, points]) => ({ team, points, event }));

    //sort points highest to lowest
    leaderboard = leaderboard.sort((a, b) => parseFloat(b.points) - parseFloat(a.points));

    //add rank
    leaderboard = leaderboard.map(lb => ({
      ...lb,
      rank: Array.from(new Set(leaderboard.map(team => team.points))).indexOf(lb.points) + 1,
    }));

    //get only top 3 ranked teams
    leaderboard = leaderboard.filter(lb => [1, 2, 3].includes(lb.rank));

    //add the event leaderboard to overall leaderboard
    overallLeaderboard = overallLeaderboard.concat(leaderboard);
  }

  console.log(overallLeaderboard);


  let finalLeaderboard = {};


  for (let score of overallLeaderboard) {

    //get the slot using it's id on score schema
    let slot = await Slot2Model.findOne(score.team);
    let team;
    if (slot.college == null) {
      console.log("SLOT COLLEGE MISSING")
      let start = slot.teamName.lastIndexOf("(") + 1;
      let end = slot.teamName.lastIndexOf(")");
      if (start > 0) {

        let comma = slot.teamName.lastIndexOf(",");
        let collegeName = slot.teamName.substring(0, comma).trim();;
        let location = slot.teamName.substring(comma + 1, start - 1).trim();
        let teamName = slot.teamName.substring(start, end);
        const college = await CollegeModel.findOne({ name: collegeName, location, event: score.event._id });
        if (!college) {
          console.error("College not found", slot);
          continue;
        }


        team = await TeamModel.findOne({ name: teamName, college: college._id, event: score.event._id }).populate("event");
        console.log({ teamName, college, type: 1, team })
      }
      else {
        console.error("No way to find team", slot);
        continue;
      }
    }
    else {

      team = await TeamModel.findOne({ name: slot.teamName, college: slot.college, event: score.event._id }).populate("event");
      console.log({ teamName: slot.teamName, college: slot.college, type: 2, team })
    }

    if (!team) {
      console.error("Team not found", slot);
      continue;
    }

    if (team.disqualified) continue;

    if (finalLeaderboard.hasOwnProperty(team.college)) {
      if (team.event.maxMembersPerTeam === 1) {
        // For individual events
        finalLeaderboard[team.college] += score.rank === 1 ? 10 : score.rank === 2 ? 8 : 6;
      } else {
        // For group events
        finalLeaderboard[team.college] += score.rank === 1 ? 14 : score.rank === 2 ? 10 : 8;
      }
    } else {
      if (team.event.maxMembersPerTeam === 1) {
        // For individual events
        finalLeaderboard[team.college] = score.rank === 1 ? 10 : score.rank === 2 ? 8 : 6;
      } else {
        // For group events
        finalLeaderboard[team.college] = score.rank === 1 ? 14 : score.rank === 2 ? 10 : 8;
      }
    }
  }

  let leaderboard = [];
  for (let college of Object.keys(finalLeaderboard)) {
    let collegeDoc = await CollegeModel.findById(college);

    leaderboard.push({
      college: collegeDoc,
      points: finalLeaderboard[college],
    });
  }

  return res.json({
    status: 200,
    message: "Success",
    data: leaderboard,
  });
};

/**
 * Returns the leaderboard
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const getPublic = async (req, res) => {
  try {
    let leaderboard = await LeaderboardModel.find().populate({
      path: "college",
      model: "College",
    });

    leaderboard = leaderboard.map(lb => ({
      college: lb.college,
      points: lb.points,
    }));

    return res.json({
      status: 200,
      message: "Success",
      data: leaderboard,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const getWinners = async (req, res) => {
  let events = await EventModel.find({ faculty: false });

  let disqulifiedTeams = await TeamModel.find({ disqualified: true });
  disqulifiedTeams = disqulifiedTeams.map(team => team._id.toString());

  let overallLeaderboard = [];
  for (let event of events) {
    let scores = await ScoreModel.find({
      round: { $in: event.rounds },
    });

    scores = scores.filter(score => !disqulifiedTeams.includes(score.team.toString()));


    scores = scores.map(score => ({
      team: score.team,
      points: score.points - (score.overtime > 0 ? 5 * (Math.ceil(score.overtime / 15)) : 0),
    }));

    //add up points from all judges for each team
    let mappedScores = scores.reduce((acc, curr) => {
      let points = acc.get(curr.team) || 0;
      acc.set(curr.team, curr.points + points);
      return acc;
    }, new Map());


    //convert to object with {team,points} mapping
    let leaderboard = [...mappedScores].map(([team, points]) => ({ team, points }));

    //sort points highest to lowest
    leaderboard = leaderboard.sort((a, b) => parseFloat(b.points) - parseFloat(a.points));

    //add rank
    leaderboard = leaderboard.map(lb => ({
      ...lb,
      rank: Array.from(new Set(leaderboard.map(team => team.points))).indexOf(lb.points) + 1,
    }));

    //get only top 3 ranked teams
    leaderboard = leaderboard.filter(lb => [1, 2, 3].includes(lb.rank));

    //add the event leaderboard to overall leaderboard
    overallLeaderboard = overallLeaderboard.concat(leaderboard);
  }




  for (let score of overallLeaderboard) {

    //get the slot using it's id on score schema
    let slot = await Slot2Model.findOne(score.team);
    let team;
    if (slot.college == null) {
      console.log("SLOT COLLEGE MISSING")
      let start = slot.teamName.lastIndexOf("(") + 1;
      let end = slot.teamName.lastIndexOf(")");
      if (start > 0) {

        let comma = slot.teamName.lastIndexOf(",");
        let collegeName = slot.teamName.substring(0, comma).trim();;
        let location = slot.teamName.substring(comma + 1, start - 1).trim();
        let teamName = slot.teamName.substring(start, end);
        const college = await CollegeModel.findOne({ name: collegeName, location });
        if (!college) {
          console.error("College not found", slot);
          continue;
        }

        team = await TeamModel.findOne({ name: teamName, college: college._id }).populate("event").populate("members").populate("college")
        console.log({ teamName, college, type: 1, team })
      }
      else {
        console.error("No way to find team", slot);
        continue;
      }
    }
    else {
      team = await TeamModel.findOne({ name: slot.teamName, college: slot.college }).populate("event").populate("members").populate("college")
      console.log({ teamName: slot.teamName, college: slot.college, type: 2, team })
    }

    if (!team) {
      console.error("Team not found", slot);
      continue;
    }

    if (team.disqualified) continue;

    score.team = team;

  }

  return res.json({
    status: 200,
    message: "Success",
    data: overallLeaderboard,
  });
};

/**
 * Create the leaderboard with initial scores
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const init = async (req, res) => {
  try {
    let colleges = await CollegeModel.find();

    colleges = colleges.map(college => college.id);

    let leaderboard = colleges.map(college => ({
      college: college,
      points: 0,
    }));

    await LeaderboardModel.create(leaderboard);

    return res.json({
      status: 200,
      message: "Success",
      data: leaderboard,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

/**
 * Modify the leaderboard with updated scores
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const update = async (req, res) => {
  try {
    if (!req.body.points) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Invalid request body.",
      });
    }

    let collegeLeaderboard = await LeaderboardModel.findOne({ college: req.params.college });

    collegeLeaderboard.points = req.body.points;

    await collegeLeaderboard.save();

    return res.json({
      status: 200,
      message: "Success. Points updated.",
      data: {
        college: collegeLeaderboard.college,
        points: collegeLeaderboard.points,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const publish = async (req, res) => {
  try {
    if (!req.body.length) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Invalid request body.",
      });
    }

    await LeaderboardModel.remove();
    let leaderboard = await LeaderboardModel.create(req.body);

    return res.json({
      status: 200,
      message: "Success. Leaderboard published.",
      data: leaderboard,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};


const getLeaderBoard = async (req, res) => {
  const remove_college_list = [{ name: "Cultural Coordination Committee", location: "Manipal" }, { name: "Kasturba Hospital", location: "Manipal" }, { name: "MAHE", location: "Manipal" }];

  try {
    let events = await EventModel.find({ faculty: false }).sort({ startDate: 1 });
    events = events.filter((ev) => ev.name !== "Staff Variety Entertainment" && ev.name !== "Poetry (Kannada)");

    let colleges = await CollegeModel.find().sort({ name: 1 });
    colleges = colleges.filter((college) => { // Filter out the colleges that shouldn't be in the leaderboard
      return (remove_college_list.find(r_college => r_college.name == college.name && r_college.location == college.location) == undefined);
    })
    let set = [];

    for (let i = 0; i < events.length; i++) {
      let event = events[i];

      if (event.rounds.length == 0) continue;
      let round = await RoundModel.find({ event: event._id, _id: event.rounds[0], published: true });
      if (round.length == 0) continue;
      console.log(round);
      let scores = await JudgeScoreModel.find({ round: round[0]._id });
      let slots = await Slot2Model.find({
        round: round[0]._id
      }).populate('college');

      let slotIds = new Set();

      scores.forEach(score => {
        score.total = score.points.reduce((p1, p2) => p1 + p2);
        slotIds.add(score.slot);
      })


      let leaderboard = [];
      Array.from(slotIds)
        .map(slotId => slots.find(slot => String(slot._id) == slotId))
        .filter(slot => !slot.disqualified)//filter out disqualified teams
        .forEach(slot => {
          let total = scores.filter(score => score.slot == String(slot._id)).reduce((total, score) => total + score.total, 0);
          let bias = getOvertimeMinusPoints(slot.overtime)
          total = total - bias;
          if (!leaderboard.find(leaderboardItem => leaderboardItem.slot._id == slot._id))
            leaderboard.push({ slot: slot, total })
        })


      leaderboard.sort((p1, p2) => p2.total - p1.total);

      let scoreOrder = Array.from(new Set(leaderboard.map(item => item.total)));
      leaderboard.forEach(item => {
        item.rank = scoreOrder.indexOf(item.total) + 1;
      })

      leaderboard.forEach(item => {
        // #TODO, two teams of same college winning in one event.
        if (item.rank <= 3) {
          set.push({
            college: item.slot.college,
            event: event.id,
            rank: item.rank
          });
        }
      });

    }


    res.status(200).json({
      status: 200,
      message: "Success",
      data: set,
    });

  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
}

module.exports = {
  get,
  get2,
  getPublic,
  getWinners,
  init,
  publish,
  update,
  getRoundLeaderboard,
  getLeaderBoard
};
