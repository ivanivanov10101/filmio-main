import { Link } from "react-router-dom";
import { useAppSelector } from "../store/storeHooks";
import Posts from "../components/Posts";
// import { Carousel } from "flowbite-react";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import { Axios } from "../config/api.ts";
// import {handleAxiosError} from "../utils/utils.ts";
// import { Post } from "./PostPage.tsx";
// import CarouselSlide from "../components/CarouselSlide.tsx";

const Home = () => {
  const { currentUser: user } = useAppSelector((state) => state.user);

  // const { data: posts } = useQuery({
  //   queryKey: ["carousel_posts"],
  //   queryFn: async () => {
  //     try {
  //       const { data } = await Axios(`/post/getallposts`);
  //       return data.data.posts.reverse().slice(0, 9);
  //     } catch (error) {
  //       const err = await handleAxiosError(error);
  //       console.log(err);
  //       return err;
  //     }
  //   },
  //   placeholderData: keepPreviousData,
  // });

  return (
    <div>
      <div className="flex flex-col gap-6 px-3 py-10 mx-auto md:py-28 object-cover m-10 ml-4 mr-4 rounded-md bg-cover [box-shadow:-0px_2px_6px_0px_rgba(0,0,0,0.75)] bg-[url('/assets/images/background_hero_compressed.webp')]">
        <div className="ml-8 text-gray-50 py-4 [filter:drop-shadow(0px_3px_1px_#000000)]">
          <h1 className="text-3xl font-bold lg:text-6xl pb-6">
            Welcome {user ? user?.fullName : "to Filmio!"}
          </h1>
          <p className="text-xs sm:text-sm">
            Find the latest news from Hollywood and across the world here.
          </p>
          <Link
            to={`/search?sort=asc`}
            className="max-w-[100px] text-xs font-bold text-[#63d052] sm:text-sm hover:no-underline hover:text-[#98e87b]"
          >
            View all articles
          </Link>
        </div>
      </div>
      {/*<div className="h-96">*/}
      {/*  <Carousel*/}
      {/*    className="flex flex-col max-w-[73rem] mx-auto mt-8 rounded-lg [box-shadow:-0px_2px_6px_0px_rgba(0,0,0,0.75)]"*/}
      {/*    theme={carouselTheme}*/}
      {/*  >*/}
      {/*    {posts?.map((post: Post) => (*/}
      {/*      <CarouselSlide key={post._id} post={post} />*/}
      {/*    ))}*/}
      {/*  </Carousel>*/}
      {/*</div>*/}
      <div className="mt-12">
        <Posts category="all" title="All Sources" />
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
