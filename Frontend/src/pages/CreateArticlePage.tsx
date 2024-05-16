import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { lazy, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Axios } from "../config/api";
import { handleAxiosError } from "../utils/utils";
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

const CreateArticlePage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUploadingProgress, setImageUploadingProgress] = useState<
    number | null
  >(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formContent, setFormContent] = useState<ArticleContentType | null>(
    null,
  );
  const [postingError, setPostingError] = useState<string | undefined>(
    undefined,
  );
  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!image) {
        setImageUploadError("Please select an image first");
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
        (_storageError) => {
          setImageUploadError(`Upload unsuccessful. File must be below 2MB.`);
          setImageUploadingProgress(null);
          setImage(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormContent({ ...formContent, image: downloadURL });
            setImageUploadingProgress(null);
          });
        },
      );
    } catch (error) {
      setImageUploadError(`Image upload failed. Please try again.`);
      setImageUploadingProgress(null);
    }
  };

  const dataSubmitHandler = async (error: React.FormEvent<HTMLFormElement>) => {
    error.preventDefault();
    try {
      const { data } = await Axios.post(`/post/create`, formContent);
      navigate(`/post/${data.data.post.slug}`);
    } catch (error) {
      const err = await handleAxiosError(error);
      console.log(err);
      setPostingError(err);
    }
  };

  return (
    <div className="max-w-6xl p-5 m-16 mx-auto">
      <h1 className="text-4xl font-semibold text-center mb-11">
        Create a new article
      </h1>
      <form className="gap-6 flex flex-col" onSubmit={dataSubmitHandler}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <TextInput
            type="text"
            placeholder="Choose article title..."
            required
            id="title"
            className="flex-auto"
            onChange={(event) =>
              setFormContent({ ...formContent, title: event.target.value })
            }
          />
          <Select
            onChange={(event) =>
              setFormContent({ ...formContent, category: event.target.value })
            }
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
            {imageUploadingProgress ? "Uploading" : "Upload image"}
          </Button>
        </div>
        {imageUploadError && (
          <ShowAlert
            message={imageUploadError}
            type="failure"
            onClose={() => setImageUploadError(null)}
          />
        )}
        {formContent?.image && (
          <img
            src={formContent.image}
            alt="upload image"
            className="object-cover h-72 w-full"
          />
        )}
        <ReactQuill
          placeholder="Article text here..."
          className="dark:text-white mb-12 h-96"
          onChange={(value) => {
            setFormContent({ ...formContent, content: value });
          }}
        />
        <Button
          type="submit"
          className="text-white bg-[#63d052] focus:ring-[#63d052] rounded-md p-0.5 dark:bg-[#63d052] dark:focus:ring-[#63d052]"
        >
          Publish
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

export default CreateArticlePage;
