import { Schema, model } from "mongoose";

interface CoreVolunteer {
  id: string,
  name: string,
  registerNumber: number,
  shirtSize: string,
  college: Schema.Types.ObjectId
}

const schema = new Schema<CoreVolunteer>({
  name: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: Number,
    required: true,
  },
  shirtSize: {
    type: String,
    required: true,
  },
  college: {
    type: Schema.Types.ObjectId,
    required: true,
  },
}, {
  autoCreate: true,
});

export default model<CoreVolunteer>("CoreVolunteer", schema);
