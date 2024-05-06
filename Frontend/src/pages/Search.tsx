import { Button, Select, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Post } from "./PostPage";
import { handleAxiosError } from "../utils/utils";
import { Axios } from "../config/api";

type SidebarFiltersType = {
  searchTerm: string;
  sort: string;
  category: string;
};

const Search = () => {
  const [sidebarFilters, setSidebarFilters] = useState<SidebarFiltersType>({
    searchTerm: "",
    sort: "asc",
    category: "all",
  });
  const [articles, setArticles] = useState<Post[] | []>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [loadMoreArticles, setLoadMoreArticles] = useState<boolean>(false);
  const [showMoreArticles, setShowMoreArticles] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm");
    const sortData = urlParams.get("sort");
    const category = urlParams.get("category");
    if (searchTerm || sortData || category) {
      setSidebarFilters({
        ...sidebarFilters,
        ...(searchTerm?.length && { searchTerm: searchTerm }),
        ...(sortData?.length && { sort: sortData }),
        ...(category?.length && { category: category }),
      });
    }

    (async () => {
      setLoadingData(true);
      try {
        const searchQuery = urlParams.toString();
        const { data } = await Axios(`/post/getposts?${searchQuery}`);
        setArticles(data.data.posts);
        setPageNumber((prev) => prev + 1);
        if (data.data.posts.length === 9) {
          setShowMoreArticles(true);
        } else {
          setShowMoreArticles(false);
        }
        setLoadingData(false);
      } catch (error) {
        const err = await handleAxiosError(error);
        console.log(err);
        setLoadingData(false);
      }
    })();
  }, [location.search]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (e.target.id === "searchTerm") {
      setSidebarFilters({ ...sidebarFilters, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "asc";
      setSidebarFilters({ ...sidebarFilters, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "all";
      setSidebarFilters({ ...sidebarFilters, category });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    sidebarFilters.searchTerm &&
      urlParams.set("searchTerm", sidebarFilters.searchTerm);
    sidebarFilters.sort && urlParams.set("sort", sidebarFilters.sort);
    sidebarFilters.category && urlParams.set("category", sidebarFilters.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    setLoadMoreArticles(true);
    setPageNumber((prev) => prev + 1);
    try {
      const { data } = await Axios(`/post/getposts?page=${pageNumber}`);
      setArticles([...articles, ...data.data.posts]);
      if (data.data.posts.length === 9) {
        setShowMoreArticles(true);
      } else {
        setShowMoreArticles(false);
      }
      setLoadMoreArticles(false);
    } catch (error) {
      setLoadMoreArticles(false);
      return;
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 shadow-lg dark:shadow-2xl md:min-h-screen">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold">Filter:</h1>
          <div className="flex items-center gap-3">
            <h6 className="font-semibold whitespace-nowrap">
              Search for:
            </h6>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarFilters.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-3">
            <h6 className="font-semibold whitespace-nowrap">Sort by:</h6>
            <Select onChange={handleChange} value={sidebarFilters.sort} id="sort">
              <option value="asc">New</option>
              <option value="desc">Old</option>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <h6 className="font-semibold whitespace-nowrap">Category:</h6>
            <Select
              onChange={handleChange}
              value={sidebarFilters.category}
              id="category"
            >
              <option value="all">All</option>
              <option value="uncategorized">Uncategorized</option>
              <option value="movies">Movies</option>
              <option value="tvseries">TV Series</option>
              <option value="interviews">Interviews</option>
              <option value="reviews">Reviews</option>
              <option value="festivals">Festivals & Ceremonies</option>
            </Select>
          </div>
          <Button
            type="submit"
            className="text-white bg-[#63d052] focus:ring-[#63d052] rounded-md text-center dark:bg-[#63d052] dark:focus:ring-[#63d052]"
          >
            Filter articles
          </Button>
        </form>
      </div>
      <div className="w-full">
        <div className="flex flex-wrap gap-6 mb-5 p-8">
          {!loadingData && articles?.length === 0 && (
            <p className="text-neutral text-2xl">No articles found.</p>
          )}
          {!loadingData &&
            articles &&
            articles.map((article) => <PostCard key={article._id} post={article} />)}
          {showMoreArticles && !loadMoreArticles && (
            <Button
              className="self-center w-32 py-2 mt-4 mx-auto text-sm text-white focus:ring-[#63d052] bg-[#63d052]"
              onClick={handleShowMore}
            >
              Show more
            </Button>
          )}
          {loadMoreArticles && (
            <div className="grid w-full mt-6 place-content-center">
              <Spinner size={"md"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
