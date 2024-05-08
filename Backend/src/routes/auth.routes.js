import { Router } from 'express';
import { googleSignIn, loginUser, registerUser, validateToken } from '../controllers/auth.controller.js';
import validate from '../middlewares/validator.middleware.js';
import { googleSchema, loginSchema, signupSchema } from '../validators/auth.validator.js';
import verifyToken from '../middlewares/auth.middleware.js';

const expressRouter = Router();

expressRouter.route('/register').post(validate(signupSchema), registerUser);
expressRouter.route('/login').post(validate(loginSchema), loginUser);
expressRouter.route('/google').post(validate(googleSchema), googleSignIn);

expressRouter.route('/validate-token').get(verifyToken, validateToken);

export { expressRouter as authorizationRoutes };
