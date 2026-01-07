import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { contactController } from "../controllers/contact.controller";

const contactRouter = Router();

// SEND CONTACT EMAIL
contactRouter.post("/send-contact-email", contactController.sendMail);

// RETRIEVE CONTACTS (PROTECTED)
contactRouter.get(
  "/retrieve-contacts",
  requireAuth,
  contactController.retrieveContacts
);

export default contactRouter;
