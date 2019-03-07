"use strict";

const EventModel = require("../models/Event");
const CollegeModel = require("../models/College");
const RoundModel = require("../models/Round");
const ScoreModel = require("../models/Score");
const SlotModel = require("../models/Slot");
const TeamModel = require("../models/Team");
const JudgeModel = require("../models/Judge");
const ParticipantModel = require("../models/Participant");
const { ROUND_STATUS } = require("../utils/constants");

const createTeam = async (req, res) => {
  let {
    college,
    participants,
  } = req.body;

  let { event } = req.params;

  // Check if participation limit reached
  let participatedTeams = await TeamModel.find({ college: college });
  let collegeDoc = await CollegeModel.findById(college);
  let eventInfo = await EventModel.findById(event);
  if (participatedTeams.length === eventInfo.maxTeamsPerCollege) {
    return res.json({
      status: 416,
      message: "Max participation limit reached for college",
    });
  }
  // TODO: Generate random team names, so we dont have to use
  // college models
  let names = [ "Team A", "Team B", "Team C" ];
  let name = collegeDoc.name + " (" + names[participatedTeams.length] + ")";
  if (participants.length > eventInfo.maxParticipants ) {
    return res.json({
      status: 416,
      message: "Number of particpants exceeds max particpants for event",
    });
  }

  addBulkParticipants(participants, college).
    then(async members => {
      let team = new TeamModel({
        event,
        college,
        members,
        name,
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
        let round1 = await RoundModel.findById(eventInfo.rounds[0]);
        round1.teams.push(team.id);
        await round1.save();

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
    slottable: req.body.slottable,
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

const createScores = async (req, res, next) => {
  let round = await RoundModel.findOne({
    _id: req.params.round,
    event: req.params.event,
  });

  if (!round) next();

  if (!round.teams.includes(req.params.team)) next();

  let scores = await ScoreModel.find({
    round: req.params.round,
  });

  if (scores) {
    // HACK: Improve this
    for (let score of req.body) {
      let score = ScoreModel.findOne({
        team: score.team,
        round: score.round,
      });
      score.judges.concat(score.judges);

      await score.save();
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
    slots.push({ id:team_id, name: team_name, number: i + 1 });
    teams.splice(teams.indexOf(team_id), 1);
    teamNames.splice(teamNames.indexOf(team_name), 1);
  }

  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
};

const get = async (req, res, next) => {
  let event = await EventModel.findById(req.params.event);

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
      minParticipants: event.minParticipants,
      maxParticipants: event.maxParticipants,
      venue: event.venue,
      duration: event.duration,
      startDate: event.startDate,
      endDate: event.endDate,
      slottable: event.slottable,
    },
  });
};

const getAll = async (req, res) => {

  let events = await EventModel.find().populate({
    path: 'rounds',
    model: 'Round'
  })
  events = events.map(event => {
    let roundId = event.rounds.map(round => round.id);
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      college: event.college,
      rounds: roundId,
      teams: event.teams,
      minParticipants: event.minParticipants,
      maxParticipants: event.maxParticipants,
      venue: event.venue,
      duration: event.duration,
      startDate: event.startDate,
      endDate: event.endDate,
      slottable: event.slottable,
    }
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
    // TODO: $or doesn't work here. Fix this shit!
    round: { $or: event.rounds },
  });

  scores = scores.map(score => ({
    team: score.team,
    points: score.points,
  }));

  let mappedScores = scores.reduce((acc, curr) => {
    let point = acc.get(curr.team) || 0;
    acc.set(curr.team, curr.points + point);
    return acc;
  }, new Map());

  let cumulatedScores = [ ...mappedScores ].map(([ team, score ]) => ({ team, score }));

  return res.json({
    status: 200,
    message: "Success",
    data: cumulatedScores,
  });
};

const getRoundLeaderboard = async (req, res, next) => {
  let round = await RoundModel.findOne({
    _id: req.params.round,
    event: req.params.event,
  })

  if (!round) next();

  let scores = await ScoreModel.find({
    round: round.id,
  }).populate({
    path: 'teams',
    model: 'Team'
  });

  scores = scores.map(score => ({
    team: score.team,
    round: score.round,
    points: score.points,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: scores,
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
      teams: round.teams,
      duration: round.duration,
      slottable: round.slottable,
      status: round.status,
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
  let slots = await SlotModel.find({ round: req.params.round });
  if (!slots) next();

  slots = slots.map(slot => ({
    id: slot.id,
    number: slot.number,
    round: slot.round,
    team: slot.team,
    teamName:slot.teamName,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: slots,
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
    data: {
      id: team.id,
      name:team.name,
      event: team.event,
      college: team.college,
      members: team.members,
      disqualified: team.disqualified,
    },
  });
};

const getTeams = async (req, res) => {
  let teams = await TeamModel.find({ event: req.params.event });

  if (!teams) teams = [];

  teams = teams.map(team => ({
    id: team.id,
    event: team.event,
    college: team.college,
    members: team.members,
    name: team.name,
    disqualified: team.disqualified,
  }));

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
    path: 'teams',
    model: 'Team'
  })
  
  let teams = round.teams.map(team => ({
    id: team.id,
    event: team.event,
    college: team.college,
    name:team.name,
    members: team.members,
    disqualified: team.disqualified,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: teams,
  });
};

const create = async (req, res) => {
  let {
    name,
    college,
    teams,
    minParticipants,
    maxParticipants,
    venue,
    description,
    duration,
    startDate,
    endDate,
    maxTeamsPerCollege,
    slottable } = req.body;

  let event = new EventModel({
    name,
    college,
    teams,
    minParticipants,
    maxParticipants,
    venue,
    description,
    duration,
    startDate,
    endDate,
    maxTeamsPerCollege,
    slottable,
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

const createJudge = async (req, res) => {
  let { name } = req.body;
  let { round } = req.params;

  let judge = new JudgeModel({
    name,
    round,
  });

  await judge.save(err => {
    if (err) {
      // eslint-disable-next-line no-console
      console.poo(err);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Success",
      data: {
        id: judge._id
      }
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
          email: each.email,
          mobile: each.mobile,
          college: college,
          faculty: each.faculty,
        });
        members.push(participant._id);
        participant.save(err => {
          if(err) {
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

module.exports = {
  createRound,
  createScore,
  createScores,
  createSlots,
  get,
  getAll,
  getRound,
  getLeaderboard,
  getRoundLeaderboard,
  getRounds,
  getSlot,
  getSlots,
  getTeam,
  getTeams,
  getTeamsInRound,
  create,
  createJudge,
  createTeam,
};
