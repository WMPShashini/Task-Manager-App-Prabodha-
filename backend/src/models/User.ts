import mongoose, { Document, Schema } from "mongoose";

export interface ITeamUser extends Document {
  name: string;
  userId: string;
  email: string;
  phone: string;
  availableFrom: string;
  availableTo: string;
}

const teamUserSchema = new Schema<ITeamUser>(
  {
    name: { type: String, required: true, trim: true },
    userId: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    availableFrom: { type: String, required: true },
    availableTo: { type: String, required: true },
  },
  { timestamps: true }
);

teamUserSchema.index({ userId: 1 }, { unique: true });
 // ensure unique index

export default mongoose.model<ITeamUser>("TeamUser", teamUserSchema);
