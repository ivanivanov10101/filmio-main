import { Router } from "express";
import {
  deleteAccount,
  getAccount,
  getAccounts,
  logOutAccount,
  updateAccount,
} from "../controllers/accountsController.js";
import verifyToken from "../middlewares/auth.middleware.js";

const expressRouter = Router();

// Public Routes....*:
expressRouter.route("/getuser/:userId").get(getAccount);

// Private Routes....*:
expressRouter.route("/update/:userId").put(verifyToken, updateAccount);
expressRouter.route("/delete/:userId").delete(verifyToken, deleteAccount);
expressRouter.route("/logout/:userId").post(verifyToken, logOutAccount);
expressRouter.route("/getusers").get(verifyToken, getAccounts);

export { expressRouter as accountRoutes };
