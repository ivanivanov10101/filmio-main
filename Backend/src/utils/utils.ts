import Account from "../models/userModel.ts";
import backendErrors from "./backendErrorsHandler.ts";
import {CookieOptions} from "express";


export const generateTokens = async (userId: string | Object) => {
  try {
    const user: any = await Account.findById(userId); //TODO: FIX ANY
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error: any) {
    console.log(error.message);
    new backendErrors(500, error.message);
  }
};

export const accessTokenOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: 86400000,
};

export const refreshTokenOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: 864000000,
};

export const slugTrimmer = (title: string) => {
  return title
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();
};
