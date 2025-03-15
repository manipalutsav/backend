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
      if(event.endDate < Date.now()){
        continue;
      }
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
    if (teams.length === 0) {
      console.log(`No teams found for college ${collegeId} in event ${eventId}.`);
      return 404;
    }

    // Get all rounds in the event
    const rounds = await RoundModel.find({ event: eventId });
    
    // We'll track a status for the overall process.
    let overallStatus = 200;

    // For each team, check if there is a slot for each round
    for (const team of teams) {
      for (const round of rounds) {
        // Check if a slot exists for the team in the round
        const existingSlot = await Slot2Model.findOne({
          round: ObjectId(round._id),
          college: ObjectId(collegeId),
          teamIndex: team.index,
        });
        if (!existingSlot) {
          // Create a new slot if it doesn't exist
          const slotStatus = await findOrCreateSlot(round._id, collegeId, team.index);
          // If slot creation fails, update overall status but continue processing
          if (slotStatus !== 200) {
            overallStatus = slotStatus;
          }
        } else {
          console.log(
            `Slot already exists for round ${round._id}, college ${collegeId}, and teamIndex ${team.index} with slot number ${existingSlot.number}.`
          );
          // Mark the overall status as conflict, but continue processing other teams
          overallStatus = 409;
        }
      }
    }

    console.log(
      `Slotting completed for all teams from college ${collegeId} in event ${eventId}`
    );
    return overallStatus;
  } catch (error) {
    console.error("Error:", error);
    return 500;
  }
};

const slotCollegeById = async (req, res) => {
  const { collegeId, eventDetails } = req.body;
  try {
    let finalStatus = 200;
    // Process each event in eventDetails
    for (const event of eventDetails) {
      const response = await slotTeamsForEventAndCollege(
        ObjectId(collegeId),
        ObjectId(event.id)
      );
      // Update finalStatus if any event returns an error status
      if (response !== 200) {
        finalStatus = response;
      }
    }

    if (finalStatus === 200) {
      return res.status(200).json({
        status: 200,
        message: "Slotting completed for all teams from college",
      });
    } else if (finalStatus === 404) {
      return res.status(404).json({
        status: 404,
        message: `No teams found for one or more events for college ${collegeId}.`,
      });
    } else if (finalStatus === 409) {
      return res.status(409).json({
        status: 409,
        message: `One or more slots already exist.`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: `Error slotting teams for college ${collegeId}.`,
      });
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

