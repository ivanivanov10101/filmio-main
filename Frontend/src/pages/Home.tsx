import Articles from "../components/Articles.tsx";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Article } from "./ArticlePage.tsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRecentArticles } from "../config/api.ts";
import "swiper/css/navigation";
import "../utils/index.css";
import CarouselElement from "../components/CarouselElement.tsx";
import HomeTopBar from "../components/HomeTopBar.tsx";

const Home = () => {
  const { data: articles } = useQuery({
    queryKey: ["carousel"],
    queryFn: async () => {
      return await getRecentArticles();
    },
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      <HomeTopBar />
      <div className="px-[4vw]">
        <Swiper
          modules={[Navigation]}
          navigation
          className="mySwiper max-h-[45rem] max-w-[75rem] w-full rounded-xl drop-shadow-lg shadow-lg"
        >
          {articles?.map((article: Article) => (
            <SwiperSlide key={article._id}>
              <CarouselElement key={article._id} article={article} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mt-12">
        <Articles category="movies" title="Movies" />
        <Articles category="tvseries" title="TV Series" />
        <Articles category="interviews" title="Interviews" />
        <Articles category="reviews" title="Reviews" />
        <Articles category="festivals" title="Festivals & Ceremonies" />
      </div>
    </div>
  );
};

export default Home;
