import { Router } from 'express';
import verifyToken from '../middlewares/auth.middleware.js';
import {
    createComment,
    deleteComment,
    editComment,
    getAllComments,
    getPostComments,
    likeComment,
} from '../controllers/comment.controller.js';
import { createCommentSchema } from '../validators/comment.validator.js';
import validate from '../middlewares/validator.middleware.js';

const expressRouter = new Router();

// Public routes....*:
expressRouter.route('/getPostComments/:postId').get(getPostComments);

// Private routes....*:
expressRouter.route('/create').post(verifyToken, validate(createCommentSchema), createComment);
expressRouter.route('/like-comment/:commentId').put(verifyToken, likeComment);
expressRouter.route('/edit-comment/:commentId').put(verifyToken, editComment);
expressRouter.route('/delete-comment/:commentId').delete(verifyToken, deleteComment);
expressRouter.route('/getAllComments').get(verifyToken, getAllComments);

export { expressRouter as userCommentRoutes };
