import { Router } from 'express';
import verifyToken from '../middlewares/auth.middleware.js';
import { articleCreationHandler, articleDeletionHandler, allArticlesGetterHandler, articleGetterHandler, articleUpdatingHandler } from '../controllers/article.controller.js';
import { createArticleSchema } from '../validators/article.validator.js';
import validate from '../middlewares/validator.middleware.js';

const expressRouter = Router();

expressRouter.route('/create').post(verifyToken, validate(createArticleSchema), articleCreationHandler);
expressRouter.route('/getposts').get(articleGetterHandler);
expressRouter.route('/getallposts').get(allArticlesGetterHandler);
expressRouter.route('/deletepost/:postId/:userId').delete(verifyToken, articleDeletionHandler);
expressRouter.route('/updatepost/:postId/:userId').put(verifyToken, articleUpdatingHandler);

export { expressRouter as newsArticleRoutes };
