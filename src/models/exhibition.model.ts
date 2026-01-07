import { Document, model, Model, Schema, Types } from "mongoose";

// Interface
export interface IExhibition extends Document {
  _id: Types.ObjectId;
  date: string;
  title: string;
  location?: string;
  website?: string;
  isPublished: boolean;
}

// Schema
const ExhibitionSchema = new Schema<IExhibition>(
  {
    date: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    location: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    website: {
      type: String,
      trim: true,
      minlength: 5,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<IExhibition, Model<IExhibition>>(
  "Exhibition",
  ExhibitionSchema
);
