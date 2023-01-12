import mongoose, { model, Schema } from "mongoose";

export interface Leaderboard {
  id: string,
  college: string,
  points: number
}
const schema = new Schema<Leaderboard>({
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
}, {
  autoCreate: true,
});

export default model<Leaderboard>("Leaderboard", schema);