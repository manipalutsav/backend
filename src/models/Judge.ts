import mongoose, { model, Schema } from "mongoose";

export interface Judge {
  id: string,
  name: string,
  rounds: [string]
}

const schema = new Schema<Judge>({
  name: {
    type: String,
    required: true,
  },
  rounds: [mongoose.Schema.Types.ObjectId],
}, {
  autoCreate: true,
});

export default model<Judge>("Judge", schema);