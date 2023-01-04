import mongoose from "mongoose";

const schema = {
  name: {
    type: String,
    required: true,
  },
  //required when slotting happens before all teams are registered and we have to map the slots to teams
  index: {
    type: Number,
    required: false,
    default: 0
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }],
  disqualified: {
    type: Boolean,
    required: true,
    default: false,
  },
};

const options = {
  autoCreate: true,
};

const teamSchema = new mongoose.Schema(schema, options);

export default mongoose.model("Team", teamSchema);
