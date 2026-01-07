import { Request, Response } from "express";
import Exhibition from "../models/exhibition.model";
import { exhibitionValidator } from "../validators/exhibition.validator";

// Exhibition Controller
export const exhibitionController = {
  createExhibitionItem: async function (req: Request, res: Response) {
    try {
      const parsed = exhibitionValidator.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
          code: i.code,
        }));
        return res.status(400).json({ error: "Validation failed", details });
      }

      const { date, title, location, website, isPublished } = parsed.data;

      const exhibitionItem = await Exhibition.create({
        date,
        title,
        location,
        website,
        isPublished: isPublished ?? true,
      });

      res.status(201).json(exhibitionItem);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  retrieveExhibitionItems: async function (req: Request, res: Response) {
    try {
      const exhibitionItems = await Exhibition.find().sort({ createdAt: 1 });

      res.status(200).json(exhibitionItems);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  updateExhibitionItemById: async function (req: Request, res: Response) {
    const { exhibitionId } = req.params;
    const parsed = exhibitionValidator.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
        code: i.code,
      }));
      return res.status(400).json({ error: "Validation failed", details });
    }
    try {
      const updatedExhibitionItem = await Exhibition.findByIdAndUpdate(
        exhibitionId,
        parsed.data,
        { new: true, runValidators: true }
      );
      if (!updatedExhibitionItem) {
        return res.status(404).json({ error: "Exhibition item not found" });
      }

      res.status(200).json(updatedExhibitionItem);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  deleteExhibitionItemById: async function (req: Request, res: Response) {
    const { exhibitionId } = req.params;
    try {
      const deletedExhibitionItem = await Exhibition.findByIdAndDelete(
        exhibitionId
      );
      if (!deletedExhibitionItem) {
        return res.status(404).json({ error: "Exhibition item not found" });
      }
      res.status(200).json({ message: "Exhibition item deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  retrievePublishedExhibitions: async function (req: Request, res: Response) {
    try {
      const publishedExhibitions = await Exhibition.find({
        isPublished: true,
      }).sort({ createdAt: 1 });

      res.status(200).json(publishedExhibitions);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};
