import { Document, model, Model, Schema, Types } from "mongoose";

// Interface
export interface IArtwork extends Document {
  _id: Types.ObjectId;
  image: string;
  artCollection: Types.ObjectId;
}

// Schema
const ArtworkSchema = new Schema<IArtwork>(
  {
    image: { type: String, required: true, trim: true },
    artCollection: {
      type: Schema.Types.ObjectId,
      ref: "ArtCollection",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<IArtwork, Model<IArtwork>>("Artwork", ArtworkSchema);
