import { Document, model, Model, Schema, Types } from "mongoose";

// Interface
export interface IContact extends Document {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
}

// Schema
const ContactSchema = new Schema<IContact>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IContact, Model<IContact>>("Contact", ContactSchema);
