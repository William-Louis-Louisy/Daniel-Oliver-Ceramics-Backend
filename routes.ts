import { Application } from "express";
import userRouter from "./src/routes/user.routes";
import artCollectionRouter from "./src/routes/artCollection.routes";
import artworkRouter from "./src/routes/artwork.routes";
import exhibitionRouter from "./src/routes/exhibition.routes";
import galleryRouter from "./src/routes/gallery.routes";
import contactRouter from "./src/routes/contact.routes";

export function setupRoutes(app: Application) {
  app.use(userRouter);
  app.use(artCollectionRouter);
  app.use(exhibitionRouter);
  app.use(galleryRouter);
  app.use(artworkRouter);
  app.use(contactRouter);
}
