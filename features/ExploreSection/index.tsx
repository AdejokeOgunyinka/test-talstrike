import ExploreCard from "@/components/ExploreCard";

const ExploreSection = ({ data }: { data: any }) => {
  return (
    <div className="w-[100%] md:px-[31px] mt-[13px] md:mt-[53px] flex flex-wrap gap-[12px] pb-[100px] lg:pb-0">
      {data
        ?.filter((val: any) => val?.media !== null)
        ?.map((forMe: any, index: number) => (
          <ExploreCard key={index} index={index} post={forMe} />
        ))}
    </div>
  );
};

export default ExploreSection;
