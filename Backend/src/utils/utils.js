import Account from "../models/user.model.js";
import backendErrors from "./backendErrorsHandler.js";

export const generateTokens = async (userId) => {
  try {
    const user = await Account.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error.message);
    new backendErrors(500, error.message);
  }
};

export const accessTokenOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: 86400000,
};

export const refreshTokenOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: 864000000,
};

export const slugTrimmer = (title) => {
  return title
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();
};
