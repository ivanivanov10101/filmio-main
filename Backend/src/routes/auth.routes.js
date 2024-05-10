import { Router } from 'express';
import { OAuthSignIn, accountLoginHandler, accountRegistrationHandler, validateToken } from '../controllers/auth.controller.js';
import validate from '../middlewares/validator.middleware.js';
import { OAuthSchema, accountSignInSchema, accountSignUpSchema } from '../validators/auth.validator.js';
import verifyToken from '../middlewares/auth.middleware.js';

const expressRouter = Router();

expressRouter.route('/register').post(validate(accountSignUpSchema), accountRegistrationHandler);
expressRouter.route('/login').post(validate(accountSignInSchema), accountLoginHandler);
expressRouter.route('/google').post(validate(OAuthSchema), OAuthSignIn);

expressRouter.route('/validate-token').get(verifyToken, validateToken);

export { expressRouter as authorizationRoutes };
