import Posts from "../components/Posts";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Post } from "./PostPage.tsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRecentPosts } from "../config/api.ts";

import "swiper/css/navigation";
import "../utils/index.css";
import CarouselElement from "../components/CarouselElement.tsx";
import HomeTopBar from "../components/HomeTopBar.tsx";

const Home = () => {
  const { data: posts } = useQuery({
    queryKey: ["carousel"],
    queryFn: async () => {
      return await getRecentPosts();
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
          {posts?.map((post: Post) => (
            <SwiperSlide key={post._id}>
              <CarouselElement key={post._id} post={post} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mt-12">
        <Posts category="movies" title="Movies" />
        <Posts category="tvseries" title="TV Series" />
        <Posts category="interviews" title="Interviews" />
        <Posts category="reviews" title="Reviews" />
        <Posts category="festivals" title="Festivals & Ceremonies" />
      </div>
    </div>
  );
};

export default Home;
