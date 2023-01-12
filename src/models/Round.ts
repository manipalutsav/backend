import { ROUND_STATUS } from "../utils/constants";
import mongoose, { model, Schema } from "mongoose";

export interface Round {
  id: string,
  event: string,
  teams: [string],
  criteria: [string],
  slottable: boolean,
  status: number,
  published: boolean
}

const schema = new Schema<Round>({
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
}, {
  autoCreate: true,
});

export default model<Round>("Round", schema);
