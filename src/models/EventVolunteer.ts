import mongoose from "mongoose";

const schema = {
  name: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: Number,
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
};

const options = {
  autoCreate: true,
};
const eventVolunteerSchema = new mongoose.Schema(schema, options);

export default mongoose.model("EventVolunteer", eventVolunteerSchema);
