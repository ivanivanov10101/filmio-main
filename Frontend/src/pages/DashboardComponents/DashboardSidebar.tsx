import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiUsers } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/storeHooks.ts";
import {
  deleteUserFailure,
  signoutUserSuccess,
} from "../../store/userSlice.ts";
import { handleAxiosError } from "../../utils/utils.ts";
import { Axios } from "../../config/api.ts";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { FaRegComments } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import {sidebarTheme} from "../../utils/themes.ts";

const DashboardSidebar = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState<string | null>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      await Axios.post(`/user/logout/${currentUser?._id}`);
      dispatch(signoutUserSuccess());
    } catch (error) {
      const err = await handleAxiosError(error);
      dispatch(deleteUserFailure(err));
    }
  };

  return (
    <Sidebar className="w-full md:w-56 shadow-lg dark:shadow-2xl" theme={sidebarTheme}>
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to={`/dashboard`}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={MdDashboard}
              labelColor="dark"
              className="cursor-pointer"
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to={`/dashboard?tab=profile`}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={IoPersonCircleOutline}
              label={currentUser?.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              className="cursor-pointer"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser?.isAdmin && (
            <Link to={`/dashboard?tab=posts`}>
              <Sidebar.Item
                active={tab === "posts"}
                icon={FaPencil}
                className="cursor-pointer"
                as="div"
              >
                Articles
              </Sidebar.Item>
            </Link>
          )}
          {currentUser?.isAdmin && (
            <Link to={`/dashboard?tab=users`}>
              <Sidebar.Item
                active={tab === "users"}
                icon={HiUsers}
                className="cursor-pointer"
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          {currentUser?.isAdmin && (
            <Link to={`/dashboard?tab=comments`}>
              <Sidebar.Item
                active={tab === "comments"}
                icon={FaRegComments}
                className="cursor-pointer"
                as="div"
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={ImExit}
            labelColor="dark"
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashboardSidebar;
