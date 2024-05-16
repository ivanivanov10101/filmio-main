import { Link } from "react-router-dom";
import { Article } from "../pages/ArticlePage.tsx";
import { Button } from "flowbite-react";

type PropsType = {
  article: Article;
};

const ArticleCard = ({ article }: PropsType) => {
  return (
    <div className="group relative w-full mb-10 shadow-md bg-white dark:bg-[#202a2e] dark:[box-shadow:3px_3px_10px_1px_rgba(0,0,0,0.41)] h-[360px] sm:w-[360px] overflow-hidden transition-all rounded-[0.5rem] mx-0.5">
      <Link to={`/post/${article.slug}`}>
        <img
          src={article.image}
          alt="post cover"
          className="h-[220px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="flex flex-col gap-2 p-3">
        <Link to={`/post/${article.slug}`}>
          <p className="text-base font-semibold line-clamp-2">{article.title}</p>
        </Link>
        <span className="text-sm italic">
          <Link to={`/search?sort=asc&category=${article.category}`}>
            <Button color="light" size={"xs"}>
              {article.category}
            </Button>
          </Link>
        </span>

        <Link
          to={`/post/${article.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-[#63d052] text-[#63d052] hover:bg-[#63d052] hover:text-white transition-all duration-300 text-center py-2 rounded-md  m-2"
        >
          Read article
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
