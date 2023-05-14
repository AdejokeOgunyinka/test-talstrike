import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SkeletonLoader = () => {
  return (
    <div className="h-[300px] w-full flex flex-wrap justify-center items-center mt-[300px] md:mt-0 md:items-unset gap-x-4 gap-y-4 mb-2">
      <SkeletonTheme baseColor="rgba(0, 116, 217, 0.18)" highlightColor="#fff">
        <section>
          <Skeleton height={250} width={250} />
        </section>
      </SkeletonTheme>
      <SkeletonTheme baseColor="rgba(0, 116, 217, 0.18)" highlightColor="#fff">
        <section>
          <Skeleton height={250} width={250} />
        </section>
      </SkeletonTheme>
      <SkeletonTheme baseColor="rgba(0, 116, 217, 0.18)" highlightColor="#fff">
        <section>
          <Skeleton height={250} width={250} />
        </section>
      </SkeletonTheme>
    </div>
  );
};

export default SkeletonLoader;
