import Account from "../models/user.model.js";
import backendErrors from "../utils/backendErrorsHandler.js";
import jwt from "jsonwebtoken";

const verifyToken = async (request, _, next) => {
  try {
    const currentAccessToken = request.cookies?.accessToken;
    if (!currentAccessToken) {
      return next(new backendErrors(401, "Unauthorized Access Token"));
    }

    const jwtVerifyToken = jwt.verify(currentAccessToken, process.env.ACCESS_TOKEN_SECRET);

    const accountExists = await Account.findById(jwtVerifyToken._id).select(
      "-password -refreshToken",
    );
    if (!accountExists) {
      return next(new backendErrors(401, "Invalid Access Token"));
    }

    request.user = accountExists;
    next();
  } catch (error) {
    return new backendErrors(401, "Invalid access token");
  }
};

export default verifyToken;
