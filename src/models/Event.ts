import mongoose, { model, Schema } from "mongoose";
import { College } from "./College";
import { Round } from "./Round";

export interface Event {
  id: string,
  _id?: string,
  rounds: string[],
  name: string,
  college: string,
  minMembersPerTeam: number,
  maxMembersPerTeam: number,
  maxTeamsPerCollege: number,
  venue: string,
  description: string,
  duration: number,
  startDate: Date,
  endDate: Date,
  faculty: boolean
}

const schema = new Schema<Event>({
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
}, {
  autoCreate: true,
});

export default model<Event>("Event", schema);