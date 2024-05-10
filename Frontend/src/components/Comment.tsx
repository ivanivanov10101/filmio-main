import { useEffect, useState } from "react";
import { CommentType } from "./CommentSection";
import { handleAxiosError } from "../utils/utils";
import moment from "moment";
import { Button, Textarea } from "flowbite-react";
import { useAppSelector } from "../store/storeHooks";
import { FaThumbsUp } from "react-icons/fa";
import { Axios } from "../config/api";

type PropsType = {
  comment: CommentType;
  onLike: (commentId: string) => void;
  onEdit: (commentId: string, editedContent: string) => void;
  onDelete: (commentId: string) => void;
};

type User = {
  _id: string;
  fullName: string;
  userName: string;
  profilePicture: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const Comment = ({ comment, onLike, onEdit, onDelete }: PropsType) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>(comment.content);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await Axios(`/user/getuser/${comment.userId}`);
        setUser(data.data);
      } catch (error) {
        const err = await handleAxiosError(error);
        console.log(err);
      }
    })();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      await Axios.put(`/comment/edit-comment/${comment._id}`, {
        content: editedContent,
      });
      setIsEditing(false);
      onEdit(comment._id, editedContent);
    } catch (error) {
      const err = await handleAxiosError(error);
      console.log(err);
    }
  };

  return (
    <div className="flex p-4 mx-3 mb-4 text-sm shadow-md rounded-lg bg-gray-100 dark:bg-gray-700">
      <div className="mr-4">
        <img
          className="w-16 h-16 rounded-full"
          src={user?.profilePicture}
          alt={user?.fullName}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <span className="mr-1 text-xs font-bold truncate">
            {user ? `${user.fullName}` : "Deleted Account"}
          </span>
          <span className="text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-4 drop-shadow-md"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs drop-shadow-md">
              <Button
                type="button"
                className="text-white bg-[#63d052] hover:bg-[#81d973] focus:outline-none focus:ring-[#81d973] font-medium rounded-md text-sm py-0.5 text-center dark:bg-[#63d052] dark:hover:bg-[#63d052] dark:focus:ring-[#81d973]"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                className="text-white bg-[#63d052] hover:bg-[#81d973] focus:outline-none focus:ring-[#81d973] font-medium rounded-md text-sm py-0.5 text-center dark:bg-[#63d052] dark:hover:bg-[#63d052] dark:focus:ring-[#81d973]"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="pb-2 text-neutral">{comment.content}</p>
            <div className="flex items-center gap-2 pt-2 text-xs border-t dark:border-gray-700 max-w-fit">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-[#63d052] ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    {currentUser._id === comment.userId && (
                      <button
                        type="button"
                        onClick={handleEdit}
                        className="text-gray-400 hover:text-[#63d052]"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-400 hover:text-[#63d052]"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
