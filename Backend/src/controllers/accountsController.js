import Account from "../models/user.model.js";
import APIResponse from "../utils/APIResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import backendErrors from "../utils/backendErrorsHandler.js";
import { accessTokenOptions, refreshTokenOptions } from "../utils/utils.js";

export const updateAccount = asyncHandler(async (request, response, next) => {
  const { userName, email, password, profilePicture } = request.body;
  console.log({ userName, email, password, profilePicture });

  if (request.user.id !== request.params.userId) {
    return next(new backendErrors(403, "You cannot change this account."));
  }

  const account = await Account.findById(request.params.userId);

  if (userName) {
    if (userName.length < 8) {
      return next(
        new backendErrors(
          400,
          "Your username must be at least 8 characters long.",
        ),
      );
    }
    if (userName.includes(" ")) {
      return next(
        new backendErrors(400, "Your username cannot contain any spaces."),
      );
    }
    if (!userName.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        new backendErrors(
          400,
          "Your username cannot contain any non-alphanumeric characters.",
        ),
      );
    }
    const doesUsernameExist = await Account.findOne({
      userName: userName.toLowerCase(),
    });
    if (doesUsernameExist) {
      const isUsernameAvailable =
        doesUsernameExist.userName === account.userName;
      if (!isUsernameAvailable) {
        return next(new backendErrors(400, "This username already exists."));
      }
    }
    account.userName = userName.toLowerCase();
  }

  if (email) {
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{1,6}$/)) {
      return next(new backendErrors(400, "Your email address is not valid."));
    }
    if (email.length < 3) {
      return next(new backendErrors(400, "Your email address must be at least 3 characters long."));
    }
    const doesEmailExist = await Account.findOne({ email: email });
    if (doesEmailExist) {
      const isEmailAvailable = doesEmailExist.email === account.email;
      if (!isEmailAvailable) {
        return next(new backendErrors(400, "This email address already exists."));
      }
    }
    account.email = email;
  }

  if (password) {
    if (password.length < 8) {
      return next(
        new backendErrors(400, "Your password must be at least 6 characters long."),
      );
    }
    account.password = password;
  }

  if (profilePicture) {
    account.profilePicture = profilePicture;
  }

  const updatedUser = await account.save();
  console.log(updateAccount);

  return response
    .status(200)
    .json(new APIResponse(200, { updatedUser }, "Account successfully updated."));
});

export const deleteAccount = asyncHandler(async (request, response, next) => {
  if (!request.user.isAdmin && request.user.id !== request.params.userId) {
    return next(
      new backendErrors(403, "You cannot delete this account."),
    );
  }
  const deletedAccount = await Account.findByIdAndDelete(request.params.userId);
  if (!deletedAccount) {
    return next(new backendErrors(403, "An error has occurred during account deletion.."));
  }

  if (request.user.isAdmin && request.user.id !== request.params.userId) {
    response.status(200).json(new APIResponse(200, {}, "This account has been deleted."));
  } else {
    response
      .status(200)
      .clearCookie("accessToken", accessTokenOptions)
      .clearCookie("refreshToken", refreshTokenOptions)
      .json(new APIResponse(200, {}, "This account has been deleted."));
  }
});

export const logOutAccount = asyncHandler(async (request, response, next) => {
  if (request.user.id !== request.params.userId) {
    return next(
      new backendErrors(403, "You are not allowed to log this account out."),
    );
  }

  await Account.findByIdAndUpdate(request.user._id, {
    $unset: { refreshToken: 1 },
  });

  response
    .status(200)
    .clearCookie("accessToken", accessTokenOptions)
    .clearCookie("refreshToken", refreshTokenOptions)
    .json(
      new APIResponse(
        200,
        { userId: request.user._id },
        "user has been signed out",
      ),
    );
});

export const getAccounts = asyncHandler(async (request, response, next) => {
  if (!request.user.isAdmin) {
    return next(new backendErrors(403, "You need to be an admin to access accounts."));
  }

  const startIndex = parseInt(request.query.startIndex) || 0;
  const limit = parseInt(request.query.limit) || 9;
  const sortingType = request.query.sort === "asc" ? 1 : -1;

  const users = await Account.find()
    .sort({ createdAt: sortingType })
    .skip(startIndex)
    .limit(limit)
    .select("-password");

  const totalUsers = await Account.countDocuments();

  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  );
  const lastMonthUsers = await Account.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  return response
    .status(200)
    .json(new APIResponse(200, { users, totalUsers, lastMonthUsers }, "Users"));
});

export const getAccount = asyncHandler(async (request, response, next) => {
  const accountExists = await Account.findById(request.params.userId).select(
    "-password -email -refreshToken",
  );
  if (!accountExists) {
    return next(new backendErrors(404, "Account has not been found."));
  }

  response.status(200).json(new APIResponse(200, accountExists, "Login successful."));
});
