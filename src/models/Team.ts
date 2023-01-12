import mongoose, { model, Schema } from "mongoose";

export interface Team {
  id: string,
  _id: string,
  name: string,
  index: number,
  event: string,
  college: string,
  members: [string],
  disqualified: boolean
}

const schema = new Schema<Team>({
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
}, {
  autoCreate: true,
});

export default model<Team>("Team", schema);
