import { Article } from "../pages/ArticlePage.tsx";
import { getAllArticlesCategory } from "../config/api";
import ArticleCard from "./ArticleCard.tsx";
import { Link } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import PostCardSkeleton from "./PostCardSkeleton";
import "swiper/css";
import "swiper/css/pagination";

type PropsType = {
  category: string;
  title: string;
};

const Articles = ({ category, title }: PropsType) => {
  const { isLoading, data: articles } = useQuery({
    queryKey: [category],
    queryFn: async () => {
      return await getAllArticlesCategory(category);
    },
    placeholderData: keepPreviousData,
  });
  return (
    <>
      <div className="flex flex-col max-w-[75rem] p-1 gap-8 mx-auto">
        {isLoading ? (
          <div className="flex flex-col gap-6 mx-auto">
            <div className="flex items-center justify-between px-3">
              <h2 className="text-3xl font-bold">
                {title}
                <hr className="w-full mt-2" />
              </h2>
              <Link
                to={`/search`}
                className="text-lg text-center text-[#63d052] hover:text-[#98e87b]"
              >
                View all articles
              </Link>
            </div>
            <PostCardSkeleton cards={3} />
          </div>
        ) : (
          articles &&
          articles.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-6">
                <h2 className="text-3xl font-bold">{title}</h2>
                <Link
                  to={`/search?sort=asc&category=${category}`}
                  className="text-lg text-center text-[#63d052] hover:no-underline hover:text-[#98e87b]"
                >
                  View all articles
                </Link>
              </div>
              <div className="flex flex-wrap justify-between gap-4 pb-4 ml-4 mr-4">
                <Swiper
                  pagination={{
                    clickable: true,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 30,
                    },
                  }}
                  modules={[Pagination]}
                  className="mySwiper h-[26.5rem]"
                >
                  {articles?.map((article: Article) => (
                    <SwiperSlide key={article._id}>
                      <ArticleCard key={article._id} article={article} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Articles;
