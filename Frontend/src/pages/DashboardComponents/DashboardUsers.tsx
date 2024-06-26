import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/storeHooks.ts";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { handleAxiosError } from "../../utils/utils.ts";
import { FaCheck } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { Axios } from "../../config/api.ts";

export type UserType = {
  _id: string;
  fullName: string;
  userName: string;
  email: string;
  profilePicture: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const DashboardUsers = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMoreLoading, setShowMoreLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data } = await Axios(`/user/getusers`);
        setUsers(data.data.users);
        if (data.data.users.length < 9) {
          setShowMore(false);
        } else {
          setShowMore(true);
        }
        setLoading(false);
      } catch (error) {
        const err = await handleAxiosError(error);
        console.log(err);
        setLoading(false);
      }
    };
    fetchArticles();
  }, [currentUser?._id]);

  const handleShowMore = async () => {
    setShowMoreLoading(true);
    const startIndex = users.length;
    try {
      const { data } = await Axios(`/user/getusers?startIndex=${startIndex}`);
      setUsers([...users, ...data.data.users]);
      if (data.posts.length < 9) {
        setShowMore(false);
      } else {
        setShowMore(true);
      }
      setShowMoreLoading(false);
    } catch (error) {
      const err = await handleAxiosError(error);
      console.log(err);
      setShowMoreLoading(false);
    }
  };

  // Delete User..
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      await Axios.delete(`/user/delete/${userIdToDelete}`);
      setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
    } catch (error) {
      const err = await handleAxiosError(error);
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="grid w-full min-h-screen place-content-center">
        <Spinner size={"xl"} />
      </div>
    );
  }

  return (
    <div className="p-3 overflow-x-scroll table-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && users && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <Table.Row
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.userName}
                      className="object-cover w-10 h-10 bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.userName}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-400" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 cursor-pointer hover:underline"
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && !showMoreLoading && (
            <button
              className="self-center w-full text-sm text-teal-500 py-7"
              onClick={handleShowMore}
            >
              Show more
            </button>
          )}
          {showMoreLoading && (
            <div className="grid w-full min-h-20 place-content-center">
              <Spinner size={"xl"} />
            </div>
          )}
        </>
      ) : (
        <p className="py-4">There aren't any accounts here!!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-5">
              <Button
                onClick={() => {
                  setShowModal(false);
                }}
                color="gray"
                outline
              >
                No
              </Button>
              <Button color="failure" onClick={handleDeleteUser}>
                Yes
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashboardUsers;
