import { Request, Response } from "express";
import ArtWork from "../models/artwork.model";
import { artworkValidator } from "../validators/artwork.validator";

const artworksArrayValidator = artworkValidator.array();

// Artwork Controller
export const artworkController = {
  createArtwork: async function (req: Request, res: Response) {
    try {
      const parsed = artworkValidator.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.issues.map((i) => ({
          message: i.message,
          path: i.path,
          code: i.code,
        }));
        return res.status(400).json({ error: "Validation failed", details });
      }

      const { image, artCollection } = parsed.data;

      const artwork = await ArtWork.create({
        image,
        artCollection,
      });

      res.status(201).json(artwork);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  createMultipleArtworks: async function (req: Request, res: Response) {
    try {
      const parsed = artworksArrayValidator.safeParse(req.body);

      if (!parsed.success) {
        const details = parsed.error.issues.map((i) => ({
          message: i.message,
          path: i.path,
          code: i.code,
        }));
        return res.status(400).json({ error: "Validation failed", details });
      }

      const artworksPayload = parsed.data;

      if (artworksPayload.length === 0) {
        return res
          .status(400)
          .json({ error: "No artworks provided for creation" });
      }

      // Check that all artworks belong to the same artCollection
      const firstCollection = artworksPayload[0].artCollection.toString();
      const allSameCollection = artworksPayload.every(
        (aw) => aw.artCollection.toString() === firstCollection
      );

      if (!allSameCollection) {
        return res.status(400).json({
          error:
            "All artworks must be linked to the same artCollection in bulk creation",
        });
      }

      // Create artworks in bulk
      const createdArtworks = await ArtWork.insertMany(artworksPayload);

      res.status(201).json(createdArtworks);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  retrieveArtworks: async function (req: Request, res: Response) {
    try {
      const artworks = await ArtWork.find()
        .populate("artCollection")
        .sort({ artCollection: -1 });

      res.status(200).json(artworks);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  retrieveArtworksByCollection: async function (req: Request, res: Response) {
    const { artCollectionId } = req.params;
    try {
      const artworks = await ArtWork.find({
        artCollection: artCollectionId,
      }).sort({ createdAt: -1 });

      res.status(200).json(artworks);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  updateArtworkById: async function (req: Request, res: Response) {
    const { artworkId } = req.params;
    const parsed = artworkValidator.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({
        message: i.message,
        path: i.path,
        code: i.code,
      }));
      return res.status(400).json({ error: "Validation failed", details });
    }
    try {
      const updatedArtwork = await ArtWork.findByIdAndUpdate(
        artworkId,
        parsed.data,
        { new: true, runValidators: true }
      );
      if (!updatedArtwork) {
        return res.status(404).json({ error: "Artwork not found" });
      }

      res.status(200).json(updatedArtwork);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  deleteArtworkById: async function (req: Request, res: Response) {
    const { artworkId } = req.params;
    try {
      const deletedArtwork = await ArtWork.findByIdAndDelete(artworkId);

      if (!deletedArtwork) {
        return res.status(404).json({ error: "Artwork not found" });
      }

      res.status(200).json({ message: "Artwork deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};
