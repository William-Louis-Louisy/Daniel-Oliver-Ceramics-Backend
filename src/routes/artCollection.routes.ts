import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { artCollectionController } from "../controllers/artCollection.controller";

const artCollectionRouter = Router();

// *** PUBLIC ROUTES ***
// RETRIEVE ART COLLECTIONS
artCollectionRouter.get(
  "/retrieve-art-collections",
  artCollectionController.retrieveArtCollections
);
// RETRIEVE PUBLISHED ART COLLECTIONS
artCollectionRouter.get(
  "/retrieve-published-art-collections",
  artCollectionController.retrievePublishedArtCollections
);
// RETRIEVE ART COLLECTION BY ID
artCollectionRouter.get(
  "/retrieve-art-collection/:artCollectionId",
  artCollectionController.retrieveArtCollectionById
);

// *** PROTECTED ROUTES ***
// CREATE ART COLLECTION
artCollectionRouter.post(
  "/create-art-collection",
  requireAuth,
  artCollectionController.createArtCollection
);
// UPDATE ART COLLECTION BY ID
artCollectionRouter.put(
  "/update-art-collection/:artCollectionId",
  requireAuth,
  artCollectionController.updateArtCollectionById
);
// DELETE ART COLLECTION BY ID
artCollectionRouter.delete(
  "/delete-art-collection/:artCollectionId",
  requireAuth,
  artCollectionController.deleteArtCollectionById
);

export default artCollectionRouter;
