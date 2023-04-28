import { useState } from "react";
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

import FootballIcon1 from "@/assets/footballIcon1.svg";
import FootballIcon2 from "@/assets/footballIcon2.svg";
import BasketballIcon1 from "@/assets/basketballIcon1.svg";
import BasketballIcon2 from "@/assets/basketballIcon2.svg";
import AthleticsIcon1 from "@/assets/athleticsIcon1.svg";
import AthleticsIcon2 from "@/assets/athleticsIcon2.svg";
import RugbyIcon1 from "@/assets/rugbyIcon1.svg";
import RugbyIcon2 from "@/assets/rugbyIcon2.svg";
import CyclingIcon1 from "@/assets/cyclingIcon1.svg";
import CyclingIcon2 from "@/assets/cyclingIcon2.svg";
import HockeyIcon1 from "@/assets/hockeyIcon1.svg";
import HockeyIcon2 from "@/assets/hockeyIcon2.svg";
import BaseballIcon1 from "@/assets/baseballIcon1.svg";
import BaseballIcon2 from "@/assets/baseballIcon2.svg";

const PersonalInfo = dynamic(() => import("./personalInfo"));

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

  const sports = [
    {
      name: "Football",
      initialIcon: FootballIcon1,
      chosenIcon: FootballIcon2,
      bgImg: "lg:bg-player",
    },
    {
      name: " Basketball",
      initialIcon: BasketballIcon1,
      chosenIcon: BasketballIcon2,
      bgImg: "lg:bg-basketball",
    },
    {
      name: "Athletics",
      initialIcon: AthleticsIcon1,
      chosenIcon: AthleticsIcon2,
      bgImg: "lg:bg-athletics",
    },
    {
      name: "Rugby",
      initialIcon: RugbyIcon1,
      chosenIcon: RugbyIcon2,
      bgImg: "lg:bg-rugby",
    },
    {
      name: "Cycling",
      initialIcon: CyclingIcon1,
      chosenIcon: CyclingIcon2,
      bgImg: "lg:bg-cycling",
    },
    {
      name: "Hockey",
      initialIcon: HockeyIcon1,
      chosenIcon: HockeyIcon2,
      bgImg: "lg:bg-hockey",
    },
    {
      name: "Baseball",
      initialIcon: BaseballIcon1,
      chosenIcon: BaseballIcon2,
      bgImg: "lg:bg-baseball",
    },
  ];

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
            {specialties[clicked - 1] === "Player" && (
              <div className="w-full pl-[20px] pr-[20px] lg:pl-0 lg:pr-0 lg:w-[256px] mt-[59px] mb-[52px]">
                <CustomSelectDropdown
                  label="Select position"
                  options={sportOptions[chosenSportIndex]}
                  onChange={(e) => {
                    setProgressValue(100);
                    setChosenPosition(e?.target?.value);
                    // userInfo && chosenPosition && onUpdateProfile(userInfo.access);
                    setTimeout(() => {
                      setStep(3);
                    }, 1000);
                  }}
                />
              </div>
            )}
            <div
              className={`w-full flex flex-wrap justify-center items-center pl-[30px] lg:pl-[unset] pr-[30px] lg:pr-[unset] gap-x-[30px] lg:gap-x-[unset] gap-y-[30px] lg:gap-y-[unset]`}
            >
              {sports.map((sport, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setChosenSportIndex(index);
                    specialties[clicked - 1] !== "Player" &&
                      setProgressValue(100);
                    // specialties[clicked - 1] !== 'Player' &&
                    //   userInfo &&
                    //   onUpdateProfile(userInfo.access);
                    specialties[clicked - 1] !== "Player" &&
                      setTimeout(() => {
                        setStep(3);
                      }, 1000);
                  }}
                  className={`flex cursor-pointer flex-col justify-center items-center ${
                    chosenSportIndex === index &&
                    "bg-[#F8FAFB] w-[120px] lg:w-[216px] h-[120px] lg:h-[216px] shadow-xl shadow-[rgba(0, 0, 0, 0.11)] rounded-[12px] lg:rounded-[20px]"
                  } ${
                    chosenSportIndex === index
                      ? "lg:-ml-[68px]  lg:mr-[31px] pr-[0px] lg:pr-[0px]"
                      : "pr-[20px] lg:pr-[99px]"
                  }`}
                >
                  <NextImage
                    src={
                      chosenSportIndex === index
                        ? sport.chosenIcon
                        : sport.initialIcon
                    }
                    alt="sport"
                  />
                  <p
                    className={`mt-[15px] font-bold text-[12px] leading-[18px] ${
                      chosenSportIndex === index
                        ? "text-brand-600"
                        : "text-brand-1650"
                    }`}
                  >
                    {sport.name}
                  </p>
                </div>
              ))}
            </div>
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
          sports={sports}
          chosenSportIndex={chosenSportIndex}
        />
      )}
    </>
  );
};

export default Setup;
