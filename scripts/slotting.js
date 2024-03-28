const dotenv = require("dotenv");
const mongoose = require("mongoose");

var ObjectId = require('mongodb').ObjectId;
const Slot2Model = require("../src/models/Slot2");
const EventModel = require("../src/models/Event");
const RoundModel = require("../src/models/Round");
const TeamModel = require("../src/models/Team");

dotenv.config();


const connectToDatabase = async () => {
    try {
        const ip = process.env.MONGODB_IP || "127.0.0.1";
        const port = process.env.MONGODB_PORT;
        const host = ip + ":" + port;
        const uri = "mongodb://" + host;
        console.log(uri)
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.MONGODB_DATABASE,
        };

        console.log(`Connecting to ${uri}`);
        await mongoose.connect(uri, options);
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

// Function to find or create a slot for a team in a round
const findOrCreateSlot = async (roundId, collegeId, teamIndex) => {
    try {
        // Find the maximum slot number for the specified college and team index
        const slots = await Slot2Model.find({ round: roundId });

        const newSlotNumber = slots.reduce((max, slot) => Math.max(max, slot.number), 0)+1;


        // Create new slot for the specified college and team index
        // const newSlot = new Slot2Model({
        //     number: newSlotNumber,
        //     round: roundId,
        //     college: collegeId,
        //     teamIndex
        // });

        // await newSlot.save();
        console.log(`Slot added for round ${roundId}, college ${collegeId}, and teamIndex ${teamIndex} and slot number is ${newSlotNumber}.`);
    } catch (error) {
        console.error("Error creating slot:", error);
    }
};

// Function to slot teams for a specific event and college
const slotTeamsForEventAndCollege = async (collegeId, eventId) => {
    try {
        
        // Find teams from the specified college in the event
        const teams = await TeamModel.find({ college: ObjectId(collegeId), event: ObjectId(eventId) });
        // If no teams are found, log a message and return
        if (teams.length === 0) {
            console.log(`No teams found for college ${collegeId} in event ${eventId}.`);
            return;
        }

        // Get all rounds in the event
        const rounds = await RoundModel.find({ event: eventId });

        // For each team, check if there is a slot for each round
        for (const team of teams) {
            for (const round of rounds) {
                // Check if a slot exists for the team in the round
                const existingSlot = await Slot2Model.findOne({ round: ObjectId(round._id), college: ObjectId(collegeId), teamIndex: team.index });
                // If no slot exists, create a new one
                if (!existingSlot) {
                    await findOrCreateSlot(round._id, collegeId, team.index);
                }
            }
        }

        console.log(`Slotting completed for all teams from college ${collegeId} in event ${eventId}`);
    } catch (error) {
        console.error("Error:", error);
    }
};

const main = async () => {
    await connectToDatabase(); 
    const collegeId = new ObjectId( process.argv[2]);
    const eventId = new ObjectId( process.argv[3]);
    if (!collegeId || !eventId) {
        console.error("Please provide the college ID and event ID as arguments.");
        process.exit(1);
    }
    await slotTeamsForEventAndCollege(collegeId, eventId); 
    await mongoose.disconnect(); 
};

main();
