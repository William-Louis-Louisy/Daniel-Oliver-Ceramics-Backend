import { Request, Response } from "express";
import ArtCollection from "../models/artCollection.model";
import { artCollectionValidator } from "../validators/artCollection.validator";

// Art Collection Controller
export const artCollectionController = {
  createArtCollection: async function (req: Request, res: Response) {
    try {
      const parsed = artCollectionValidator.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.issues.map((i) => ({
          message: i.message,
          path: i.path,
          code: i.code,
        }));
        return res.status(400).json({ error: "Validation failed", details });
      }

      const { title, image, description, isPublished, translationKey } =
        parsed.data;

      const artCollection = await ArtCollection.create({
        title,
        image,
        description,
        isPublished: isPublished ?? true,
        translationKey,
      });

      res.status(201).json(artCollection);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  retrieveArtCollections: async function (req: Request, res: Response) {
    try {
      const artCollections = await ArtCollection.find().sort({ createdAt: -1 });

      res.status(200).json(artCollections);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  retrieveArtCollectionById: async function (req: Request, res: Response) {
    try {
      const { artCollectionId } = req.params;
      const artCollection = await ArtCollection.findById(
        artCollectionId
      ).populate({
        path: "artworks",
        options: { sort: { createdAt: -1 } },
      });
      if (!artCollection)
        return res.status(404).json({ error: "Art collection not found" });

      res.status(200).json(artCollection);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  updateArtCollectionById: async function (req: Request, res: Response) {
    const { artCollectionId } = req.params;
    const parsed = artCollectionValidator.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({
        message: i.message,
        path: i.path,
        code: i.code,
      }));
      return res.status(400).json({ error: "Validation failed", details });
    }
    try {
      const updatedArtCollection = await ArtCollection.findByIdAndUpdate(
        artCollectionId,
        parsed.data,
        { new: true, runValidators: true }
      );
      if (!updatedArtCollection) {
        return res.status(404).json({ error: "Art collection not found" });
      }

      res.status(200).json(updatedArtCollection);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  deleteArtCollectionById: async function (req: Request, res: Response) {
    const { artCollectionId } = req.params;
    try {
      const deletedArtCollection = await ArtCollection.findByIdAndDelete(
        artCollectionId
      );

      if (!deletedArtCollection) {
        return res.status(404).json({ error: "Art collection not found" });
      }

      res.status(200).json({ message: "Art collection deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  retrievePublishedArtCollections: async function (
    req: Request,
    res: Response
  ) {
    try {
      const publishedArtCollections = await ArtCollection.find({
        isPublished: true,
      }).sort({ createdAt: -1 });

      res.status(200).json(publishedArtCollections);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};
