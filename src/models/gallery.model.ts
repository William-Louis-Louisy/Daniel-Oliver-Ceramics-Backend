import { Document, model, Model, Schema, Types } from "mongoose";

// Interface
export interface IGallery extends Document {
  _id: Types.ObjectId;
  name: string;
  location: string;
  website?: string;
  isPublished: boolean;
}

// Schema
const GallerySchema = new Schema<IGallery>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    location: {
      type: String,
      required: true,
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

export default model<IGallery, Model<IGallery>>("Gallery", GallerySchema);
