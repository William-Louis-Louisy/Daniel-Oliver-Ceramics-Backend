import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { galleryController } from "../controllers/gallery.controller";

const galleryRouter = Router();

// *** PUBLIC ROUTES ***
// RETRIEVE GALLERY ITEMS
galleryRouter.get(
  "/retrieve-gallery-items",
  galleryController.retrieveGalleryItems
);
// RETRIEVE PUBLISHED GALLERY ITEMS
galleryRouter.get(
  "/retrieve-published-gallery-items",
  galleryController.retrievePublishedGalleries
);

// *** PROTECTED ROUTES ***
// CREATE GALLERY ITEM
galleryRouter.post(
  "/create-gallery-item",
  requireAuth,
  galleryController.createGalleryItem
);

// UPDATE GALLERY ITEM BY ID
galleryRouter.put(
  "/update-gallery-item/:galleryId",
  requireAuth,
  galleryController.updateGalleryItemById
);
// DELETE GALLERY ITEM BY ID
galleryRouter.delete(
  "/delete-gallery-item/:galleryId",
  requireAuth,
  galleryController.deleteGalleryItemById
);

export default galleryRouter;
