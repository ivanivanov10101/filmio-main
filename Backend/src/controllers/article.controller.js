import Article from "../models/article.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import customError from "../utils/customErrorHandler.js";
import { slugTrimmer } from "../utils/utils.js";

export const articleCreationHandler = asyncHandler(
  async (request, response, next) => {
    const { title } = request.body;

    if (!request.user.isAdmin) {
      return next(
        new customError(
          403,
          "You need to be an admin in order to create an article.",
        ),
      );
    }

    const existingArticleTitle = await Article.findOne({ title });
    if (existingArticleTitle) {
      return next(
        new customError(403, "Choose an unique title for your article."),
      );
    }

    const slug = slugTrimmer(request.body.title);

    const newArticle = new Article({
      ...request.body,
      userId: request.user.id,
      slug,
    });
    const createdArticle = await newArticle.save();

    response
      .status(201)
      .json(
        new ApiResponse(
          201,
          { post: createdArticle },
          "Article successfully created.",
        ),
      );
  },
);

export const articleGetterHandler = asyncHandler(async (request, response) => {
  const {
    userId,
    searchTerm,
    title,
    slug,
    category,
    postId,
    sort,
    select,
    page,
    limit,
  } = request.query;
  let queryObject = {};
  let articleData;
  const filterOption = "i";

  userId && (queryObject.userId = { $regex: userId, $options: filterOption });
  category &&
    (queryObject.category = { $regex: category, $options: filterOption });
  category === "all" && delete queryObject.category;
  slug && (queryObject.slug = { $regex: slug, $options: filterOption });
  postId && (queryObject._id = postId);
  searchTerm && {
    $or: [
      (queryObject.title = { $regex: searchTerm, $options: filterOption }),
      (queryObject.content = { $regex: searchTerm, $options: filterOption }),
    ],
  };
  title && (queryObject.title = { $regex: title, $options: filterOption });
  articleData = Article.find(queryObject);

  if (sort) {
    let sortFix = sort.split(",").join(" ");
    const sortValue =
      sortFix === "desc"
        ? { createdAt: 1 }
        : sortFix === "asc"
          ? { createdAt: -1 }
          : sortFix;
    articleData = articleData.sort(sortValue);
  }

  if (select) {
    let selectFix = select.split(",").join(" ");
    articleData = articleData.select(selectFix);
  }

  let Page = +page || 1;
  let Limit = +limit || 9;
  let skip = (Page - 1) * Limit;
  const leftRange = skip + 1;
  const rightRange = Limit * Page || Limit;
  articleData = articleData.skip(skip).limit(Limit);

  const posts = await articleData;
  const totalPosts = await Article.countDocuments();

  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  );
  const lastMonthPosts = await Article.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  response.status(200).json(
    new ApiResponse(
      200,
      {
        posts,
        totalPosts,
        lastMonthPosts,
        pageNo: Page,
        itemRange: `${leftRange}-${rightRange}`,
        nbHits: posts.length,
      },
      "success",
    ),
  );
});

export const allArticlesGetterHandler = asyncHandler(
  async (request, response) => {
    const {
      userId,
      searchTerm,
      title,
      slug,
      category,
      postId,
      sort,
      select,
      page,
    } = request.query;
    let queryObject = {};
    let articleData;

    userId && (queryObject.userId = { $regex: userId, $options: "i" });
    category && (queryObject.category = { $regex: category, $options: "i" });
    category === "all" && delete queryObject.category;
    slug && (queryObject.slug = { $regex: slug, $options: "i" });
    postId && (queryObject._id = postId);
    searchTerm && {
      $or: [
        (queryObject.title = { $regex: searchTerm, $options: "i" }),
        (queryObject.content = { $regex: searchTerm, $options: "i" }),
      ],
    };
    title && (queryObject.title = { $regex: title, $options: "i" });
    articleData = Article.find(queryObject);

    if (sort) {
      let sortFix = sort.split(",").join(" ");
      const sortValue =
        sortFix === "desc"
          ? { createdAt: 1 }
          : sortFix === "asc"
            ? { createdAt: -1 }
            : sortFix;
      articleData = articleData.sort(sortValue);
    }

    if (select) {
      let selectFix = select.split(",").join(" ");
      articleData = articleData.select(selectFix);
    }

    let Page = +page || 1;
    let skip = Page - 1;
    articleData = articleData.skip(skip);

    const posts = await articleData;
    const totalPosts = await Article.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );
    const lastMonthPosts = await Article.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    response.status(200).json(
      new ApiResponse(
        200,
        {
          posts,
          totalPosts,
          lastMonthPosts,
          pageNo: Page,
          nbHits: posts.length,
        },
        "success",
      ),
    );
  },
);

export const articleDeletionHandler = asyncHandler(
  async (request, response, next) => {
    if (request.user.id !== request.params.userId) {
      return next(
        new customError(
          403,
          "You need to be logged in to delete this article.",
        ),
      );
    }

    await Article.findByIdAndDelete(request.params.postId);

    response
      .status(200)
      .json(new ApiResponse(200, {}, "The article has been deleted."));
  },
);

export const articleUpdatingHandler = asyncHandler(
  async (request, response, next) => {
    if (request.user.id !== request.params.userId) {
      return next(
        new customError(
          403,
          "You need to be logged in to update this article.",
        ),
      );
    }

    const slug = slugTrimmer(request.body.title);

    const updatedArticle = await Article.findByIdAndUpdate(
      request.params.postId,
      {
        $set: {
          title: request.body.title,
          slug,
          content: request.body.content,
          category: request.body.category,
          image: request.body.image,
        },
      },
      { new: true },
    );

    response
      .status(201)
      .json(
        new ApiResponse(
          201,
          updatedArticle,
          "post has been updated successfully",
        ),
      );
  },
);
