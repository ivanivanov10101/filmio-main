import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/storeHooks.ts";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { handleAxiosError } from "../../utils/utils.ts";
import { Axios } from "../../config/api.ts";

type Article = {
  _id: string;
  userId: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const DashboardArticles = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMoreLoading, setShowMoreLoading] = useState<boolean>(false);
  const [userArticles, setUserArticles] = useState<Article[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [articleID, setArticleID] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await Axios(
          `/post/getposts?userId=${currentUser?._id}`,
        );
        setUserArticles(data.data.posts);
        if (data.data.posts.length < 9) {
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
    setPageNumber((prev) => prev + 1);
    fetchPosts();
  }, [currentUser?._id]);

  const handleShowMore = async () => {
    setShowMoreLoading(true);
    setPageNumber((prev) => prev + 1);
    try {
      console.log(pageNumber);
      const { data } = await Axios(
        `/post/getposts?userId=${currentUser?._id}&page=${pageNumber}`,
      );
      setUserArticles([...userArticles, ...data.data.posts]);
      if (data.data.posts.length < 9) {
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

  // Delete Post..
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      await Axios.delete(`/post/deletepost/${articleID}/${currentUser?._id}`);
      setUserArticles((prev) => prev.filter((article) => article._id !== articleID));
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
      {currentUser?.isAdmin && userArticles && userArticles.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Article image</Table.HeadCell>
              <Table.HeadCell>Article title</Table.HeadCell>
              <Table.HeadCell>category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userArticles.map((article) => (
                <Table.Row
                  key={article._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${article.slug}`}>
                      <img
                        src={article.image}
                        alt={article.title}
                        className="object-cover w-20 h-10 bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/${article.slug}`}
                      className="font-medium text-gray-900 cursor-pointer dark:text-white"
                    >
                      {article.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{article.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 cursor-pointer hover:underline"
                      onClick={() => {
                        setShowModal(true);
                        setArticleID(article._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/update-post/${article._id}`}
                      className="text-teal-500 hover:underline"
                    >
                      <span>Edit</span>
                    </Link>
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
        <p className="py-4">You have no articles yet!</p>
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
              Are you sure you want to delete this article?
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
              <Button color="failure" onClick={handleDeletePost}>
                Yes
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashboardArticles;
