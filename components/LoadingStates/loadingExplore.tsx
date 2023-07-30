import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const LoadingExplore = () => {
  return (
    <div className="bg-brand-500 flex relative h-[391px] px-[37px] pt-[32px] pb-[43px] mb-[20px] rounded-[8px] w-full md:w-[45%]">
      <div className="absolute bottom-0 w-full">
        <div className="w-full mb-[21px]">
          <SkeletonTheme baseColor="#D7DEE1" highlightColor="#fff">
            <Skeleton
              height={58}
              width={"60%"}
              style={{ borderRadius: "4px" }}
            />
          </SkeletonTheme>
        </div>
        <div className="flex items-center gap-x-[10px] mb-[26px]">
          <SkeletonTheme baseColor="#D7DEE1" highlightColor="#fff">
            <Skeleton height={40} width={42} style={{ borderRadius: "100%" }} />
          </SkeletonTheme>
          <div>
            <SkeletonTheme baseColor="#D7DEE1" highlightColor="#fff">
              <Skeleton
                height={10}
                width={116}
                style={{ borderRadius: "4px" }}
              />
              <Skeleton
                height={10}
                width={85}
                style={{ borderRadius: "4px" }}
              />
            </SkeletonTheme>
          </div>
        </div>
      </div>
      <div className="absolute right-[28px] flex flex-col gap-y-[38px]">
        <SkeletonTheme baseColor="#D7DEE1" highlightColor="#fff">
          <Skeleton height={35} width={35} style={{ borderRadius: "4px" }} />
          <Skeleton height={35} width={35} style={{ borderRadius: "4px" }} />
          <Skeleton height={35} width={35} style={{ borderRadius: "4px" }} />
          <Skeleton height={35} width={35} style={{ borderRadius: "4px" }} />
          <Skeleton height={23} width={76} style={{ borderRadius: "4px" }} />
        </SkeletonTheme>
      </div>
    </div>
  );
};

export default LoadingExplore;
