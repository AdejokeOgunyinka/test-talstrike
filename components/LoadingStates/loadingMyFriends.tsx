import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const LoadingMyFriends = ({ repeatLoader }: { repeatLoader: number }) => {
  return (
    <div>
      {Array(repeatLoader)
        ?.fill("")
        ?.map((_, index) => (
          <div
            key={index}
            className="flex w-full items-center gap-x-[22px] mb-[10px] rounded-[8px]"
          >
            <SkeletonTheme baseColor="#D7DEE1" highlightColor="#fff">
              <Skeleton
                height={55}
                width={55}
                style={{ borderRadius: "100%" }}
              />

              <Skeleton
                height={35}
                width={200}
                style={{ borderRadius: "4px", width: "100%" }}
              />
            </SkeletonTheme>
          </div>
        ))}
    </div>
  );
};

export default LoadingMyFriends;
