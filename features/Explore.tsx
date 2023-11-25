/* eslint-disable @next/next/no-img-element */
import { DashboardLayout } from "@/layout/Dashboard";
import { useState } from "react";
import ExploreSection from "./ExploreSection";
import {
  useGetExploreForYou,
  useGetExploreLatest,
  useGetExploreTop,
} from "@/api/explore";
import LoadingExplore from "@/components/LoadingStates/loadingExplore";
import { Flex } from "@chakra-ui/react";

const Index = () => {
  const { data: exploreForMe, isLoading: isLoadingForMe } =
    useGetExploreForYou();
  const { data: exploreLatest, isLoading: isLoadingLatest } =
    useGetExploreLatest();
  const { data: exploreTop, isLoading: isLoadingTop } = useGetExploreTop();

  const exploreSections = [
    { title: "For you", component: <ExploreSection data={exploreForMe} /> },
    { title: "Top", component: <ExploreSection data={exploreTop} /> },
    { title: "Latest", component: <ExploreSection data={exploreLatest} /> },
    { title: "Live", component: <ExploreSection data={exploreForMe} /> },
  ];

  const [currentSection, setCurrentSection] = useState(1);

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-[100vh] 2xl:min-h-[calc(85vh-60px)] bg-brand-1000 pt-[28px] 2xl:pt-0 pb-[28px] overflow-y-scroll">
        <Flex
          width={{
            base: "100%",
            md: "calc(100% - 456px)",
            "2xl": "calc(80vw - 456px)",
          }}
          className="z-[99] pl-[30px] flex-wrap lg:flex-nowrap gap-y-[10px] lg:-mt-[40px] 2xl:mt-[4rem] 2xl:max-w-[calc(70vw - 456px)] backdrop-blur-[15px] lg:pt-[25px] 2xl:pt-[18px] lg:fixed lg:top-[79px] 2xl:top-[120px] gap-x-[20px] lg:gap-x-[54px] mr-[31px] bg-brand-profile-header border-t-0 border-[3px] border-x-0 lg:border-b-brand-300"
        >
          {exploreSections?.map((section, index) => (
            <div
              key={index}
              onClick={() => setCurrentSection(index + 1)}
              className={`border-t-0 border-[3px] border-x-0 z-[66] -mb-[3px] lg:-mb-[3px] ${
                currentSection === index + 1
                  ? "border-b-brand-600"
                  : "border-b-brand-300"
              } cursor-pointer`}
            >
              <h3
                className={`${
                  currentSection === index + 1
                    ? "text-brand-600"
                    : "text-brand-2200"
                } mb-[11px] text-[11px] lg:text-[18px] font-semibold`}
              >
                {section.title}
              </h3>
            </div>
          ))}
        </Flex>
        {isLoadingForMe || isLoadingTop || isLoadingLatest ? (
          <div className="w-full md:px-[31px] mt-[13px] md:mt-[53px] flex flex-wrap gap-[12px]">
            {Array(4)
              ?.fill("")
              ?.map((_, index) => (
                <LoadingExplore key={index} />
              ))}
          </div>
        ) : (
          exploreSections[currentSection - 1]?.component
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
