import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import {
  articleCreationHandler,
  articleDeletionHandler,
  allArticlesGetterHandler,
  articleGetterHandler,
  articleUpdatingHandler,
} from "../controllers/articleController.js";
import { createArticleSchema } from "../validators/articleValidator.ts";
import validate from "../middlewares/validatorMiddleware.ts";

const expressRouter = Router();

expressRouter
  .route("/create")
  .post(verifyToken, validate(createArticleSchema), articleCreationHandler);
expressRouter.route("/getposts").get(articleGetterHandler);
expressRouter.route("/getallposts").get(allArticlesGetterHandler);
expressRouter
  .route("/deletepost/:postId/:userId")
  .delete(verifyToken, articleDeletionHandler);
expressRouter
  .route("/updatepost/:postId/:userId")
  .put(verifyToken, articleUpdatingHandler);

export { expressRouter as newsArticleRoutes };
