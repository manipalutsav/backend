import mongoose, { model, Schema } from "mongoose";

export interface Slot2 {
  id: string,
  number: number,
  round: string,
  college: string,
  team: string,
  teamName: string
}

const schema = new Schema<Slot2>({
  number: {
    type: Number,
    required: true,
  },
  round: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Round"
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: false,
  },
  teamName: {
    type: String,
    required: true,
  },
}, {
  autoCreate: true,
});

export default model<Slot2>("Slot2", schema);