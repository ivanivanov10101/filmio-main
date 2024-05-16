import Account from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import customError from "../utils/customErrorHandler.js";
import {
  generateTokens,
  accessTokenOptions,
  refreshTokenOptions,
} from "../utils/utils.js";

export const accountRegistrationHandler = asyncHandler(
  async (request, response, next) => {
    const { fullName, userName, email, password } = request.body;

    const accountBody = await Account.findOne({
      $or: [{ userName }, { email }],
    });
    if (accountBody) {
      return next(
        new customError(
          409,
          "An account with this username or email already exists.",
        ),
      );
    }

    const singleUser = await Account.create({
      fullName,
      userName: userName.toLowerCase(),
      email,
      password,
    });

    return response
      .status(201)
      .json(
        new ApiResponse(
          200,
          { userId: singleUser._id },
          "Account created successfully.",
        ),
      );
  },
);

export const accountLoginHandler = asyncHandler(
  async (request, response, next) => {
    const { email, password } = request.body;

    const accountBody = await Account.findOne({ email });
    if (!accountBody) {
      return next(
        new customError(401, "The email you have used is incorrect."),
      );
    }

    const isPasswordCorrect = await accountBody.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return next(
        new customError(401, "The password you have used is incorrect."),
      );
    }

    const { accessToken, refreshToken } = await generateTokens(accountBody._id);
    const user = await Account.findById(accountBody._id).select(
      "-password -refreshToken",
    );

    return response
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken },
          "User logged in successfully",
        ),
      );
  },
);

export const OAuthSignIn = asyncHandler(async (request, response) => {
  const { name, email, googlePhotoUrl } = request.body;

  const accountBody = await Account.findOne({ email });

  if (accountBody) {
    accountBody.fullName = name;
    accountBody.profilePicture = googlePhotoUrl;

    await accountBody.save();

    const { accessToken, refreshToken } = await generateTokens(accountBody._id);
    const userRes = await Account.findById(accountBody._id).select(
      "-password -refreshToken",
    );

    response
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions)
      .json(
        new ApiResponse(
          200,
          { user: userRes, accessToken, refreshToken },
          "Google Account logged in successfully.",
        ),
      );
  } else {
    const password =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const userName =
      name.toLowerCase().split(" ").join("") +
      Math.random().toString(36).slice(-8);

    const newAccount = new Account({
      fullName: name,
      userName,
      email,
      password,
      profilePicture: googlePhotoUrl,
    });
    await newAccount.save();

    const { accessToken, refreshToken } = await generateTokens(newAccount._id);
    const singleUser = await Account.findById(newAccount._id).select(
      "-password -refreshToken",
    );

    response
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions)
      .json(
        new ApiResponse(
          200,
          { user: singleUser, accessToken, refreshToken },
          "Google Account logged in successfully.",
        ),
      );
  }
});

export const validateToken = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: req.user },
        "Account successfully validated.",
      ),
    );
});
