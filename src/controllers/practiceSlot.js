const PracticeSlotModel = require("../models/PracticeSlot");
const CollegeModel = require("../models/College");
const Team = require("../models/Team")
const Event = require("../models/Event")

const createPracticeSlot = async (req, res) => {
  try {
    console.log("Practice slotting:");

    // Assuming the date is provided in the request body, ensure it's in the correct format
    const date = req.body.date;
    console.log(date + " this is date");

    // Step 1: Find events occurring at the specified venue and date
    const events = await Event.find({
      venue: "KMC Greens, Main Stage",
      startDate: { $gt: new Date(date) },
      endDate: { $lt: new Date(date + "T23:59:59.999Z") }
    });
    console.log(events.length, "events found");

    // Step 2: Fetch teams for all events
    const teamsByEvent = [];
    for (const event of events) {
      const teams = await Team.find({ event: event._id });
      teamsByEvent.push(...teams);
    }
    console.log(teamsByEvent.length, "teams found in total");

    const shuffle = (array) => {
      let currentIndex = array.length;
    
      // While there remain elements to shuffle...
      while (currentIndex != 0) {
    
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
    }

    shuffle(teamsByEvent)

    // Step 3: Create practice slots by removing duplicate teams based on college
    const slots = [];
    const addedTeams = new Set(); // Track teams by college to remove duplicates
    let order = 0;
    const mangaloreColleges = [];
    for (const team of teamsByEvent) {
      const teamIdentifier = `${team.college}-${team.index}`; // Unique identifier for the team
      const college = await CollegeModel.findOne({ _id: team.college });
      if (college.location === "Mangalore") {
        mangaloreColleges.push({ team, college });
        continue; // Skip adding Mangalore colleges for now
      }
      if (!addedTeams.has(teamIdentifier)) {
        console.log("Team added:", teamIdentifier);
        order += 1;
        await PracticeSlotModel.create({
          number: order,
          college: team.college,
          date: date,
          index: team.index
        });
        slots.push({ team: team.index, location: college.location, college: college.name, order: order });
        addedTeams.add(teamIdentifier);
      } else {
        console.log("Team removed:", teamIdentifier);
      }
    }

    // Add Mangalore colleges at the end
    for (const { team, college } of mangaloreColleges) {
      const teamIdentifier = `${team.college}-${team.index}`;
      if (!addedTeams.has(teamIdentifier)) {
        console.log("Team added:", teamIdentifier);
        order += 1;
        await PracticeSlotModel.create({
          number: order,
          college: team.college,
          date: date,
          index: team.index
        });
        slots.push({ team: team.index, location: college.location, college: college.name, order: order });
        addedTeams.add(teamIdentifier);
      } else {
        console.log("Team removed:", teamIdentifier);
      }
    }

    console.log(slots.length, "slots created");

    return res.json({
      status: 200,
      message: "Success",
      data: slots,
    });
  } catch (error) {
    console.error("Error creating practice slots:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};





const getPracticeSlots = async (req, res, next) => {
  try {
    // Fetch practice slots with populated college details
    
    const slots = await PracticeSlotModel.find({});

    // Check if practice slots are found
    if (!slots || slots.length === 0) {
      return res.status(404).json({ status: 404, message: "Practice slots not found" });
    }

    // Map the practice slots data to include college name, location, and team details
    const populatedSlots = await Promise.all(slots.map(async (slot) => {
      const College = await CollegeModel.findById(slot.college);
      // Check if college is found
      if (!College) {
        throw new Error("College not found for practice slot");
      }
      // Format the data with college name and location
      const slotData = {
        order: slot.number,
        date:slot.date,
        college: College.name,
        location: College.location,
        team: slot.index
      };
      return slotData;
    }));

    // Return the populated data with college details
    return res.json({
      status: 200,
      message: "Success",
      data: populatedSlots
    });
  } catch (error) {
    console.error("Error fetching practice slots:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};



const deletePracticeSlots = async (req, res) => {
  const date = req.body.date;
  await PracticeSlotModel.deleteMany({date:new Date(date)});
  return res.json({
    status: 200,
    message: "Success",
  });
};

module.exports = {
  createPracticeSlot,
  getPracticeSlots,
  deletePracticeSlots
}