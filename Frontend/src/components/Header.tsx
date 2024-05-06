import {Avatar, Dropdown, Button, Navbar, TextInput, DarkThemeToggle} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/storeHooks.ts";
import {
  deleteUserFailure,
  signoutUserSuccess,
} from "../store/userSlice.ts";
import { FormEvent, useEffect, useState } from "react";
import { handleAxiosError } from "../utils/utils.ts";
import { Axios } from "../config/api.ts";
import { AiOutlineSearch } from "react-icons/ai";

const Header = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const location = useLocation();
  const path = useLocation().pathname;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      await Axios.post(`/user/logout/${currentUser?._id}`);
      dispatch(signoutUserSuccess());
      navigate("/");
    } catch (error) {
      const err = await handleAxiosError(error);
      dispatch(deleteUserFailure(err));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-4 [box-shadow:0_1px_18px_-5px_rgba(0,0,0,0.41)] dark:bg-[rgb(20,19,31)] dark:bg-[linear-gradient(90deg,_rgba(20,19,31,0.9669117647058824)_0%,_rgba(41,47,55,1)_37%,_rgba(10,33,37,1)_100%)]">
      <Link
        to={"/"}
        className="relative self-center inline-block text-sm font-semibold whitespace-nowrap sm:text-xl dark:text-white"
        aria-label="Home Page"
      >
        <div className="static inline-block w-[50px] pt-2 pl-2">
          <img src="/assets/images/logo.webp" alt="logo" />
        </div>
        <div className="relative inline-block left-3 text-3xl font-bold pb-1">
          Filmio
        </div>
      </Link>
      <form onSubmit={handleSubmit} className="w-auto">
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden sm:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <div className="flex gap-2 md:order-2">
        <DarkThemeToggle/>
        {currentUser ? (
          <Dropdown
            inline
            arrowIcon={false}
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full" />
            }
          >
            <Dropdown.Header>
              <span className="block">{currentUser.userName}</span>
              <span className="block font-medium">
                {currentUser.email}
              </span>
            </Dropdown.Header>

            <Link to={"/dashboard?tab=profile"} aria-label="Profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>

            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"} aria-label="Sign In">
            <Button className="text-white bg-[#63d052] hover:bg-[#81d973] focus:outline-none focus:ring-[#81d973] font-medium rounded-md text-sm py-0.5 text-center dark:bg-[#63d052] dark:hover:bg-[#63d052] dark:focus:ring-[#81d973]">
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"} aria-label="Home Page" className="no-underline hover:bg-gray-100 px-2 py-3 rounded-lg dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700">
            Home
          </Link>
        </Navbar.Link>
        {currentUser?.isAdmin && (
          <Navbar.Link active={path === "/create-post"} as={"div"}>
            <Link to={"/create-post"} aria-label="Create Post" className="border-none hover:bg-gray-100 px-2 py-3 rounded-lg dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700">
              Create
            </Link>
          </Navbar.Link>
        )}
        {currentUser?.isAdmin && (
            <Navbar.Link active={path === "/dashboard"} as={"div"}>
              <Link to={"dashboard"} aria-label="Dashboard" className="hover:bg-gray-100 px-2 py-3 rounded-lg dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700">
                Dashboard
              </Link>
            </Navbar.Link>
        )}
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"} aria-label="About Page" className="hover:bg-gray-100 px-2 py-3 rounded-lg dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700">
            About
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
