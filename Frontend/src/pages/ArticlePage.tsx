import { Link, useParams } from "react-router-dom";
import { Button } from "flowbite-react";
import { lazy } from "react";
const CommentSection = lazy(() => import("../components/CommentSection"));
import ArticleCard from "../components/ArticleCard.tsx";
import { getRecentArticles, getSingleArticle } from "../config/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import {useAppSelector} from "../store/storeHooks.ts";

export type Article = {
  _id: string;
  userId: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const ArticlePage = () => {
  const { postSlug } = useParams();
  // const { currentUser } = useAppSelector((state) => state.user);
  const { data: post } = useQuery({
    queryKey: [postSlug],
    queryFn: async () => {
      return await getSingleArticle(postSlug);
    },
  });

  const { data: recentArticles } = useQuery({
    queryKey: ["recentPosts"],
    queryFn: async () => {
      return await getRecentArticles();
    },
    placeholderData: keepPreviousData,
  });

  const articleLength = post?.content.length / 1000;
  const articleDate = new Date(post?.createdAt).toLocaleDateString();

  return (
    post && (
      <div className="px-6">
        <main className="flex flex-col max-w-6xl min-h-screen p-3 mx-auto my-8 drop-shadow-2xl bg-white dark:bg-[rgba(49,57,66,1)] rounded-2xl">
          <h2 className="p-3 mx-auto mt-6 font-semibold text-2xl md:text-4xl text-center">
            {post.title}
          </h2>
          <Link
            to={`/search?category=${post?.category}`}
            className="self-center mt-2"
          >
            <Button color="gray">{post.category}</Button>
          </Link>
          <img
            src={post.image}
            alt={post.slug}
            className="mt-6 p-2 max-h-[600px] w-full object-cover rounded-3xl"
          />
          <div className="flex justify-between w-full max-w-[52rem] p-3 border-b border-gray-600 mx-auto text-sm italic">
            <span>{articleDate}</span>
            <span>
              {articleLength > 2 ? (
                <p>{articleLength.toFixed(0)} mins to read</p>
              ) : (
                <p>{articleLength.toFixed(0)} min to read</p>
              )}
            </span>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="post-content w-full p-5 text-md mx-auto max-w-5xl"
          ></div>
          {/*{currentUser?.isAdmin ? (*/}
          {/*    <Button className="max-w-36 float-right">*/}
          {/*        <Link*/}
          {/*            to={`/update-post/${post._id}`}*/}
          {/*            className="flex:justify-center text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"*/}
          {/*        >*/}
          {/*            Edit this article*/}
          {/*        </Link>*/}
          {/*    </Button>*/}

          {/*) : null}*/}
          <div>
            <CommentSection postId={post._id} />
          </div>
        </main>
        <div className="flex flex-col items-center justify-center mb-14">
          <h1 className="flex flex-col items-center pb-1 mt-5 mb-2 text-2xl">
            Recent Articles <hr className="mx-auto mt-2 w-[25rem]" />
          </h1>

          <div className="flex flex-wrap justify-center mt-5 gap-7">
            {recentArticles &&
              recentArticles.map((recentArticle: Article) => (
                <ArticleCard key={recentArticle._id} article={recentArticle} />
              ))}
          </div>
        </div>
      </div>
    )
  );
};

export default ArticlePage;
