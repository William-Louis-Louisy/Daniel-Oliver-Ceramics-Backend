import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { artworkController } from "../controllers/artwork.controller";

const artworkRouter = Router();

artworkRouter.use(requireAuth);

// CREATE ARTWORK
artworkRouter.post("/create-artwork", artworkController.createArtwork);
// CREATE MULTIPLE ARTWORKS
artworkRouter.post(
  "/create-multiple-artworks",
  artworkController.createMultipleArtworks
);
// RETRIEVE ARTWORKS
artworkRouter.get("/retrieve-artworks", artworkController.retrieveArtworks);
// RETRIEVE ARTWORKS BY COLLECTION
artworkRouter.get(
  "/retrieve-artworks-by-collection/:collectionId",
  artworkController.retrieveArtworksByCollection
);
// UPDATE ARTWORK BY ID
artworkRouter.put(
  "/update-artwork/:artworkId",
  artworkController.updateArtworkById
);
// DELETE ARTWORK BY ID
artworkRouter.delete(
  "/delete-artwork/:artworkId",
  artworkController.deleteArtworkById
);

export default artworkRouter;
