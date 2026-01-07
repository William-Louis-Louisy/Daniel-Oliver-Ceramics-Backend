import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { exhibitionController } from "../controllers/exhibition.controller";

const exhibitionRouter = Router();

// *** PUBLIC ROUTES ***
// RETRIEVE EXHIBITIONS
exhibitionRouter.get(
  "/retrieve-exhibitions",
  exhibitionController.retrieveExhibitionItems
);
// RETRIEVE PUBLISHED EXHIBITIONS
exhibitionRouter.get(
  "/retrieve-published-exhibitions",
  exhibitionController.retrievePublishedExhibitions
);

// *** PROTECTED ROUTES ***
// CREATE EXHIBITION
exhibitionRouter.post(
  "/create-exhibition",
  requireAuth,
  exhibitionController.createExhibitionItem
);

// UPDATE EXHIBITION BY ID
exhibitionRouter.put(
  "/update-exhibition/:exhibitionId",
  requireAuth,
  exhibitionController.updateExhibitionItemById
);
// DELETE EXHIBITION BY ID
exhibitionRouter.delete(
  "/delete-exhibition/:exhibitionId",
  requireAuth,
  exhibitionController.deleteExhibitionItemById
);

export default exhibitionRouter;
