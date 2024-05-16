import { Link } from "react-router-dom";
import { useAppSelector } from "../store/storeHooks.ts";

const HomeTopBar = () => {
  const { currentUser: user } = useAppSelector((state) => state.user);
  return (
    <div className="flex flex-col gap-6 mx-auto object-cover m-10 ml-4 mr-4 rounded-md bg-cover [box-shadow:-0px_2px_6px_0px_rgba(0,0,0,0.75)] bg-[url('/assets/images/background_hero_compressed.webp')]">
      <div className="ml-8 mr-6 text-gray-50 py-6 [filter:drop-shadow(0px_3px_1px_#000000)]">
        <h1 className="mr-8 text-xl font-bold lg:text-xl inline">
          Welcome {user ? user?.fullName : "to Filmio!"}
        </h1>
        Categories:
        <Link
          to={`/search?searchTerm=&sort=asc&category=all`}
          className="max-w-[100px] ml-8 mr-12 text-xs font-bold text-[#63d052] sm:text-sm hover:no-underline hover:text-[#98e87b]"
        >
          All
        </Link>{" "}
        <Link
          to={`/search?searchTerm=&sort=asc&category=movies`}
          className="max-w-[100px] mr-12 text-xs font-bold text-[#63d052] sm:text-sm hover:no-underline hover:text-[#98e87b]"
        >
          Movies
        </Link>{" "}
        <Link
          to={`/search?searchTerm=&sort=asc&category=tvseries`}
          className="max-w-[100px] mr-12 text-xs font-bold text-[#63d052] sm:text-sm hover:no-underline hover:text-[#98e87b]"
        >
          TV-Series
        </Link>{" "}
        <Link
          to={`/search?searchTerm=&sort=asc&category=interviews`}
          className="max-w-[100px] mr-12 text-xs font-bold text-[#63d052] sm:text-sm hover:no-underline hover:text-[#98e87b]"
        >
          Interviews
        </Link>{" "}
        <Link
          to={`/search?searchTerm=&sort=asc&category=reviews`}
          className="max-w-[100px] mr-12 text-xs font-bold text-[#63d052] sm:text-sm hover:no-underline hover:text-[#98e87b]"
        >
          Reviews
        </Link>{" "}
        <Link
          to={`/search?searchTerm=&sort=asc&category=festivals`}
          className="max-w-[100px] mr-12 text-xs font-bold text-[#63d052] sm:text-sm hover:no-underline hover:text-[#98e87b]"
        >
          Festivals & Ceremonies
        </Link>
      </div>
    </div>
  );
};

export default HomeTopBar;
