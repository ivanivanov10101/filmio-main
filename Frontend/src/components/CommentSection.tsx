import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/storeHooks";
import { Button, Modal, Textarea } from "flowbite-react";
import {lazy, useEffect, useState} from "react";
import { handleAxiosError } from "../utils/utils";
import ShowAlert from "./showAlert";
const Comment = lazy(() => import("./Comment"));
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Axios } from "../config/api";

type PropsType = {
  postId: string;
};

export type CommentType = {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  likes: Array<string>;
  numberOfLikes: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const CommentSection = ({ postId }: PropsType) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const [comment, setComment] = useState<string>("");
  const [commentError, setCommentError] = useState<string | undefined | null>(
    null,
  );
  const [comments, setComments] = useState<CommentType[] | []>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState<
    string | undefined
  >();
  const navigate = useNavigate();

  //Submit comment....*:
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (comment.length > 200) return;
      const Data = { content: comment, postId, userId: currentUser?._id };
      const { data } = await Axios.post(`/comment/create`, Data);
      setComment("");
      setCommentError(null);
      setComments([data.data, ...comments]);
    } catch (error) {
      const err = await handleAxiosError(error);
      setCommentError(err);
    }
  };

  //Get comments.....*:
  useEffect(() => {
    (async () => {
      try {
        const { data } = await Axios(`/comment/getPostComments/${postId}`);
        setComments(data.data);
      } catch (error) {
        const err = await handleAxiosError(error);
        console.log(err);
      }
    })();
  }, [postId]);

  // handleLike...*:
  const handleLike = async (commentId: string) => {
    try {
      if (!currentUser) {
        return navigate("/sign-in");
      }
      const { data } = await Axios.put(`/comment/like-comment/${commentId}`);
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: data.data.likes,
                numberOfLikes: data.data.numberOfLikes,
              }
            : comment,
        ),
      );
    } catch (error) {
      const err = await handleAxiosError(error);
      console.log(err);
    }
  };

  // handleEdit...*:
  const handleEdit = async (commentId: string, editedContent: string) => {
    setComments(
      comments.map((comment) =>
        comment._id === commentId
          ? { ...comment, content: editedContent }
          : comment,
      ),
    );
  };

  // handleDelete...*:
  const handleDelete = async (commentId: string | undefined) => {
    setShowModal(false);
    try {
      await Axios.delete(`/comment/delete-comment/${commentId}`);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      const err = await handleAxiosError(error);
      console.log(err);
    }
  };

  return (
    <div className="w-full max-w-2xl p-3 mx-auto">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-sm text-gray-500">
          <p>Signed in as:</p>
          <img
            src={currentUser.profilePicture}
            alt={currentUser.fullName}
            className="object-cover w-5 h-5 rounded-full"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-[#63d052]"
          >
            {currentUser.fullName}
          </Link>
        </div>
      ) : (
        <div className="flex gap-1 my-5 text-sm text-[#63d052]">
          <div>You must be signed in to comment.</div>
          <Link to={"/sign-in"} className="text-[#63d052] hover:underline">
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="p-3 border border-none rounded-md drop-shadow-md"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment..."
            rows={5}
            maxLength={350}
            className="resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500">
              {350 - comment.length} characters remaining
            </p>
            <Button type="submit" className="text-white bg-[#63d052] hover:bg-[#81d973] focus:outline-none focus:ring-[#81d973] font-medium rounded-md text-sm py-0.5 text-center dark:bg-[#63d052] dark:hover:bg-[#63d052] dark:focus:ring-[#81d973]">
              Submit
            </Button>
          </div>
          {commentError && (
            <ShowAlert
              message={commentError}
              type="failure"
              errorDuration={5000}
              className="mt-5"
            />
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="my-8 px-4 text-sm">No comments yet!</p>
      ) : (
        <>
          <div className="flex items-center gap-1 my-5 px-4 text-sm">
            <p>Comments: </p>
            <div className="px-2">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentIdToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-6">
              <Button
                color="success"
                onClick={() => handleDelete(commentIdToDelete)}
                className="px-2"
              >
                Yes
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)} className="px-2">
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CommentSection;
