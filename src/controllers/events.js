"use strict";

const EventModel = require("../models/Event");
const CollegeModel = require("../models/College");
const RoundModel = require("../models/Round");
const ScoreModel = require("../models/Score");
const ScoreBackupModel = require("../models/ScoreBackup");
const JudgeScoreModel = require("../models/JudgeScore")
const JudgeModel = require("../models/Judge")
const SlotModel = require("../models/Slot");
const Slot2Model = require("../models/Slot2");
const TeamModel = require("../models/Team");
const ParticipantModel = require("../models/Participant");
const { ROUND_STATUS, USER_TYPES } = require("../utils/constants");
const leaderboard = require("./leaderboard")

const deleteTeam = async (req, res) => {
  try {
    let team = await TeamModel.findOne({
      _id: req.params.team,
      event: req.params.event,
    });

    if (!team) {
      return res.status(404).json({
        status: 400,
        message: "Not Found. Team doesn't exist.",
      });
    }

    // Checking whether the event has already been slotted
    let rounds = await RoundModel.find({ event: req.params.event });
    rounds = (rounds.map((r) => r._id));
    let slots = await Slot2Model.find({ round: { $in: rounds } });
    if (slots.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Can not delete team, slotting already done",
      });
    }

    let members = team.members;

    for (let member of members) {
      await ParticipantModel.findByIdAndDelete(member);
    }

    await TeamModel.findByIdAndDelete(team.id);

    return res.json({
      status: 200,
      message: "Success. Deleted team.",
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const updateTeam = async (req, res) => {
  try {
    let team = await TeamModel.findOne({
      _id: req.params.team,
      event: req.params.event,
    });

    if (!team) {
      return res.status(404).json({
        status: 400,
        message: "Not Found. Team doesn't exist.",
      });
    }

    let event = await EventModel.findById(req.params.event);
    let {
      participants,
    } = req.body;

    // Check whether there is room to add new participants
    if (team.members.length >= event.maxMembersPerTeam) {
      return res.json({
        status: 400,
        message: "Max. participants registered!",
      });
    }

    // Check whether the no. of participants provided is within the max participants
    if (team.members.length + participants.length > event.maxMembersPerTeam) {
      return res.json({
        status: 416,
        message: "Number of particpants exceeds max particpants for event",
      });
    }


    addBulkParticipants(participants, team.college).
      then(async newMembers => {
        team.members.push(...newMembers);

        await team.save(async (err) => {
          if (err) {
            return res.json({
              status: 500,
              message: "Internal Server Error",
            });
          }


          // Add team to round 1
          // TODO: Check if round exists in event
          // TODO: Check if this is really needed, if not, can remove this code.
          // let round1 = await RoundModel.findById(eventInfo.rounds[0]);
          // round1.teams.push(team.id);
          // await round1.save();

          return res.json({
            status: 200,
            message: "Team updated",
            data: team,
          });
        });
      });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const createTeam = async (req, res) => {
  let {
    college,
    participants,
  } = req.body;

  let { event } = req.params;

  // Check if participation limit reached
  let participatedTeams = await TeamModel.find({ college: college, event: event });
  let collegeDoc = await CollegeModel.findById(college);
  let eventInfo = await EventModel.findById(event);

  if (participatedTeams.length === eventInfo.maxTeamsPerCollege) {
    return res.json({
      status: 416,
      message: "Max participation limit reached for college",
    });
  }


  if (participants.length > eventInfo.maxMembersPerTeam) {
    return res.json({
      status: 416,
      message: "Number of particpants exceeds max particpants for event",
    });
  }

  let researchScholars = participants.filter(participant => participant.registrationID.match(/MAHER|[\d]{9}/i));
  if (researchScholars.length > 7 && eventInfo.name.match(/variety/i)) {
    return res.json({
      status: 416,
      message: "Cannot have more than 7 research scholars for the event",
    });
  }

  let index = participatedTeams.length;
  let name = "Team " + Number(index + 10).toString(36).toUpperCase();



  addBulkParticipants(participants, college).
    then(async members => {
      let team = new TeamModel({
        event,
        college,
        members,
        name,
        index
      });

      await team.save(async (err) => {
        if (err) {
          return res.json({
            status: 500,
            message: "Internal Server Error",
          });
        }

        // Add team to round 1
        // TODO: Check if round exists in event
        //TODO: Check if this is really needed, if not, can remove this code.
        // let round1 = await RoundModel.findById(eventInfo.rounds[0]);
        // round1.teams.push(team.id);
        // await round1.save();

        return res.json({
          status: 200,
          message: "Team Created",
          data: team,
        });
      });
    }).
    catch(e => {
      // eslint-disable-next-line no-console
      console.poo(e);

      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    });
};

const createRound = async (req, res, next) => {
  let event = await EventModel.findById(req.params.event);

  if (!event) next();

  let roundDocument = new RoundModel({
    event: event.id,
    teams: [],
    criteria: req.body.criteria,
    slotType: req.body.slotType,
    slotOrder: req.body.slotOrder,
    qualifier: req.body.qualifier,
    status: ROUND_STATUS.SCHEDULED,
  });

  await roundDocument.save().
    then(async round => {
      event.rounds.push(round.id);
      await event.save();

      return res.json({
        status: 200,
        message: "New round created",
        data: {
          id: round.id,
          event: req.params.event,
          teams: [],
          criteria: round.criteria,
          slottable: round.slottable,
        },
      });
    }).
    catch((e) => {
      // eslint-disable-next-line no-console
      console.poo(e);

      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    });
};

const updateRound = async (req, res, next) => {
  let event = await EventModel.findById(req.params.event);

  if (!event) next();

  let roundDocument = await RoundModel.findById(req.params.round);
  roundDocument.criteria = req.body.criteria;
  roundDocument.slottable = req.body.slottable;
  roundDocument.slotType = req.body.slotType;
  roundDocument.slotOrder = req.body.slotOrder;
  roundDocument.qualifier = req.body.qualifier;


  await roundDocument.save().
    then(async round => {
      // event.rounds.push(round.id);
      // await event.save();

      return res.json({
        status: 200,
        message: "Round updated",
        data: {
          id: round.id,
          event: req.params.event,
          teams: [],
          criteria: round.criteria,
          slotOrder: round.slotOrder,
          slotType: round.slotType
        },
      });
    }).
    catch((e) => {
      // eslint-disable-next-line no-console
      console.poo(e);

      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    });
};

const deleteRound = async (req, res, next) => {
  try {
    let event = await EventModel.findById(req.params.event);

    if (!event) return next();

    // TODO: If round doesn't exist in the event
    // This doesn't work. Why??
    // if (!event.rounds.includes(req.params.round)) return next();

    // Delete round
    let round = await RoundModel.findByIdAndDelete(req.params.round);

    // Remove reference to round from the event.
    event.rounds.splice(event.rounds.indexOf(req.params.round), 1);

    await event.save();

    return res.json({
      status: 200,
      message: "Success. Round deleted.",
      data: round,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.poo(e);

    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const createScore = async (req, res, next) => {
  let round = await RoundModel.findOne({
    _id: req.params.round,
    event: req.params.event,
  });

  if (!round) next();

  if (!round.teams.includes(req.params.team)) next();

  let score = await ScoreModel.findOne({
    team: req.params.event,
    round: req.params.round,
  });

  if (score) {
    score.judges.concat(req.body.judges);
    await score.save();
  } else {
    score = await ScoreModel.create({
      team: req.params.team,
      round: req.params.round,
      judges: req.body.judges,
    });
  }

  return res.json({
    status: 200,
    message: "Success",
    data: score,
  });
};


const makeBackup = async (req, res, next) => {
  let round = await RoundModel.findById(req.params.round);
  if (!round) {
    return res.status(404).json({
      status: 404,
      message: "Round does not exist.",
    });
  }

  let judge = await JudgeModel.findById(req.params.judge);
  if (!judge) {
    return res.status(404).json({
      status: 404,
      message: "Judge Does not exist",
    });
  }

  let { time, ua, data } = req.body;


  let oldScores = await JudgeScoreModel.find({
    round: req.params.round,
    judge: req.params.judge
  });

  if (oldScores.length > 0) {
    return res.status(400).json({
      status: 404,
      message: "Judge has already submitted the scores for this round. Cannot create backup.",
    });
  }

  let record = { ...time, ua, data, round, judge }

  let response = await ScoreBackupModel.findOneAndUpdate({
    round: req.params.round,
    judge: req.params.judge
  }, record, { upsert: true })

  return res.status(200).json({
    status: 200,
    message: "Success",
    response
  });
};

const getBackup = async (req, res, next) => {
  let round = await RoundModel.findById(req.params.round);
  if (!round) {
    return res.status(404).json({
      status: 404,
      message: "Round does not exist.",
    });
  }

  let judge = await JudgeModel.findById(req.params.judge);
  if (!judge) {
    return res.status(404).json({
      status: 404,
      message: "Judge Does not exist",
    });
  }

  let response = await ScoreBackupModel.findOne({
    round: req.params.round,
    judge: req.params.judge
  })

  return res.status(200).json({
    status: 200,
    message: "Success",
    data: response
  });
};

const deleteBackup = async (req, res, next) => {

  let response = await ScoreBackupModel.findOneAndDelete({
    round: req.params.round,
    judge: req.params.judge
  })

  return res.status(200).json({
    status: 200,
    message: "Success",
    data: response
  });
};

const createJudgeScore = async (req, res) => {
  let round = await RoundModel.findById(req.params.round);
  if (!round) {
    return res.status(404).json({
      status: 404,
      message: "Round does not exist to submit scores",
    });
  }

  let judge = await JudgeModel.findById(req.params.judge);
  if (!judge) {
    return res.status(404).json({
      status: 404,
      message: "Judge Does not exist",
    });
  }

  let oldScores = await JudgeScoreModel.find({
    round: req.params.round,
    judge: req.params.judge
  });

  if (oldScores.length > 0) {
    return res.status(400).json({
      status: 404,
      message: "Judge has already submitted the scores for this round. Contact support team.",
    });
  }

  let scores = req.body;

  await Promise.all(scores.map(async score =>
    await JudgeScoreModel.create({
      slot: score.slot,
      points: score.points,
      round: round._id,
      judge: judge._id,
    })
  ));

  judge.rounds.push(round._id);
  await judge.save();

  return res.status(200).json({
    status: 200,
    message: "Success",
  });
};

//remove this after judgeScore model is fully implemented
const createScores = async (req, res, next) => {
  let round = await RoundModel.findOne({
    _id: req.params.round,
    event: req.params.event,
  });
  if (!round) {
    return res.status(404).json({
      status: 404,
      message: "Round does not exist to submit scores",
    });
  }
  // TODO: This doesn't work. Why??
  // for (let score of req.body) {
  //   if (!round.teams.includes(score.team)) return next();
  // }
  //Answer: teams saved on scores is slot id and not team id. This needs to be fixed
  // after properly examining the design.

  /**
   * TODO: Don't allow same judge to post the same result twice.
   */

  /**
   * TODO: Update judge model also with the round id.
   */

  let scores = await ScoreModel.find({
    round: req.params.round,
  });
  if (scores.length) {
    // HACK: Improve this
    for (let score of req.body) {
      let teamScore = await ScoreModel.findOne({
        team: score.team,
        round: score.round,
      });
      teamScore.judges = teamScore.judges.concat(score.judges);

      await teamScore.save();
    }
  } else {
    scores = await ScoreModel.create(req.body);
  }

  return res.json({
    status: 200,
    message: "Success",
    data: scores,
  });
};

/**
 * Fetch scores from judges to be displayed.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const getScores = async (req, res, next) => {

  if (!req.user) {
    return res.status(403).json({
      status: 403,
      message: "Forbidden. Requester not authenticated.",
    });
  }

  if (req.user.type !== USER_TYPES.ADMINISTRATOR) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized. Only administrators can view judge scores.",
    });
  }

  let scores = await ScoreModel.find({
    round: req.params.round,
  });

  return res.json({
    status: 200,
    message: "Success",
    data: scores,
  });
};

const getJudgeScores = async (req, res, next) => {

  if (!req.user) {
    return res.status(403).json({
      status: 403,
      message: "Forbidden. Requester not authenticated.",
    });
  }

  if (req.user.type > 2) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized. Only administrators & support team can view judge scores.",
    });
  }

  let scores = await JudgeScoreModel.find({
    round: req.params.round,
    judge: req.params.judge,
  });

  return res.json({
    status: 200,
    message: "Success",
    data: scores,
  });
};

const updateSlotBias = async (req, res) => {

  if (!req.params.round) {
    return res.status(404).json({
      status: 400,
      message: "round id missing from params",
    });
  }

  let round = await RoundModel.findOne({
    _id: req.params.round,
  });
  if (!round) {
    return res.status(404).json({
      status: 404,
      message: "Round does not exist to update bias",
    });
  }

  if (!req.body) req.body = [];

  if (req.body.length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Bad Request",
    });
  }

  let slotsUpdate = req.body;

  let slots = await Slot2Model.find({
    round: req.params.round
  })

  let result = await Slot2Model.bulkWrite(slotsUpdate.map(slot => ({
    updateOne: {
      filter: { "_id": slot.id },
      update: { $set: { overtime: slot.overtime || 0, disqualified: slot.disqualified } }
    }
  })))

  return res.json({
    status: 200,
    message: "Success",
    data: result
  })


}


const updateTeamScores = async (req, res) => {
  if (!req.body) req.body = [];

  if (req.body.length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Bad Request",
    });
  }

  for (let team of req.body) {
    let teamDoc = await TeamModel.findOne({
      _id: team.id,
      event: req.params.event,
    });
    if (teamDoc) {
      teamDoc.disqualified = team.disqualified;
      await teamDoc.save();
    }

    let scoreDoc = await ScoreModel.findOne({
      team: team.id,
      round: req.params.round,
    });
    if (scoreDoc) {
      scoreDoc.overtime = team.overtime;
      await scoreDoc.save();
    }
  }

  return res.json({
    status: 200,
    message: "Success",
    data: {
      event: req.params.event,
      round: req.params.round,
      teams: req.body,
    },
  });
};

const createSlots = async (req, res) => {
  let teams = await TeamModel.find({
    event: req.params.event,
  });
  if (!teams) teams = [];

  let teamNames = teams.map(team => team.name);
  // TODO: Use team names
  teams = teams.map(team => team.id);

  // Slotting
  let slots = [];
  let noOfTeams = teams.length;
  for (let i = 0; i < noOfTeams; i++) {
    let index = Math.floor(Math.random() * teams.length);
    let team_id = teams[index];
    let team_name = teamNames[index];

    await SlotModel.create({
      number: i + 1,
      round: req.params.round,
      team: team_id,
      teamName: team_name,
    });
    slots.push({ id: team_id, name: team_name, number: i + 1 });
    teams.splice(teams.indexOf(team_id), 1);
    teamNames.splice(teamNames.indexOf(team_name), 1);
  }

  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
};

const createSlots2 = async (req, res) => {
  let colleges = await CollegeModel.find();
  let event = await EventModel.findById(req.params.event);
  let round = await RoundModel.findById(req.params.round);
  let maxTeamsPerCollege = event.maxTeamsPerCollege;
  let teams = [];

  if (round.qualifier) {
    let roundIndex = event.rounds.indexOf(req.params.round);
    let lb = await leaderboard.getRoundLeaderboard(event.rounds[roundIndex - 1]);
    let qualifiedTeams = lb.slice(0, round.qualifier);
    teams = await TeamModel.find({ event: req.params.event }).populate({
      path: "college",
      model: "College",
    });
    teams = teams.map(team => team.toObject());
    teams = teams.filter(team => qualifiedTeams.find(item => item.slot.teamIndex == team.index && item.slot.college._id.toString() == team.college._id))
    teams = teams.map(team => ({ ...team, teamIndex: team.index }))
  }
  else if (round.slotType == "registered") {
    teams = await TeamModel.find({ event: req.params.event }).populate({
      path: "college",
      model: "College",
    });
    teams = teams.map(team => ({ ...team.toObject(), teamIndex: team.index }))
  }
  else {
    colleges.forEach(college => {
      for (let i = 0; i < maxTeamsPerCollege; i++) {
        teams.push({ teamIndex: i, college: college });
      }
    });
  }
  let count = teams.length;
  let slots = [];
  for (let i = 0; i < count; i++) {
    let index;
    if (round.slotOrder == "asc") {
      index = 0;
    }
    else if (round.slotOrder == "desc") {
      index = teams.length - 1;
    }
    else {//random
      index = Math.floor(Math.random() * 100) % teams.length;
    }
    let team = teams.splice(index, 1)[0];
    let order = i + 1;
    try {
      await Slot2Model.create({
        number: order,
        round: req.params.round,
        teamIndex: team.teamIndex,
        college: team.college._id
      });
    } catch (e) {
      throw e;
    }
    slots.push({ number: order, ...team });
  }
  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
};

const get = async (req, res, next) => {
  let event = await EventModel.findById(req.params.event).populate({
    path: "college",
    model: "College",
  });

  if (!event) return next();

  return res.json({
    status: 200,
    message: "Success",
    data: {
      id: event.id,
      name: event.name,
      description: event.description,
      college: event.college,
      rounds: event.rounds,
      teams: event.teams,
      minMembersPerTeam: event.minMembersPerTeam,
      maxMembersPerTeam: event.maxMembersPerTeam,
      maxTeamsPerCollege: event.maxTeamsPerCollege,
      venue: event.venue,
      duration: event.duration,
      startDate: event.startDate,
      endDate: event.endDate,
      slottable: event.slottable,
      faculty: event.faculty,
      registrationStartDate: event.registrationStartDate,
      registrationEndDate: event.registrationEndDate,
    },
  });
};

const getAll = async (req, res) => {
  let events = await EventModel.find().populate({
    path: "rounds",
    model: "Round",
  }).populate({
    path: "college",
    model: "College",
  });

  events = events.map(event => {
    let roundId = event.rounds.map(round => round.id);
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      college: event.college,
      rounds: roundId,
      teams: event.teams,
      minMembersPerTeam: event.minMembersPerTeam,
      maxMembersPerTeam: event.maxMembersPerTeam,
      maxTeamsPerCollege: event.maxTeamsPerCollege,
      venue: event.venue,
      duration: event.duration,
      startDate: event.startDate,
      endDate: event.endDate,
      slottable: event.slottable,
      faculty: event.faculty,
      registrationStartDate: event.registrationStartDate,
      registrationEndDate: event.registrationEndDate,
    };
  });

  return res.json({
    status: 200,
    message: "Success",
    data: events,
  });
};

const getLeaderboard = async (req, res, next) => {
  let event = await EventModel.findById(req.params.event);

  if (!event) next();

  let scores = await ScoreModel.find({
    round: { $in: event.rounds },
  });

  scores = scores.map(score => ({
    team: score.team,
    points: {
      original: score.points,
      final: score.points - (score.overtime > 0 ? 5 * (Math.ceil(score.overtime / 15)) : 0),
    },
  }));

  let mappedScores = scores.reduce((acc, curr) => {
    let points = acc.get(curr.team) || { original: 0, final: 0 };
    acc.set(curr.team, {
      original: curr.points.original + points.original,
      final: curr.points.final + points.final,
    });
    return acc;
  }, new Map());

  let cumulatedScores = [...mappedScores].map(([team, score]) => ({ team, score }));

  return res.json({
    status: 200,
    message: "Success",
    data: cumulatedScores,
  });
};


const getRoundLeaderboard2 = async (req, res, next) => {
  let round = await RoundModel.findById(req.params.round);

  if (!round) {
    return res.status(404).json({
      status: 404,
      message: "Round does not exist to get leaderboard",
    });
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

  return res.json({
    status: 200,
    message: "Success",
    data: leaderboard,
  });
}

const getOvertimeMinusPoints = (overtime = 0) => {
  return overtime > 0 ? 5 * (Math.ceil(overtime / 15)) : 0;
}

const getRoundLeaderboard = async (req, res, next) => {
  let round = await RoundModel.findOne({
    _id: req.params.round,
    event: req.params.event,
  });

  if (!round) next();

  let scores = await ScoreModel.find({
    round: round.id,
  }).populate({ path: "team", populate: { path: "college" } });

  scores = await Promise.all(scores.map(async score => {
    let bias = score.overtime > 0 ? 5 * (Math.ceil(score.overtime / 15)) : 0;

    if (!score.team.college) {
      console.log("SLOT COLLEGE MISSING", score)
      let start = score.team.teamName.lastIndexOf("(") + 1;
      if (start > 0) {
        let comma = score.team.teamName.lastIndexOf(",");
        let collegeName = score.team.teamName.substring(0, comma).trim();;
        let location = score.team.teamName.substring(comma + 1, start - 1).trim();
        score.team.college = await CollegeModel.findOne({ name: collegeName, location });
        console.log({ college: score.team.college, location, collegeName });
        if (!score.team.college) {
          console.error("College not found", score);
          return null;
        }
      }
      else {
        console.error("No way to find college", score);
        return null;
      }
    }

    return {
      team: score.team,
      round: score.round,
      judgePoints: score.points,
      points: score.points - bias,
      overtime: score.overtime,
      // disqualified: score.team.disqualified,
    };
  }));

  scores = scores.filter(score => !!score);

  return res.json({
    status: 200,
    message: "Success",
    data: scores,
  });
};

// IT WAS ALREADY THERE AND I WROTE IT AGAIN!
const getEventLeaderboard = async (req, res) => {
  let event = await EventModel.findById(req.params.event);

  if (!event) {
    return res.status(404).json({
      status: 404,
      message: "Not Found. Event doesn't exist.",
    });
  }

  let scores = await ScoreModel.find({
    round: { $in: event.rounds },
  }).populate({
    path: "team",
    model: "Team",
  });

  scores = scores.map(score => {
    let bias = score.overtime > 0 ? 5 * (Math.ceil(score.overtime / 15)) : 0;

    return {
      round: score.round,
      team: score.team,
      overtime: score.overtime,
      points: {
        judge: score.points,
        final: score.points - bias,
      },
    };
  });

  let leaderboard = {};
  for (let score of scores) {
    if (!leaderboard.hasOwnProperty(score.team.id)) {
      leaderboard[score.team.id] = {
        team: score.team,
        points: score.points,
      };
    } else {
      leaderboard[score.team.id] = {
        ...leaderboard[score.team.id],
        points: {
          judge: leaderboard[score.team.id].points.judge + score.points.judge,
          final: leaderboard[score.team.id].points.final + score.points.final,
        },
      };
    }
  }

  return res.json({
    status: 200,
    message: "Success",
    data: Object.values(leaderboard),
  });
};

const getRound = async (req, res, next) => {

  let round = await RoundModel.findOne({
    _id: req.params.round,
    event: req.params.event,
  });

  if (!round) next();

  return res.json({
    status: 200,
    message: "Success",
    data: {
      id: round.id,
      event: round.event,
      criteria: round.criteria,
      published: round.published,
      teams: round.teams,
      duration: round.duration,
      slotOrder: round.slotOrder,
      slotType: round.slotType,
      status: round.status,
      qualifier: round.qualifier
    },
  });
};

const getRounds = async (req, res) => {
  let rounds = await RoundModel.find({ event: req.params.event });

  if (!rounds) rounds = [];

  rounds = rounds.map(round => ({
    id: round.id,
    event: round.event,
    teams: round.teams,
    published: round.published,
    duration: round.duration,
    slottable: round.slottable,
    status: round.status,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: rounds,
  });
};

const getSlot = async (req, res, next) => {
  let slot = await SlotModel.findOne({
    round: req.params.round,
    team: req.params.team,
  });
  if (!slot) next();

  return res.json({
    status: 200,
    message: "Success",
    data: {
      id: slot.id,
      number: slot.number,
      round: slot.round,
      team: slot.team,
    },
  });
};

const getSlots = async (req, res, next) => {
  let slots = await SlotModel.find({ round: req.params.round }).populate({
    path: "team",
    model: "Team",
  });

  if (!slots) next();

  slots = slots.map(slot => ({
    id: slot.id,
    number: slot.number,
    round: slot.round,
    team: slot.team,
    teamName: slot.teamName,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
};

const getSlots2 = async (req, res, next) => {
  let slots = await Slot2Model.find({ round: req.params.round }).populate('college');
  if (!slots) next();
  slots = slots.map(slot => ({
    id: slot.id,
    number: slot.number,
    round: slot.round,
    teamIndex: slot.teamIndex,
    college: slot.college,
    overtime: slot.overtime,
    disqualified: slot.disqualified
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
};


const deleteSlots2 = async (req, res) => {
  await Slot2Model.deleteMany({ round: req.params.round });
  return res.json({
    status: 200,
    message: "Success",
  });
};

const getTeam = async (req, res, next) => {
  let team = await TeamModel.findOne({
    _id: req.params.team,
    event: req.params.event,
  });

  if (!team) next();

  return res.json({
    status: 200,
    message: "Success",
    data: team,
  });
};

const getTeams = async (req, res) => {
  let teams = await TeamModel.find({ event: req.params.event }).populate("college");

  if (!teams) teams = [];


  return res.json({
    status: 200,
    message: "Success",
    data: teams,
  });
};

const getTeamsWithMembers = async (req, res) => {
  let teams = await TeamModel.find({ event: req.params.event }).populate("college").populate("members");

  if (!teams) teams = [];


  return res.json({
    status: 200,
    message: "Success",
    data: teams,
  });
};

const getTeamsInRound = async (req, res) => {
  let round = await RoundModel.findOne({
    _id: req.params.round,
    event: req.params.event,
  }).populate({
    path: "teams",
    model: "Team",
  });

  return res.json({
    status: 200,
    message: "Success",
    data: round.teams,
  });
};

const create = async (req, res) => {
  let {
    name,
    college,
    teams,
    minMembersPerTeam,
    maxMembersPerTeam,
    maxTeamsPerCollege,
    venue,
    description,
    duration,
    startDate,
    endDate,
    slottable,
    faculty,
    registrationStartDate,
    registrationEndDate,
  } = req.body;

  let event = new EventModel({
    name,
    college,
    teams,
    minMembersPerTeam,
    maxMembersPerTeam,
    maxTeamsPerCollege,
    venue,
    description,
    duration,
    startDate,
    endDate,
    slottable,
    faculty,
    registrationStartDate,
    registrationEndDate,
  });

  await event.save().
    then(event => {
      return res.json({
        status: 200,
        message: "New event created",
        data: {
          id: event.id,
          name: event.name,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
        },
      });
    }).
    catch((e) => {
      // eslint-disable-next-line no-console
      console.poo(e);

      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    });
};

const edit = async (req, res) => {
  let {
    name,
    college,
    teams,
    minMembersPerTeam,
    maxMembersPerTeam,
    maxTeamsPerCollege,
    venue,
    description,
    duration,
    startDate,
    endDate,
    slottable,
    // criteria,
    faculty,
    registrationStartDate,
    registrationEndDate,
  } = req.body;

  let event = await EventModel.findById(req.params.event);

  event.name = name ? name : event.name;
  event.college = college ? college : event.college;
  event.teams = teams ? teams : event.teams;
  event.minMembersPerTeam = minMembersPerTeam ? minMembersPerTeam : event.minMembersPerTeam;
  event.maxMembersPerTeam = maxMembersPerTeam ? maxMembersPerTeam : event.maxMembersPerTeam;
  event.maxTeamsPerCollege = maxTeamsPerCollege ? maxTeamsPerCollege : event.maxTeamsPerCollege;
  event.venue = venue ? venue : event.venue;
  event.description = description ? description : event.description;
  event.duration = duration ? duration : event.duration;
  event.startDate = startDate ? startDate : event.startDate;
  event.endDate = endDate ? endDate : event.endDate;
  event.slottable = !!slottable;
  event.faculty = faculty != undefined ? faculty : event.faculty;
  event.registrationStartDate = registrationStartDate ? registrationStartDate : event.registrationStartDate;
  event.registrationEndDate = registrationEndDate ? registrationEndDate : event.registrationEndDate;

  //Seems like not required
  // if (criteria) {
  //   if (event.rounds && event.rounds.length) {
  //     for (let round of event.rounds) {
  //       let roundDoc = await RoundModel.findById(round);
  //       roundDoc.criteria = criteria;

  //       // eslint-disable-next-line no-console
  //       await roundDoc.save();
  //     }
  //   }
  // }

  await event.save().
    then(event => {
      return res.json({
        status: 200,
        message: "Success. Event Updated",
        data: {
          id: event.id,
          name: event.name,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
        },
      });
    }).
    catch((e) => {
      // eslint-disable-next-line no-console
      console.poo(e);

      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    });
};

/**
 * Insert Participants in bulk.
 * @param {object} data The request object
 * @param {string} college The college id
 * @returns {Array} The members id
 */
const addBulkParticipants = (data, college) => {

  // TODO: check if student particpant registered for faculty event and vice versa

  return new Promise(async (resolve, reject) => {
    try {
      let members = [];
      await data.map(each => {
        let participant = new ParticipantModel({
          registrationID: each.registrationID,
          name: each.name,
          college: college,
          faculty: each.faculty,
        });
        members.push(participant._id);
        participant.save(err => {
          if (err) {
            throw err;
          }
        });
      });
      resolve(members);
    } catch (err) {
      reject(err);
    }
  });
};

const publishRoundLeaderboard = async (req, res) => {
  let round = await RoundModel.findById(req.params.round);

  if (!round) {
    return res.status(404).json({
      status: 404,
      message: "Round Not Found",
    });
  }

  round.published = true;
  await round.save();

  return res.json({
    status: 200,
    message: "Success",
    data: round,
  });
};

module.exports = {
  deleteTeam,
  deleteRound,
  createRound,
  createScore,
  createScores,
  createSlots,
  createSlots2,
  get,
  getAll,
  getRound,
  getScores,
  getLeaderboard,
  getRoundLeaderboard,
  getEventLeaderboard,
  getRounds,
  getSlot,
  getSlots,
  getSlots2,
  deleteSlots2,
  getTeam,
  getTeams,
  getTeamsWithMembers,
  getTeamsInRound,
  create,
  edit,
  createTeam,
  updateTeam,
  updateRound,
  updateTeamScores,
  publishRoundLeaderboard,
  createJudgeScore,
  getJudgeScores,
  getRoundLeaderboard2,
  updateSlotBias,
  makeBackup,
  getBackup,
  deleteBackup
};
