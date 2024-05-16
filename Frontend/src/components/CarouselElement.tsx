import { Post } from "../pages/PostPage.tsx";
import { Link } from "react-router-dom";
import '../utils/index.css'

type PropsType = {
  post: Post;
};

const CarouselElement = ({ post }: PropsType) => {
  return (
    <div className="flex">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-full w-full"
          loading="lazy"
        />
          <div className="swiper-lazy-preloader"></div>
      </Link>
        <div className="absolute m-auto p-16 w-full bottom-0 overflow-ellipsis drop-shadow-xl text-white bg-black/[.2] hover:bg-black/[.3]">
            <Link to={`/post/${post.slug}`}>
                <p className="font-sans font-light text-center sm:text-sm md:text-xl ">{post.title}</p>
            </Link>
        </div>

    </div>
  );
};

export default CarouselElement;
