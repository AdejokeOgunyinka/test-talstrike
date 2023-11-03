/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import { Box, useMediaQuery } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/router";

import { DashboardLayout } from "@/layout/Dashboard";
import Star from "@/assets/star.svg";
import profilePhotos1 from "@/assets/profilePhotos1.png";
import { useTypedSelector } from "@/hooks/hooks";
import ProfileImg from "@/assets/profileIcon.svg";
import AboutMe from "./UserProfileSections/AboutMe";
import { useGetMyProfile, useGetUserPhotos } from "@/api/profile";
import { handleMediaPostError, handleOnError } from "@/libs/utils";

const PageLoader = dynamic(() => import("@/components/Loader"));
const MyPosts = dynamic(() => import("./UserProfileSections/Posts"));
const MyOpenings = dynamic(() => import("./UserProfileSections/Openings"));
const MyAnnouncements = dynamic(
  () => import("./UserProfileSections/Announcements")
);
const MyArticles = dynamic(() => import("./UserProfileSections/Articles"));
const MyPolls = dynamic(() => import("./UserProfileSections/Polls"));

const Index = () => {
  const { data: session } = useSession();
  const { userInfo } = useTypedSelector((state) => state.profile);

  const router = useRouter();
  const { id } = router.query;

  const TOKEN = session?.user?.access;

  const { data: userProfile } = useGetMyProfile({
    token: TOKEN as string,
    userId: id as string,
  });

  const { data: media } = useGetUserPhotos({
    token: TOKEN as string,
    userId: id as string,
  });

  const profileIcons = [
    { icon: "/chatbox.svg", onClick: "" },
    { icon: "/calendar.svg", onClick: "" },
    { icon: "/shareSocial.svg", onClick: "" },
  ];

  const profileSections = [
    { title: "About Me" },
    { title: "Posts" },
    { title: "Openings" },
    { title: "Polls" },
    { title: "Announcements" },
    { title: "Articles" },
  ];

  const [currentSection, setCurrentSection] = useState(1);

  const [isMobileView] = useMediaQuery("(max-width: 1200px)");
  const [isMobileView1] = useMediaQuery("(max-width: 769px)");

  return (
    <DashboardLayout>
      {userInfo?.loading ? (
        <div className="w-full flex justify-center items-center md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 py-[28px] px-[15px] lg:px-[31px]">
          <PageLoader />
        </div>
      ) : (
        <div className="w-full md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 px-[0px] lg:px-[31px]">
          <div className="flex h-[100%] flex-col lg:flex-row ">
            <Box
              bg="transparent-white"
              className="lg:w-[274px] h-[100%] lg:sticky lg:top-[99px] md:mr-[5px]"
            >
              <div className="h-[515px] w-[100%] lg:w-[274px] bg-brand-500 md:rounded-[12px] shadow shadow-[0px_5px_14px_rgba(0, 0, 0, 0.09)] flex flex-col items-center pt-[22px] ">
                <div className="w-[161px] h-[161px] mb-[28px] border-8 border-brand-500 shadow shadow-[0px_4px_10px_4px_rgba(0, 0, 0, 0.07)] rounded-[50%] overflow-hidden">
                  <img
                    src={
                      userProfile?.user?.image !== null
                        ? userProfile?.user?.image
                        : ProfileImg
                    }
                    style={{
                      width: "161px",
                      height: "161px",
                      objectFit: "cover",
                    }}
                    alt="profile"
                    className="profile-img"
                    onError={handleOnError}
                  />
                </div>
                <div className="w-[69px] mb-[37px] h-[30px] bg-brand-1100 rounded-[19px] flex justify-center items-center">
                  <NextImage src={Star} alt="star" />
                  <p className="ml-[5px] font-semibold text-[15px] leading-[22px] text-brand-500">
                    4.3
                  </p>
                </div>
                <div className="flex gap-x-[14px] mb-[26px]">
                  {profileIcons.map((icon, index) => (
                    <div
                      key={index}
                      className="w-[44px] h-[44px] rounded-[10px] bg-brand-2300 flex justify-center items-center"
                    >
                      <NextImage
                        src={icon.icon}
                        alt="profile widget"
                        width="21"
                        height="21"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-brand-50 text-[14px] font-semibold leading-[21px] mb-[7px]">
                  {userProfile?.years_of_experience || 1} year
                  {userProfile?.years_of_experience &&
                  userProfile?.years_of_experience > 1
                    ? "s "
                    : " "}{" "}
                  Experience
                </p>
                <p className="text-brand-2400 mb-[29px] opacity-50 text-[11px] lg:text-[13px] font-semibold">
                  online
                </p>
              </div>
              <div className="h-[182px] mt-[5px] md:mt-[24px] bg-brand-500 lg:w-[274px] md:rounded-[12px] shadow shadow-[0px_5px_14px_rgba(0, 0, 0, 0.09)] px-[18px] pt-[11px] pb-[18px]">
                <div className="flex justify-between mb-[6px]">
                  <p className="font-semibold text-[14px] leading-[21px] text-brand-50">
                    Media
                  </p>
                  <p className="text-brand-300 text-[12px]">
                    {media?.count} picture{media?.count > 1 && "s"}
                  </p>
                </div>
                <div className="w-full h-[26px]">
                  {media?.photos ? (
                    <div className="w-full h-full flex flex-wrap gap-[2px]">
                      {media?.photos
                        ?.slice(0, 6)
                        ?.map((photo: string, index: number) => (
                          <div key={index} className="basis-[30%] relative">
                            <img
                              src={photo}
                              alt="nail"
                              className="rounded-[4px] w-[45px] h-[45px] object-cover"
                              onError={handleMediaPostError}
                            />
                            {/* {index === media?.count - 1 && (
                            <div className="absolute top-0 bottom-0 w-full h-full flex justify-center items-center bg-[rgba(0, 0, 0, 0.5)]">
                              <p className="text-brand-500 text-[10px]">
                                View all
                              </p>
                            </div>
                          )} */}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <NextImage src={profilePhotos1} alt="profile photos 1" />
                  )}
                </div>
              </div>
            </Box>
            <Box
              borderLeft={{ md: "1px solid" }}
              borderLeftColor={{ md: "stroke" }}
              paddingTop="18px"
              className="w-full lg:w-[calc(100%-274px)] pb-[100px]"
            >
              <Box
                borderBottom="1px solid"
                borderColor="stroke"
                overflowX={isMobileView1 ? "scroll" : "unset"}
                paddingX={isMobileView ? "20px" : "30px"}
                className="flex z-[99] gap-y-[10px] w-full lg:w-[calc(100%-550px)] lg:-mt-[30px] backdrop-blur-[15px] md:pt-[29px] lg:fixed lg: top-[99px] gap-x-[20px] lg:gap-x-[54px] lg:pl-[26px] mr-[31px] bg-brand-profile-header border-t-0 border-[3px] border-x-0 lg:border-b-brand-300"
              >
                {profileSections?.map((section, index) => (
                  <Box
                    key={index}
                    minW="fit-content"
                    onClick={() => setCurrentSection(index + 1)}
                    borderBottom={
                      currentSection === index + 1
                        ? "3px solid"
                        : "3px transparent"
                    }
                    borderBottomColor={
                      currentSection === index + 1 ? "secondary-blue" : "stroke"
                    }
                    className={`z-[22] -mb-[3px] lg:-mb-[3px] ${
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
                  </Box>
                ))}
              </Box>
              <Box className="md:pt-[28px] -mt-[15px] lg:mt-[28px] xl:mt-0">
                <Box
                  pt="16px"
                  borderBottom="1px solid"
                  borderBottomColor="stroke"
                ></Box>
                <Box className="lg:pl-[26px]">
                  {currentSection === 1 ? (
                    <AboutMe />
                  ) : currentSection === 2 ? (
                    <MyPosts />
                  ) : currentSection === 3 ? (
                    <MyOpenings />
                  ) : currentSection === 4 ? (
                    <MyPolls />
                  ) : currentSection === 5 ? (
                    <MyAnnouncements />
                  ) : (
                    <MyArticles />
                  )}
                </Box>
              </Box>
            </Box>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Index;
