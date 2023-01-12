import mongoose, { model, Schema } from "mongoose";

export interface Slot {
  id: string,
  number: number,
  round: string,
  team: string
}

const schema = new Schema<Slot>({
  number: {
    type: Number,
    required: true,
  },
  round: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
}, {
  autoCreate: true,
});

export default model<Slot>("Slot", schema);
