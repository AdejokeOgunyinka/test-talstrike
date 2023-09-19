import { useEffect, useState } from "react";
import NextImage from "next/image";
import dynamic from "next/dynamic";

import AuthProgressBar from "@/layout/Auth/AuthProgressBar";
import AuthSelectionLayout from "@/layout/Auth/AuthSelectionLayout";
import CustomSelectDropdown from "@/components/SelectDropdown";
import {
  footballPositions,
  basketballPositions,
  rugbyPositions,
  hockeyPositions,
  baseballPositions,
} from "@/libs/authSelections";
import { useGetSports } from "@/api/auth";
import PersonalInfo from "./personalInfo";

const Setup = ({ providers }: { providers: any }) => {
  const [step, setStep] = useState(1);
  const specialties = ["Player", "Coach", "Trainer", "Agent"];
  const specialtiesBgImg = [
    "md:bg-player",
    "md:bg-coach",
    "md:bg-trainer",
    "md:bg-agent",
  ];

  const [clicked, setClicked] = useState(0);
  const [progressValue, setProgressValue] = useState(50);

  const [chosenSportIndex, setChosenSportIndex] = useState(1);

  const sportOptions = [
    footballPositions,
    basketballPositions,
    [],
    rugbyPositions,
    [],
    hockeyPositions,
    baseballPositions,
  ];
  const [chosenPosition, setChosenPosition] = useState("");
  const { data: sports } = useGetSports();
  const [chosenSport, setChosenSport] = useState("");

  const [sportPositions, setChosenSportPositions] = useState([]);

  useEffect(() => {
    if (chosenSport) {
      setChosenSportPositions(
        sports?.results?.filter((sport: any) => sport?.name === chosenSport)[0]
          ?.positions
      );
    } else {
      setChosenSportPositions(sports?.results[0]?.positions);
    }
  }, [sports, chosenSport]);

  return (
    <>
      {step === 1 ? (
        <AuthSelectionLayout withBgImg={false}>
          <div className="w-full h-screen flex flex-col items-center">
            <h4 className="mt-[120px] lg:mt-[181px] mb-[7px] leading-[36px] text-brand-70 font-bold text-[24px]">
              Select your specialty
            </h4>
            <p className="mb-[76px] text-brand-50 leading-[21px] text-[14px] font-normal">
              Lorem Ipsum is simply dummy text of the{" "}
            </p>
            <div className="w-full flex flex-wrap justify-center gap-x-[20px] gap-y-[20px] mb-[40px] lg:mb-[70px] lg:mb-[0px]">
              {specialties.map((specialty, index) => (
                <div
                  key={index}
                  className={`${
                    clicked === index + 1 ? "bg-brand-600" : "bg-brand-500"
                  } flex justify-center cursor-pointer items-center border border-brand-600 rounded-[20px] w-[130px] lg:w-[216px] h-[130px] lg:h-[216px] rounded-[20px]`}
                  onClick={() => {
                    setClicked(index + 1);
                    setProgressValue(75);
                    setTimeout(() => {
                      setStep(2);
                    }, 1000);
                  }}
                >
                  <p
                    className={`${
                      clicked === index + 1
                        ? "text-brand-500"
                        : "text-brand-600"
                    } font-bold text-[16px] lg:text-[20px] leading-[30px]`}
                  >
                    {specialty}
                  </p>
                </div>
              ))}
            </div>
            <div className="relative mb-[30px] lg:mb-0 lg:absolute lg:bottom-[110px] w-3/4 lg:w-[650px]">
              <AuthProgressBar progress={progressValue} />
            </div>
          </div>
        </AuthSelectionLayout>
      ) : step === 2 ? (
        <AuthSelectionLayout
          withBgImg
          bgImg={
            sports[chosenSportIndex]?.name === "Player"
              ? specialtiesBgImg[clicked - 1]
              : sports[chosenSportIndex]?.bgImg
          }
        >
          <div className="w-full h-full lg:pl-[100px] lg:pb-[180px]">
            <h4 className="pt-[120px] lg:pt-[162px] leading-[36px] text-brand-70 font-bold text-[24px] text-center lg:text-start">
              Welcome, {specialties[clicked - 1]}
            </h4>
            <h4 className="leading-[36px] text-brand-70 font-bold text-[24px] text-center lg:text-start">
              Select your preferred sport
            </h4>
            <div className="w-full lg:w-[295px] mt-[31px] mb-[59px]">
              <p className="text-[14px] text-brand-50 font-normal leading-[21px] text-center lg:text-start">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.{" "}
              </p>
            </div>
            <div
              className={`w-full flex flex-wrap justify-center items-center pl-[30px] lg:pl-[unset] pr-[30px] lg:pr-[unset] gap-x-[30px] lg:gap-x-[unset] gap-y-[30px] lg:gap-y-[unset]`}
            >
              <div className="w-full">
                <CustomSelectDropdown
                  label="Select sport"
                  options={sports?.results?.map((sport: any) => sport?.name)}
                  onChange={(e) => {
                    setChosenSport(e?.target?.value);
                    specialties[clicked - 1] !== "Player" &&
                      setProgressValue(100);

                    specialties[clicked - 1] !== "Player" &&
                      setTimeout(() => {
                        setStep(3);
                      }, 1000);
                  }}
                />
              </div>
            </div>
            {specialties[clicked - 1] === "Player" && (
              <div className="w-full pl-[20px] pr-[20px] lg:pl-0 lg:pr-0 lg:w-[256px] mt-[59px] mb-[52px]">
                <CustomSelectDropdown
                  label="Select position"
                  options={sportPositions}
                  onChange={(e) => {
                    setProgressValue(100);
                    setChosenPosition(e?.target?.value);
                    setTimeout(() => {
                      setStep(3);
                    }, 1000);
                  }}
                />
              </div>
            )}

            <div className="w-full flex justify-center">
              <div className="relative mt-[67px] mb-[30px] lg:mb-0 lg:absolute lg:bottom-[110px] w-3/4 lg:w-[650px]">
                <AuthProgressBar progress={progressValue} />
              </div>
            </div>
          </div>
        </AuthSelectionLayout>
      ) : (
        <PersonalInfo
          chosenPosition={chosenPosition}
          specialties={specialties}
          clicked={clicked}
          sports={sports?.results}
          chosenSport={chosenSport}
        />
      )}
    </>
  );
};

export default Setup;
