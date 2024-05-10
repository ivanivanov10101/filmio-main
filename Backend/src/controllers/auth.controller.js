import User from "../schemas/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import customError from "../utils/customErrorHandler.js";
import {
  generateAccessAndRefreshToken,
  accessTokenOptions,
  refreshTokenOptions,
} from "../utils/utils.js";

export const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, userName, email, password } = req.body;

  const userStatus = await User.findOne({ $or: [{ userName }, { email }] });
  if (userStatus) {
    return next(new customError(403, "User already exists in the database."));
  }

  const user = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    email,
    password,
  });

  // Response...
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { userId: user._id },
        "User successfully registered",
      ),
    );
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const validUser = await User.findOne({ email });
  if (!validUser) {
    return next(new customError(400, "Invalid Credentials"));
  }

  const isPasswordCorrect = await validUser.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return next(new customError(400, "Invalid Credentials"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    validUser._id,
  );
  const user = await User.findById(validUser._id).select(
    "-password -refreshToken",
  );
  console.log({ user, accessToken, refreshToken });

  // Response...
  return res
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
});

export const googleSignIn = asyncHandler(async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    user.fullName = name;
    if (
      user.profilePicture ===
      "https://lh3.googleusercontent.com/a/ACg8ocLdTdZtDEscAdPMDXdbDeSaCRX8SEziDhgiN_ZxpZFm=s96-c"
    ) {
      user.profilePicture = googlePhotoUrl;
    }
    await user.save();

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id,
    );
    const userRes = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions)
      .json(
        new ApiResponse(
          200,
          { user: userRes, accessToken, refreshToken },
          "user SignIn successfully",
        ),
      );
  } else {
    const password =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const userName =
      name.toLowerCase().split(" ").join("") +
      Math.random().toString(9).slice(-4);

    const newUser = new User({
      fullName: name,
      userName,
      email,
      password,
      profilePicture: googlePhotoUrl,
    });
    await newUser.save();

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      newUser._id,
    );
    const userRes = await User.findById(newUser._id).select(
      "-password -refreshToken",
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions)
      .json(
        new ApiResponse(
          200,
          { user: userRes, accessToken, refreshToken },
          "user SignIn successfully ",
        ),
      );
  }
});

export const validateToken = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, "user valid"));
});
