import { Request, Response } from "express";
import Gallery from "../models/gallery.model";
import { galleryValidator } from "../validators/gallery.validator";

// Gallery Controller
export const galleryController = {
  createGalleryItem: async function (req: Request, res: Response) {
    try {
      const parsed = galleryValidator.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
          code: i.code,
        }));
        return res.status(400).json({ error: "Validation failed", details });
      }

      const { name, location, website, isPublished } = parsed.data;

      const galleryItem = await Gallery.create({
        name,
        location,
        website,
        isPublished: isPublished ?? true,
      });

      res.status(201).json(galleryItem);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  retrieveGalleryItems: async function (req: Request, res: Response) {
    try {
      const galleryItems = await Gallery.find().sort({ name: 1 });

      res.status(200).json(galleryItems);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  updateGalleryItemById: async function (req: Request, res: Response) {
    const { galleryId } = req.params;
    const parsed = galleryValidator.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
        code: i.code,
      }));
      return res.status(400).json({ error: "Validation failed", details });
    }
    try {
      const updatedGalleryItem = await Gallery.findByIdAndUpdate(
        galleryId,
        parsed.data,
        { new: true, runValidators: true }
      );
      if (!updatedGalleryItem) {
        return res.status(404).json({ error: "Gallery item not found" });
      }

      res.status(200).json(updatedGalleryItem);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  deleteGalleryItemById: async function (req: Request, res: Response) {
    const { galleryId } = req.params;
    try {
      const deletedGalleryItem = await Gallery.findByIdAndDelete(galleryId);

      if (!deletedGalleryItem) {
        return res.status(404).json({ error: "Gallery item not found" });
      }

      res.status(200).json({ message: "Gallery item deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  retrievePublishedGalleries: async function (req: Request, res: Response) {
    try {
      const publishedGalleries = await Gallery.find({
        isPublished: true,
      }).sort({ name: 1 });

      res.status(200).json(publishedGalleries);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};
