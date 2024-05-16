import Skeleton from "react-loading-skeleton";

type PropsType = {
  cards?: number;
};

const PostCardSkeleton = ({ cards = 1 }: PropsType) => {
  return (
    <>
      <div className="hidden gap-7 md:flex">
        {Array(cards)
          .fill(0)
          .map(() => (
            <div
              className="group w-full shadow-xl border-1 border-[#6C7A89] rounded-md sm:w-[360px] mb-8 transition-all"
              key={Math.random()}
            >
              <Skeleton height={220} className="p-2" />
              <div className="flex flex-col gap-2 p-3">
                <Skeleton count={2} />
                <Skeleton height={25} width={50} borderRadius={10} />
              </div>
            </div>
          ))}
      </div>
      <div className="hidden gap-7 sm:flex md:hidden">
        {Array(2)
          .fill(0)
          .map(() => (
            <div
              className="group w-full shadow-xl border-1 border-[#6C7A89] rounded-md sm:w-[360px] transition-all"
              key={Math.random()}
            >
              <Skeleton height={220} className="p-2" />
              <div className="flex flex-col gap-2 p-3">
                <Skeleton count={2} />
                <Skeleton height={25} width={50} borderRadius={10} />
              </div>
            </div>
          ))}
      </div>
      <div className="flex gap-7 sm:hidden">
        <div
          className="group w-full shadow-xl border-1 border-[#6C7A89] rounded-md sm:w-[360px] transition-all"
          key={Math.random()}
        >
          <Skeleton height={220} className="p-2" />
          <div className="flex flex-col gap-2 p-3">
            <Skeleton count={2} />
            <Skeleton height={25} width={50} borderRadius={10} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCardSkeleton;
