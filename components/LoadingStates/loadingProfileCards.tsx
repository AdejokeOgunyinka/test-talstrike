import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const LoadingProfileCards = () => {
  return (
    <div className="bg-brand-500 w-full md:w-[30%] rounded-[8px] h-[170px] px-[10px] pt-[10px] pb-[23px] mb-[20px]">
      <div className="flex items-center gap-x-[10px] mb-[26px]">
        <SkeletonTheme baseColor="#D7DEE1" highlightColor="#fff">
          <Skeleton height={40} width={42} style={{ borderRadius: "100%" }} />
        </SkeletonTheme>
        <div>
          <SkeletonTheme baseColor="#D7DEE1" highlightColor="#fff">
            <Skeleton height={10} width={116} style={{ borderRadius: "4px" }} />
            <Skeleton height={10} width={85} style={{ borderRadius: "4px" }} />
          </SkeletonTheme>
        </div>
      </div>
      <div className="w-full">
        <SkeletonTheme baseColor="#D7DEE1" highlightColor="#fff">
          <Skeleton
            height={59}
            width={"100%"}
            style={{ borderRadius: "4px" }}
          />
        </SkeletonTheme>
      </div>
    </div>
  );
};

export default LoadingProfileCards;
