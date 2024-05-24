import Comments from "../models/commentModel.ts";
import APIResponse from "../utils/APIResponse.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import backendErrors from "../utils/backendErrorsHandler.ts";

export const commentCreationHandler = asyncHandler(
  async (request, response, next) => {
    const { content, postId, userId } = request.body;

    if (userId !== request.user.id) {
      return next(
        new backendErrors(403, "You need to be logged in to create a comment."),
      );
    }

    const currentComment = new Comments({
      postId,
      userId,
      content,
    });

    const newComment = await currentComment.save();

    response
      .status(200)
      .send(
        new APIResponse(
          200,
          newComment,
          "Comment has been posted successfully.",
        ),
      );
  },
);

export const postCommentHandler = asyncHandler(async (request, response) => {
  const comments = await Comments.find({ postId: request.params.postId }).sort({
    createdAt: -1,
  });

  response
    .status(200)
    .send(new APIResponse(200, comments, "Comments fetched successfully."));
});

export const allPostCommentHandler = asyncHandler(
  async (request, response, next) => {
    if (!request.user.isAdmin) {
      return next(
        new backendErrors(403, "You need to be an admin to get all posts."),
      );
    }

    const startIndex = parseInt(request.query.startIndex) || 0;
    const limit = parseInt(request.query.limit) || 9;
    const sortDirection = request.query.sort === "desc" ? -1 : 1;

    const comments = await Comments.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comments.countDocuments();

    const currentDate = new Date();
    const oneMonthAgo = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate(),
    );
    const lastMonthComments = await Comments.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    response
      .status(200)
      .json(
        new APIResponse(
          200,
          { comments, totalComments, lastMonthComments },
          "All comments fetched succesfully.",
        ),
      );
  },
);

export const commentLikesHandler = asyncHandler(
  async (request, response, next) => {
    const commentBody = await Comments.findById(request.params.commentId);

    if (!commentBody) {
      return next(new backendErrors(404, "Comment does not exist."));
    }

    const accountIndex = commentBody.likes.indexOf(request.user.id);
    if (accountIndex === -1) {
      commentBody.numberOfLikes += 1;
      commentBody.likes.push(request.user.id);
    } else {
      commentBody.numberOfLikes -= 1;
      commentBody.likes.splice(accountIndex, 1);
    }

    await commentBody.save();

    response
      .status(200)
      .json(new APIResponse(200, commentBody, "Comment Likes Updated"));
  },
);

export const commentEditingHandler = asyncHandler(
  async (request, response, next) => {
    const commentBody = await Comments.findById(request.params.commentId);
    if (!commentBody) {
      return next(new backendErrors(404, "Comment does not exist."));
    }

    if (commentBody.userId !== request.user.id) {
      return next(
        new backendErrors(
          403,
          "You need to be logged in to edit this comment.",
        ),
      );
    }

    const editedComment = await Comments.findByIdAndUpdate(
      request.params.commentId,
      { content: request.body.content },
      { new: true },
    );

    response
      .status(200)
      .json(new APIResponse(200, editedComment, "Comment content updated."));
  },
);

export const commentDeletingHandler = asyncHandler(
  async (request, response, next) => {
    const comment = await Comments.findById(request.params.commentId);
    if (!comment) {
      return next(new backendErrors(404, "Comment has already been deleted."));
    }
    if (comment.userId !== request.user.id && !request.user.isAdmin) {
      return next(
        new backendErrors(
          403,
          "You need to be logged in as an admin to delete comments.",
        ),
      );
    }

    await Comments.findByIdAndDelete(request.params.commentId);

    response.status(200).json(new APIResponse(200, null, "Comment deleted."));
  },
);
