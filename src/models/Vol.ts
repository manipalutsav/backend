import mongoose, { model, Schema } from "mongoose";

export interface Vol {
  id: string,
  college: string,
  name: string,
  regno: number,
  shirtSize: string
}

const schema = new Schema<Vol>({
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
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
}, {
  autoCreate: true,
});

export default model<Vol>("Vol", schema);
