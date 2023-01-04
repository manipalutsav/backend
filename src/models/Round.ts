import mongoose from "mongoose";
import { ROUND_STATUS } from "../utils/constants";

const schema = {
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  teams: [mongoose.Schema.Types.ObjectId],
  criteria: [String],
  slottable: {
    type: Boolean,
    required: true,
    default: true,
  },
  status: {
    type: Number,
    default: ROUND_STATUS.SCHEDULED,
  },
  published: {
    type: Boolean,
    default: false,
  },
};

const options = {
  autoCreate: true,
};

const roundSchema = new mongoose.Schema(schema, options);

export default mongoose.model("Round", roundSchema);
