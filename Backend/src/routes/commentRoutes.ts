import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import {
  commentCreationHandler,
  commentDeletingHandler,
  commentEditingHandler,
  allPostCommentHandler,
  postCommentHandler,
  commentLikesHandler,
} from "../controllers/commentsController.js";
import { commentCreationSchema } from "../validators/commentValidator.ts";
import validate from "../middlewares/validatorMiddleware.ts";

const expressRouter = Router();

expressRouter.route("/getPostComments/:postId").get(postCommentHandler);

expressRouter
  .route("/create")
  .post(verifyToken, validate(commentCreationSchema), commentCreationHandler);
expressRouter
  .route("/like-comment/:commentId")
  .put(verifyToken, commentLikesHandler);
expressRouter
  .route("/edit-comment/:commentId")
  .put(verifyToken, commentEditingHandler);
expressRouter
  .route("/delete-comment/:commentId")
  .delete(verifyToken, commentDeletingHandler);
expressRouter.route("/getAllComments").get(verifyToken, allPostCommentHandler);

export { expressRouter as userCommentRoutes };
