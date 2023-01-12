import mongoose, { Schema, model } from "mongoose";

export interface EventVolunteer {
  id: string,
  name: string,
  registerNumber: number,
  college: string
}

const schema = new Schema<EventVolunteer>({
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
}, {
  autoCreate: true,
});

export default model<EventVolunteer>("EventVolunteer", schema);
