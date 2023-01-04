import mongoose from "mongoose";

const schema = {
  rounds: [mongoose.Schema.Types.ObjectId],
  name: {
    type: String,
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  minMembersPerTeam: {
    type: Number,
    required: true,
    default: 1,
  },
  maxMembersPerTeam: Number,
  maxTeamsPerCollege: Number,
  venue: String,
  description: String,
  duration: Number,
  startDate: Date,
  endDate: Date,
  faculty: {
    type: Boolean,
    required: true,
    default: false,
  },
};

const options = {
  autoCreate: true,
};

const eventSchema = new mongoose.Schema(schema, options);

export default mongoose.model("Event", eventSchema);
