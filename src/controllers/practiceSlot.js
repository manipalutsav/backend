const PracticeSlotModel = require("../models/PracticeSlot");
const CollegeModel = require("../models/College");
const Team = require("../models/Team");
const Event = require("../models/Event");

const createPracticeSlot = async (req, res) => {
  try {
    const { date, startTime: inputStartTime, endTime: inputEndTime } = req.body;

    // Validate time inputs
    if (!inputStartTime || !inputEndTime) {
      return res.status(400).json({
        status: 400,
        message: "Start time and end time are required",
      });
    }

    // Convert time inputs to Date objects
    const startTime = new Date(`${date}T${inputStartTime}`);
    const endTime = new Date(`${date}T${inputEndTime}`);

    // Check valid time range
    if (startTime >= endTime) {
      return res.status(400).json({
        status: 400,
        message: "End time must be after start time",
      });
    }

    // Existing logic to get events and teams
    const events = await Event.find({
      venue: "KMC Greens, Main Stage",
      startDate: { $gt: new Date(date) },
      endDate: { $lt: new Date(date + "T23:59:59.999Z") },
    });

    const teamsByEvent = [];
    for (const event of events) {
      const teams = await Team.find({ event: event._id });
      teamsByEvent.push(...teams);
    }
    const shuffle = (array) => {
      let currentIndex = array.length;

      // While there remain elements to shuffle...
      while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
    };

    // Shuffle and process teams
    shuffle(teamsByEvent);

    const tempSlots = [];
    const addedTeams = new Set();
    let order = 0;
    const mangaloreColleges = [];

    // Process non-Mangalore colleges
    for (const team of teamsByEvent) {
      const teamIdentifier = `${team.college}-${team.index}`;
      const college = await CollegeModel.findOne({ _id: team.college });

      if (college.location === "Mangalore") {
        mangaloreColleges.push({ team, college });
        continue;
      }

      if (!addedTeams.has(teamIdentifier)) {
        order += 1;
        tempSlots.push({ college, team, order });
        addedTeams.add(teamIdentifier);
      }
    }

    // Process Mangalore colleges
    for (const { team, college } of mangaloreColleges) {
      const teamIdentifier = `${team.college}-${team.index}`;
      if (!addedTeams.has(teamIdentifier)) {
        order += 1;
        tempSlots.push({ college, team, order });
        addedTeams.add(teamIdentifier);
      }
    }

    // Calculate time slots
    const totalSlots = tempSlots.length;
    if (totalSlots === 0) {
      return res.json({
        status: 200,
        message: "No teams found for practice slots",
        data: [],
      });
    }

    const totalDuration = endTime - startTime;
    const slotDuration = totalDuration / totalSlots;

    // Create practice slots with calculated times
    const slots = [];
    for (const { college, team, order } of tempSlots) {
      const slotStart = new Date(
        startTime.getTime() + (order - 1) * slotDuration
      );
      const slotEnd = new Date(startTime.getTime() + order * slotDuration);

      await PracticeSlotModel.create({
        number: order,
        college: college._id,
        date: date,
        index: team.index,
        startTime: slotStart,
        endTime: slotEnd,
      });

      slots.push({
        order,
        college: college.name,
        team: team.index,
        location: college.location,
        startTime: slotStart.toLocaleTimeString('en-IN', { 
          hour: 'numeric',
          minute: '2-digit',
          hour12: true 
        }),
        endTime: slotEnd.toLocaleTimeString('en-IN', {
          hour: 'numeric',
          minute: '2-digit', 
          hour12: true
        })
      });
    }

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
      return res
        .status(404)
        .json({ status: 404, message: "Practice slots not found" });
    }

    // Map the practice slots data to include college name, location, and team details
    const populatedSlots = await Promise.all(
      slots.map(async (slot) => {
        const College = await CollegeModel.findById(slot.college);
        // Check if college is found
        if (!College) {
          throw new Error("College not found for practice slot");
        }
        // Format the data with college name and location
        const slotData = {
          order: slot.number,
          date: slot.date,
          college: College.name,
          location: College.location,
          team: slot.index,
          startTime: slot.startTime.toLocaleTimeString('en-IN', { 
            hour: 'numeric',
            minute: '2-digit',
            hour12: true 
          }),
          endTime: slot.endTime.toLocaleTimeString('en-IN', {
            hour: 'numeric',
            minute: '2-digit', 
            hour12: true
          })
        };
        return slotData;
      })
    );

    // Return the populated data with college details
    return res.json({
      status: 200,
      message: "Success",
      data: populatedSlots,
    });
  } catch (error) {
    console.error("Error fetching practice slots:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

const getSoltsByDate = async (req, res, next) => {
  try {
    const date = req.body.date;
    // Fetch practice slots with populated college details
    const slots = await PracticeSlotModel.find({ date: new Date(date) });

    // Check if practice slots are found
    if (!slots || slots.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Practice slots not found" });
    }

    // Helper function to format time using Intl.DateTimeFormat with a fallback
    const formatTime = (dateObj) => {
      try {
        // Try using 'en-IN' locale
        return new Intl.DateTimeFormat('en-IN', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).format(dateObj);
      } catch (error) {
        // Fallback to 'en-US' if 'en-IN' is not available
        return new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).format(dateObj);
      }
    };

    // Map the practice slots data to include college name, location, and team details
    const populatedSlots = await Promise.all(
      slots.map(async (slot) => {
        const College = await CollegeModel.findById(slot.college);
        // Check if college is found
        if (!College) {
          throw new Error("College not found for practice slot");
        }
        // Format the data with college details and formatted time strings
        const slotData = {
          order: slot.number,
          date: slot.date,
          college: College.name,
          location: College.location,
          team: slot.index,
          startTime: formatTime(slot.startTime),
          endTime: formatTime(slot.endTime)
        };
        return slotData;
      })
    );

    // Return the populated data with college details
    return res.json({
      status: 200,
      message: "Success",
      data: populatedSlots,
    });
  } catch (error) {
    console.error("Error fetching practice slots:", error);
    return res
      .status(500)
      .json({ status: 500, message: error.message }); //Returning for debuging purposes
  }
};
const deletePracticeSlots = async (req, res) => {
  const date = req.body.date;
  await PracticeSlotModel.deleteMany({ date: new Date(date) });
  return res.json({
    status: 200,
    message: "Success",
  });
};

module.exports = {
  createPracticeSlot,
  getPracticeSlots,
  deletePracticeSlots,
  getSoltsByDate,
};
