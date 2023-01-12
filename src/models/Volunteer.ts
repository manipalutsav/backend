import mongoose, { model, Schema } from "mongoose";

export interface Volunteer {
  id: string,
  college: string,
  list: {
    name: string,
    regno: number,
    shirtSize: string
  }[]
}

const schema = new Schema<Volunteer>({
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  list: [
    {
      name: {
        type: String,
        required: true,
      },
      regno: {
        type: Number,
        required: true,
      },
      shirtSize: {
        type: String,
      },
    },
  ],
}, {
  autoCreate: true,
});

export default model<Volunteer>("Volunteer", schema);
