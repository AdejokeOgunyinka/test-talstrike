/* eslint-disable @next/next/no-img-element */
import { DashboardLayout } from "@/layout/Dashboard";
import { useState } from "react";
import ExploreSection from "./ExploreSection";
import { useGetExploreForYou, useGetExploreTop } from "@/api/explore";

const Index = () => {
  const { data: exploreForMe } = useGetExploreForYou();
  const { data: exploreTop } = useGetExploreTop();

  const exploreSections = [
    { title: "For you", component: <ExploreSection data={exploreForMe} /> },
    // { title: "Trends" },
    { title: "Top", component: <ExploreSection data={exploreTop} /> },
    { title: "Latest", component: <ExploreSection data={exploreForMe} /> },
    { title: "Live", component: <ExploreSection data={exploreForMe} /> },
  ];

  const [currentSection, setCurrentSection] = useState(1);

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col justify-center md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 py-[28px]">
        <div className="flex z-[99] pl-[30px] flex-wrap lg:flex-nowrap gap-y-[10px] w-full lg:w-[calc(100%-450px)] lg:-mt-[30px] backdrop-blur-[15px] md:pt-[29px] lg:fixed lg: top-[99px] gap-x-[20px] lg:gap-x-[54px] mr-[31px] bg-brand-profile-header border-t-0 border-[3px] border-x-0 lg:border-b-brand-300">
          {exploreSections?.map((section, index) => (
            <div
              key={index}
              onClick={() => setCurrentSection(index + 1)}
              className={`border-t-0 border-[3px] border-x-0 z-[22] -mb-[3px] lg:-mb-[3px] ${
                currentSection === index + 1
                  ? "border-b-brand-2250"
                  : "border-b-brand-300"
              } cursor-pointer`}
            >
              <h3
                className={`${
                  currentSection === index + 1
                    ? "text-brand-2250"
                    : "text-brand-2200"
                } mb-[11px] text-[11px] lg:text-[14px] font-semibold`}
              >
                {section.title}
              </h3>
            </div>
          ))}
        </div>
        {exploreSections[currentSection - 1]?.component}
      </div>
    </DashboardLayout>
  );
};

export default Index;
