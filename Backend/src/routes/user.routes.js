import { Router } from 'express';
import { deleteUser, getUser, getUsers, logoutUser, updateUser } from '../controllers/user.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const expressRouter = new Router();

// Public Routes....*:
expressRouter.route('/getuser/:userId').get(getUser);

// Private Routes....*:
expressRouter.route('/update/:userId').put(verifyToken, updateUser);
expressRouter.route('/delete/:userId').delete(verifyToken, deleteUser);
expressRouter.route('/logout/:userId').post(verifyToken, logoutUser);
expressRouter.route('/getusers').get(verifyToken, getUsers);

export { expressRouter as accountRoutes };
