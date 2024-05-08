import { Router } from 'express';
import verifyToken from '../middlewares/auth.middleware.js';
import { createPost, deletePost, getAllPosts, getPosts, updatePost } from '../controllers/post.controller.js';
import { createPostSchema } from '../validators/post.valodator.js';
import validate from '../middlewares/validator.middleware.js';

const expressRouter = Router();

expressRouter.route('/create').post(verifyToken, validate(createPostSchema), createPost);
expressRouter.route('/getposts').get(getPosts);
expressRouter.route('/getallposts').get(getAllPosts);
expressRouter.route('/deletepost/:postId/:userId').delete(verifyToken, deletePost);
expressRouter.route('/updatepost/:postId/:userId').put(verifyToken, updatePost);

export { expressRouter as newsArticleRoutes };
