import { HiArrowNarrowUp, HiUsers } from "react-icons/hi";
import { FaRegComments } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/storeHooks.ts";
import { Post } from "../PostPage.tsx";
import { CommentType } from "../../components/CommentSection.tsx";
import { UserType } from "./DashboardUsers.tsx";
import { getComments, getPosts, getUsers } from "../../config/api.ts";
import { useQuery } from "@tanstack/react-query";

const DashboardMainPage = () => {
  const { currentUser } = useAppSelector((state) => state.user);

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await getUsers(currentUser);
    },
  });

  const { data: postsData } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      return await getPosts(currentUser);
    },
  });

  const { data: commentsData } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      return await getComments(currentUser);
    },
  });

  return (
    <div className="max-w-6xl p-5 md:mx-auto">
      <div className="rounded-md py-10 px-14">
        <h1 className="text-2xl font-bold pb-3">Statistics</h1>
        <div className="flex flex-wrap gap-4 justify-between ">
          <Link to={"/dashboard?tab=users"}>
            <div className="flex flex-col w-full gap-4 p-3 bg-white rounded-md shadow-md dark:bg-slate-800 md:w-72">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-500 uppercase text-md min-w-36">
                    Total Users
                  </h3>
                  <p className="text-2xl">{usersData?.totalUsers}</p>
                </div>
                <HiUsers className="p-3 text-5xl text-teal-600 drop-shadow-xl" />
              </div>
              <div className="flex gap-2 text-sm">
                <span
                  className={`flex items-center ${
                    usersData?.lastMonthUsers
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {usersData?.lastMonthUsers > 0 && <HiArrowNarrowUp />}
                  {usersData?.lastMonthUsers}
                </span>
                <div className="text-gray-500">Last month</div>
              </div>
            </div>
          </Link>
          <Link to={"/dashboard?tab=comments"}>
            <div className="flex flex-col w-full gap-4 p-3 rounded-md bg-white shadow-md dark:bg-slate-800 md:w-72">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-gray-500 uppercase text-md min-w-36">
                    Total Comments
                  </h3>
                  <p className="text-2xl">{commentsData?.totalComments}</p>
                </div>
                <FaRegComments className="p-3 text-5xl text-indigo-600 drop-shadow-lg" />
              </div>
              <div className="flex gap-2 text-sm">
                <span
                  className={`flex items-center ${
                    commentsData?.lastMonthComments
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {commentsData?.lastMonthComments > 0 && <HiArrowNarrowUp />}
                  {commentsData?.lastMonthComments}
                </span>
                <div className="text-gray-500">Last month</div>
              </div>
            </div>
          </Link>
          <Link to={"/dashboard?tab=posts"}>
            <div className="flex flex-col w-full gap-4 p-3 rounded-md shadow-md bg-white dark:bg-slate-800 md:w-72">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-gray-500 uppercase text-md min-w-36">
                    Total Posts
                  </h3>
                  <p className="text-2xl">{postsData?.totalPosts}</p>
                </div>
                <FaPencil className="p-3 text-5xl text-lime-600 drop-shadow-lg" />
              </div>
              <div className="flex gap-2 text-sm">
                <span
                  className={`flex items-center ${
                    postsData?.lastMonthPosts
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {postsData?.lastMonthPosts > 0 && <HiArrowNarrowUp />}
                  {postsData?.lastMonthPosts}
                </span>
                <div className="text-gray-500">Last month</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="max-w-6xl py-3 md:mx-auto">
        <div className="rounded-md py-8 px-14">
          <div className="text-2xl font-bold pb-3">Recents</div>
          <div className="flex flex-col flex-1 w-full p-2 my-4 rounded-md shadow-md bg-white md:w-auto dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
              <h1 className="p-2 text-center">Users</h1>
              <Button className="text-white bg-[#63d052] hover:bg-[#81d973] focus:outline-none focus:ring-[#81d973] font-medium rounded-md text-sm py-0.5 text-center dark:bg-[#63d052] dark:hover:bg-[#63d052] dark:focus:ring-[#81d973]">
                <Link to={"/dashboard?tab=users"}>See all</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>User image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
              </Table.Head>
              {usersData &&
                usersData.users.map((user: UserType) => (
                  <Table.Body key={user._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        <img
                          src={user.profilePicture}
                          alt="user"
                          className="w-10 h-10 bg-gray-500 rounded-full"
                        />
                      </Table.Cell>
                      <Table.Cell>{user.userName}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>
          <div className="flex flex-col flex-1 w-full p-2 my-4 rounded-md shadow-md bg-white md:w-auto dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
              <h1 className="p-2 text-center">Comments</h1>
              <Button className="text-white bg-[#63d052] hover:bg-[#81d973] focus:outline-none focus:ring-[#81d973] font-medium rounded-md text-sm py-0.5 text-center dark:bg-[#63d052] dark:hover:bg-[#63d052] dark:focus:ring-[#81d973]">
                <Link to={"/dashboard?tab=comments"}>See all</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Comment content</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
              </Table.Head>
              {commentsData &&
                commentsData.comments.map((comment: CommentType) => (
                  <Table.Body key={comment._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="w-96">
                        <p className="line-clamp-2">{comment.content}</p>
                      </Table.Cell>
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>
          <div className="flex flex-col flex-wrap flex-1 p-2 rounded-md shadow-md bg-white md:w-auto dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
              <h1 className="p-2 text-center">Posts</h1>
              <Button className="text-white bg-[#63d052] hover:bg-[#81d973] focus:outline-none focus:ring-[#81d973] font-medium rounded-md text-sm py-0.5 text-center dark:bg-[#63d052] dark:hover:bg-[#63d052] dark:focus:ring-[#81d973]">
                <Link to={"/dashboard?tab=posts"}>See all</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head className="[&>*]:text-center">
                <Table.HeadCell>Article image</Table.HeadCell>
                <Table.HeadCell>Article Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {postsData &&
                  postsData.posts.map((post: Post) => (
                    <Table.Row
                      key={post._id}
                      className=" bg-white dark:border-gray-700 dark:bg-gray-800 [&>*]:text-center"
                    >
                      <Table.Cell className="flex justify-center">
                        <Link to={`/post/${post.slug}`}>
                          <img
                            src={post.image}
                            alt="user"
                            className="h-10 bg-gray-500 rounded-md w-14"
                          />
                        </Link>
                      </Table.Cell>
                      <Table.Cell className="w-96">
                        <Link to={`/post/${post.slug}`}>{post.title}</Link>
                      </Table.Cell>
                      <Table.Cell className="w-5">{post.category}</Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMainPage;
