"use strict";

const mongoose = require("mongoose");
const EventModel = require("../models/Event");
const CollegeModel = require("../models/College");
const RoundModel = require("../models/Round");
const ScoreModel = require("../models/Score");
const SlotModel = require("../models/Slot");
const Slot2Model = require("../models/Slot2");
const TeamModel = require("../models/Team");
const ParticipantModel = require("../models/Participant");
const { ROUND_STATUS } = require("../utils/constants");

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

    let members = team.members;

    await TeamModel.findByIdAndDelete(team.id);

    for (let member of members) {
      await ParticipantModel.findByIdAndDelete(member);
    }

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

  // TODO: Generate random team names, so we dont have to use
  // college models
  let names = [ "Team A", "Team B", "Team C" ];
  let name = collegeDoc.name + " " +  collegeDoc.location + " (" + names[participatedTeams.length] + ")";
  if (participants.length > eventInfo.maxMembersPerTeam ) {
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

const updateRound = async (req, res, next) => {
  let event = await EventModel.findById(req.params.event);

  if (!event) next();

  let roundDocument = await  RoundModel.findById(req.params.round);
  roundDocument.criteria = req.body.criteria;
  roundDocument.slottable = req.body.slottable;

  await roundDocument.save().
    then(async round => {
      event.rounds.push(round.id);
      await event.save();

      return res.json({
        status: 200,
        message: "Round updated",
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

const createScores = async (req, res, next) => {
  let round = await RoundModel.findOne({
    _id: req.params.round,
    event: req.params.event,
  });
  if (!round) return next();

  // TODO: This doesn't work. Why??
  // for (let score of req.body) {
  //   if (!round.teams.includes(score.team)) return next();
  // }

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

const createSlots2 = async (req, res) => {
  let colleges = await CollegeModel.find();
  let event = await EventModel.findById(req.params.event);
  let maxTeamsPerCollege = event.maxTeamsPerCollege;
  let teams = [];
  let names = [ "A", "B", "C", "D", "E" ];
  colleges.forEach(college => {
    for(let i = 0;i < maxTeamsPerCollege;i++){
      teams.push(`${college.name}, ${college.location} (Team ${names[i]})`);
    }
  });
  let count = teams.length;
  let slots = [];
  for(let i = 0;i < count;i++){
    let index = Math.floor(Math.random() * 100) % teams.length;
    let teamName =  teams.splice(index, 1)[0];
    await Slot2Model.create({
      number: i + 1,
      round: req.params.round,
      teamName: teamName,
    });
    slots.push({ number: i + 1, teamName });
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
  });

  if (!round) next();

  let scores = await ScoreModel.find({
    round: round.id,
  }).populate({
    path: "team",
    model: "Team",
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
    teamName:slot.teamName,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
};

const getSlots2 = async (req, res, next) => {
  let slots = await Slot2Model.find({ round: req.params.round });
  if (!slots) next();
  slots = slots.map(slot => ({
    id: slot.id,
    number: slot.number,
    round: slot.round,
    teamName:slot.teamName,
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
    path: "teams",
    model: "Team",
  });

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
    minMembersPerTeam,
    maxMembersPerTeam,
    maxTeamsPerCollege,
    venue,
    description,
    duration,
    startDate,
    endDate,
    slottable } = req.body;

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
    criteria,
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

  if (criteria) {
    if (event.rounds && event.rounds.length) {
      for (let round of event.rounds) {
        let roundDoc = await RoundModel.findById(round);
        roundDoc.criteria = criteria;

        // eslint-disable-next-line no-console
        await roundDoc.save();
      }
    }
  }

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
  getLeaderboard,
  getRoundLeaderboard,
  getRounds,
  getSlot,
  getSlots,
  getSlots2,
  deleteSlots2,
  getTeam,
  getTeams,
  getTeamsInRound,
  create,
  edit,
  createTeam,
  updateRound,
};
