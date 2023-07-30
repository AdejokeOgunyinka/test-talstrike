import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const LoadingPosts = ({ width }: { width?: string }) => {
  return (
    <div
      className={`bg-brand-500  h-[383px] px-[37px] pt-[32px] pb-[43px] mb-[20px] rounded-[8px] ${width}`}
    >
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

        <div className="flex items-center gap-x-[10px] w-[100%] mt-[24px]">
          <div className="w-[50%]">
            <SkeletonTheme baseColor="#D7DEE1" highlightColor="#fff">
              <Skeleton
                height={103}
                width={"100%"}
                style={{ borderRadius: "4px" }}
              />
            </SkeletonTheme>
          </div>
          <div className="w-[50%]">
            <SkeletonTheme baseColor="#D7DEE1" highlightColor="#fff">
              <Skeleton
                height={103}
                width={"100%"}
                style={{ borderRadius: "4px" }}
              />
            </SkeletonTheme>
          </div>
        </div>

        <div className="w-full flex justify-between mt-[19px]">
          <SkeletonTheme baseColor="#D7DEE1" highlightColor="#fff">
            <Skeleton height={35} width={35} style={{ borderRadius: "4px" }} />
            <Skeleton height={35} width={35} style={{ borderRadius: "4px" }} />
            <Skeleton height={35} width={35} style={{ borderRadius: "4px" }} />
            <Skeleton height={35} width={35} style={{ borderRadius: "4px" }} />
          </SkeletonTheme>
        </div>
      </div>
    </div>
  );
};

export default LoadingPosts;
