import { Button, FileInput, Select, Spinner, TextInput } from "flowbite-react";
import React, { lazy, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { handleAxiosError } from "../utils/utils";
import { useAppSelector } from "../store/storeHooks";
import { Axios } from "../config/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { firebaseStorage } from "../utils/firebase.ts";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "react-circular-progressbar/dist/styles.css";
const ShowAlert = lazy(() => import("../components/showAlert"));

type ArticleContentType = {
  title?: string;
  content?: string;
  image?: string;
  category?: string;
};

const UpdatePostPage = () => {
  const { currentUser: user } = useAppSelector((state) => state.user);
  const { postId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [image, setImage] = useState<File | null>(null);
  const [imageUploadingProgress, setImageUploadingProgress] = useState<
    number | null
  >(null);
  const [imageUploadingError, setImageUploadingError] = useState<string | null>(
    null,
  );
  const [postingError, setPostingError] = useState<string | undefined>(
    undefined,
  );
  const navigate = useNavigate();
  const [initialArticleContent, setInitialArticleContent] =
    useState<ArticleContentType>({
      title: "",
      content: "",
      image: "",
      category: "",
    });
  const [formDataContent, setFormDataContent] = useState<string>("");

  // fetchData...
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await Axios(`/post/getposts?postId=${postId}`);
        setInitialArticleContent(data.data.posts[0]);
        setPostingError(undefined);
        setLoading(false);
      } catch (error) {
        const err = await handleAxiosError(error);
        setPostingError(err);
        setLoading(false);
      }
    })();
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!image) {
        setImageUploadingError("Please select an image");
        return;
      }
      const fileName = `${new Date().getDate()}-${new Date().getTime()}-${Math.round(Math.random())}-${image.name}-firebase`;
      const storageReference = ref(firebaseStorage, fileName);
      const uploadTask = uploadBytesResumable(storageReference, image);
      uploadTask.on(
        "state_changed",
        (uploadTaskSnapshot) => {
          const progress = parseInt(
            (
              (uploadTaskSnapshot.bytesTransferred /
                uploadTaskSnapshot.totalBytes) *
              100
            ).toFixed(0),
          );
          setImageUploadingProgress(progress);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_err) => {
          setImageUploadingError(
            `Upload unsuccessful. File must be below 2MB.`,
          );
          setImageUploadingProgress(null);
          setImage(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setInitialArticleContent({
              ...initialArticleContent,
              image: downloadURL,
            });
            setImageUploadingProgress(null);
            setImageUploadingError(null);
          });
        },
      );
    } catch (error) {
      setImageUploadingError(`Image upload failed. Please try again.`);
      setImageUploadingProgress(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const postData = { ...initialArticleContent, content: formDataContent };
      const { data } = await Axios.put(
        `/post/updatepost/${postId}/${user?._id}`,
        postData,
      );
      navigate(`/post/${data.data.slug}`);
    } catch (error) {
      const err = await handleAxiosError(error);
      setPostingError(err);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-content-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mb-16 p-5 mx-auto">
      <h1 className="text-4xl font-semibold text-center mb-11">
        Update an article
      </h1>
      <form className="gap-6 flex flex-col" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <TextInput
            type="text"
            placeholder="Choose article title..."
            required
            id="title"
            className="flex-auto"
            onChange={(e) =>
              setInitialArticleContent({
                ...initialArticleContent,
                title: e.target.value,
              })
            }
            value={initialArticleContent?.title}
          />
          <Select
            onChange={(e) =>
              setInitialArticleContent({
                ...initialArticleContent,
                category: e.target.value,
              })
            }
            value={initialArticleContent?.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="movies">Movies</option>
            <option value="tvseries">TV Series</option>
            <option value="interviews">Interviews</option>
            <option value="reviews">Reviews</option>
            <option value="festivals">Festivals & Ceremonies</option>
          </Select>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <FileInput
            className="w-full md:flex-1"
            onChange={(event) =>
                setImage(event.target.files && event.target.files[0])
            }
          />
          <Button
            type="button"
            onClick={handleUploadImage}
            disabled={!imageUploadingProgress === null}
            className="text-white bg-[#63d052] rounded-md dark:bg-[#63d052] dark:focus:ring-[#63d052] md:w-32"
          >
            {imageUploadingProgress ? "Uploading..." : "Upload image"}
          </Button>
        </div>
        {imageUploadingError && (
          <ShowAlert
            message={imageUploadingError}
            type="failure"
            onClose={() => setImageUploadingError(null)}
          />
        )}
        {initialArticleContent?.image && (
          <img
            src={initialArticleContent.image}
            alt="upload image"
            className="object-cover h-72 w-full"
          />
        )}
        <ReactQuill
          placeholder="Article text here..."
          className="dark:text-white mb-12 h-96"
          onChange={(value) => setFormDataContent(value)}
          value={formDataContent || initialArticleContent.content}
        />
        <Button
          type="submit"
          className="text-white bg-[#63d052] focus:ring-[#63d052] rounded-md p-0.5 dark:bg-[#63d052] dark:focus:ring-[#63d052]"
        >
          Update
        </Button>
      </form>
      {postingError && (
        <ShowAlert
          message={postingError}
          type="failure"
          onClose={() => setPostingError(undefined)}
        />
      )}
    </div>
  );
};

export default UpdatePostPage;
