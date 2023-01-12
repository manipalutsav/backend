import mongoose, { model, Schema } from "mongoose";

export interface Score {
  id: string,
  team: string,
  round: string,
  judges?: {
    id: string,
    points: [number]
  }[],
  overtime: number,
  points: number
}

const schema = new Schema<Score>({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot2',
    required: true,
  },
  round: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  judges: [
    {
      id: mongoose.Schema.Types.ObjectId,
      points: [Number],
    },
  ],
  overtime: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  autoCreate: true,
});

schema.virtual("points").get((score: Score) =>
  score.judges!.reduce((acc, curr) => acc + curr.points.reduce((a, c) => a + c, 0), 0)
);

export default model<Score>("Score", schema);
