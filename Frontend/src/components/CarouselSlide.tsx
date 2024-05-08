import { Post } from "../pages/PostPage.tsx";
import { Link } from "react-router-dom";

type PropsType = {
  post: Post;
};

const CarouselSlide = ({ post }: PropsType) => {
  return (
    <div className="flex h-full items-center justify-center text-neutral bg-white dark:bg-[#202a2e]">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-full w-auto max-h-full max-w-full"
        />
      </Link>
      <div className="flex flex-col mx-4 min-w-96">
        <Link to={`/post/${post.slug}`}>
          <p className="font-bold text-center">{post.title}</p>
        </Link>
      </div>
    </div>
  );
};

export default CarouselSlide;
