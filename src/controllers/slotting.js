const CollegeModel = require("../models/College");
const TeamModel = require("../models/Team");
const EventModel = require("../models/Event");
const Slot2Model = require("../models/Slot2");
const RoundModel = require("../models/Round");
var ObjectId = require('mongodb').ObjectId;

const getEventsName = async (req, res) => {
  try {
    const collegeName = req.body.collegeName;
    const college = await CollegeModel.findOne({ name: collegeName });
    if (!college) {
      return res.status(404).json({
        status: 404,
        message: "Not Found. No college was found for the specified name.",
      });
    }
    const events = await TeamModel.find({ college: college._id });
    const eventIds = events.map((event) => event.event);
    let eventDetails = [];
    let eventData = {};
    for (let eventId of eventIds) {
      // console.log(eventId);
      const event = await EventModel.findById(eventId);
      const eventData = {
        name: event.name,
        id: event._id,
      };
      eventDetails.push(eventData);
    }
    return res.status(200).json({
      status: 200,
      message: "Success",
      eventDetails,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
};

const findOrCreateSlot = async (roundId, collegeId, teamIndex) => {
  try {
    // Find the maximum slot number for the specified college and team index
    const slots = await Slot2Model.find({ round: roundId });

    const newSlotNumber =
      slots.reduce((max, slot) => Math.max(max, slot.number), 0) + 1;

    // Create new slot for the specified college and team index
    const newSlot = new Slot2Model({
      number: newSlotNumber,
      round: roundId,
      college: collegeId,
      teamIndex,
    });

    await newSlot.save();
    console.log(
      `Slot added for round ${roundId}, college ${collegeId}, and teamIndex ${teamIndex} and slot number is ${newSlotNumber}.`
    );
    return 200;
  } catch (error) {
    console.error("Error creating slot:", error);
    return 500;
  }
};

// Function to slot teams for a specific event and college
const slotTeamsForEventAndCollege = async (collegeId, eventId) => {
  try {
    // Find teams from the specified college in the event
    const teams = await TeamModel.find({ college: collegeId, event: eventId });
    // If no teams are found, log a message and return
    if (teams.length === 0) {
      console.log(
        `No teams found for college ${collegeId} in event ${eventId}.`
      );
      return 404;
    }

    // Get all rounds in the event
    const rounds = await RoundModel.find({ event: eventId });

    // For each team, check if there is a slot for each round
    for (const team of teams) {
      for (const round of rounds) {
        // Check if a slot exists for the team in the round
        const existingSlot = await Slot2Model.findOne({
          round: ObjectId(round._id),
          college: ObjectId(collegeId),
          teamIndex: team.index,
        });
        // If no slot exists, create a new one
        if (!existingSlot) {
          return await findOrCreateSlot(round._id, collegeId, team.index);
        }else{
          console.log(`Slot already exists for round ${round._id}, college ${collegeId}, and teamIndex ${team.index} and slot number is ${existingSlot.number}.`);
          return 409;
        }
      }
    }

    console.log(
      `Slotting completed for all teams from college ${collegeId} in event ${eventId}`
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

const slotCollegeById = async (req, res) => {
  const { collegeId, eventDetails } = req.body;
  try {
    for (const event of eventDetails) {
      const response = await slotTeamsForEventAndCollege(ObjectId(collegeId), ObjectId(event.id));
      if (response === 404) {
        return res.status(404).json({
          status: 404,
          message: `No teams found for college ${collegeId} in event ${event.id}.`,
        });
      } else if (response === 500) {
        return res.status(500).json({
          status: 500,
          message: `Error slotting teams for college ${collegeId} in event ${event.id}.`,
        });
      } else if (response === 200) {
        return res.status(200).json({
            status: 200,
            message: "Slotting completed for all teams from college",
          });
      }else if(response === 409){
        return res.status(409).json({
          status: 409,
          message: `Slot already exists for round ${event.id}, college ${collegeId}, and teamIndex ${team.index} and slot number is ${existingSlot.number}.`,
        });
      }
    }
    
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
};

module.exports = {
  getEventsName,
  slotCollegeById,
};
