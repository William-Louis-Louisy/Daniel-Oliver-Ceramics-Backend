import { Document, model, Model, Schema, Types } from "mongoose";

// Interface
export interface IArtCollection extends Document {
  _id: Types.ObjectId;
  title: string;
  image: string;
  description?: string;
  isPublished: boolean;
  translationKey?: string;
}

// Schema
const ArtCollectionSchema = new Schema<IArtCollection>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    image: { type: String, required: true, trim: true },
    description: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: true,
    },
    translationKey: { type: String, trim: true, unique: true },
  },
  { timestamps: true, versionKey: false }
);

ArtCollectionSchema.virtual("artworks", {
  ref: "Artwork",
  localField: "_id",
  foreignField: "artCollection",
  justOne: false,
});

ArtCollectionSchema.set("toJSON", { virtuals: true });
ArtCollectionSchema.set("toObject", { virtuals: true });

const ArtCollection = model<IArtCollection, Model<IArtCollection>>(
  "ArtCollection",
  ArtCollectionSchema
);

export default ArtCollection;
