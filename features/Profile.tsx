/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import { Link, Box, useMediaQuery, Text, Flex, Image } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { DashboardLayout } from "@/layout/Dashboard";
import profilePhotos1 from "@/assets/profilePhotos1.png";
import { useTypedDispatch, useTypedSelector } from "@/hooks/hooks";
import EditProfile from "@/components/ProfileModals/EditProfile";
import EditCareerProgress from "@/components/ProfileModals/EditCareerProgress";
import AboutMe from "./ProfileSections/AboutMe";
import ViewProfileImg from "./ProfileImgModals/ViewProfileImg";
import EditProfileAndExperience from "./ProfileImgModals/EditProfile";
import { useGetMyProfile, useGetUserPhotos } from "@/api/profile";
import { setProfile } from "@/store/slices/profileSlice";
import {
  handleMediaPostError,
  handleOnError,
  uppercaseFirsLetter,
  userTypeIcon,
} from "@/libs/utils";
import { useRouter } from "next/router";

const PageLoader = dynamic(() => import("@/components/Loader"));
const MyPosts = dynamic(() => import("../features/ProfileSections/Posts"));
const MyOpenings = dynamic(
  () => import("../features/ProfileSections/Openings")
);
const MyAnnouncements = dynamic(
  () => import("../features/ProfileSections/Announcements")
);
const MyArticles = dynamic(
  () => import("../features/ProfileSections/Articles")
);
const MyPolls = dynamic(() => import("../features/ProfileSections/Polls"));

const Index = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const USERID = session?.user?.id;
  const { userInfo } = useTypedSelector((state) => state.profile);

  const followStatistic = {
    topStatistic: [
      { name: "Following", val: userInfo?.profile?.following },
      { name: "Followers", val: userInfo?.profile?.followers },
    ],
    bottomStatistic: [
      {
        name: `Year${
          userInfo?.profile?.years_of_experience &&
          userInfo?.profile?.years_of_experience > 1
            ? "s "
            : " "
        } Experience`,
        val: userInfo?.profile?.years_of_experience ?? 1,
      },
    ],
  };

  const { data: media } = useGetUserPhotos({
    token: TOKEN as string,
    userId: USERID as string,
  });

  const dispatch = useTypedDispatch();

  const { data: userData, isLoading: isLoadingUserData } = useGetMyProfile({
    token: TOKEN as string,
    userId: USERID as string,
  });
  useEffect(() => {
    dispatch(setProfile(userData));
  }, [dispatch, userData]);

  const profileSections = [
    { title: "About Me", href: "/profile" },
    { title: "Posts", href: "/profile?name=posts" },
    { title: "Openings", href: "/profile?name=openings" },
    { title: "Polls", href: "/profile?name=polls" },
    { title: "Announcements", href: "/profile?name=announcements" },
    { title: "Articles", href: "/profile?name=articles" },
  ];

  const [currentSection, setCurrentSection] = useState(1);
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [openEditCareerProgressModal, setOpenEditCareerProgressModal] =
    useState(false);
  const [viewProfilePicture, setViewProfilePicture] = useState(false);
  const [viewEditProfilePicture, setViewEditProfilePicture] = useState(false);

  const router = useRouter();
  const value = router.query;

  useEffect(() => {
    if (value?.name) {
      if (value?.name === "posts") {
        setCurrentSection(2);
      } else if (value?.name === "openings") {
        setCurrentSection(3);
      } else if (value?.name === "polls") {
        setCurrentSection(4);
      } else if (value?.name === "announcements") {
        setCurrentSection(5);
      } else {
        setCurrentSection(6);
      }
    }
  }, [value, value?.name]);

  const [isMobileView1] = useMediaQuery("(max-width: 769px)");
  const [isMobileView] = useMediaQuery("(max-width: 1028px)");

  return (
    <DashboardLayout>
      {isLoadingUserData ? (
        <div className="w-full flex justify-center items-center md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 py-[28px] px-[15px] lg:px-[31px]">
          <PageLoader />
        </div>
      ) : (
        <div className="w-full md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh]  px-[0px] lg:px-[31px]">
          <div className="flex h-[100%] flex-col lg:flex-row ">
            <Box
              bg="transparent-white"
              className="lg:w-[274px] h-[100%] lg:sticky lg:top-[99px] md:mr-[5px] mt-[10px]"
            >
              <div className="h-[503px] w-[100%] border border-1 border-[#CDCDCD] lg:w-[274px]  md:rounded-[12px] flex flex-col items-center pt-[22px] ">
                <Text color="green" mb="16px" fontSize="16px" fontWeight="500">
                  online
                </Text>
                <div className="relative w-[163px] profile-pic h-[163px] mb-[21px] rounded-[50%] overflow-hidden">
                  <img
                    src={
                      userInfo?.profile?.user?.image !== null
                        ? userInfo?.profile?.user?.image
                        : "/profileIcon.svg"
                    }
                    style={{
                      width: "163px",
                      height: "163px",
                      objectFit: "cover",
                    }}
                    alt="profile"
                    className="profile-img"
                    onError={handleOnError}
                  />

                  <Flex
                    justify="center"
                    align="center"
                    onClick={() => setViewEditProfilePicture(true)}
                    className="profile-pic__overlay absolute top-0 w-full h-full"
                  >
                    <Image src="/editProfileIcon.svg" alt="edit" />
                  </Flex>
                </div>
                <Text color="text" fontSize="20px" fontWeight="500" mb="6px">
                  {session?.user.firstname} {session?.user.lastname}
                </Text>

                <Box mb="31px" w="full">
                  <Flex w="full" justify="center" gap="22px" mb="8px">
                    {followStatistic?.topStatistic?.map((inner, index) => (
                      <Flex
                        direction="column"
                        align="center"
                        key={inner.name}
                        style={{
                          borderRight: index === 0 ? "1px solid #CDCDCD" : "",
                          paddingRight: index === 0 ? "22px" : "",
                        }}
                      >
                        <Text color="#293137" fontSize="20px" fontWeight="600">
                          {inner.val}
                        </Text>
                        <Text color="#758797" fontSize="18px" fontWeight="400">
                          {inner.name}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>

                  <Flex justify="center" align="center">
                    {followStatistic?.bottomStatistic?.map((inner) => (
                      <Flex key={inner.name} direction="column" align="center">
                        <Text color="#293137" fontSize="20px" fontWeight="600">
                          {inner.val}
                        </Text>
                        <Text color="#758797" fontSize="18px" fontWeight="400">
                          {inner.name}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Box>

                <div className="flex gap-x-[14px]">
                  <Flex
                    w="108px"
                    h="49px"
                    align="center"
                    justify="center"
                    borderRadius="26.703px"
                    bg="#EAF2EA"
                    gap="5px"
                  >
                    <Image
                      src={
                        userTypeIcon[
                          userData?.user?.roles[0]?.toLowerCase() as string
                        ]?.img
                      }
                      alt="user"
                      w="19.077px"
                      h="22.058px"
                    />
                    <Text fontSize="18px" fontWeight="600" color="#00B127">
                      {uppercaseFirsLetter(userData?.user?.roles[0])}
                    </Text>
                  </Flex>
                  <Flex
                    justify="center"
                    align="center"
                    borderRadius="7.121px"
                    bg="#EAF2EA"
                    cursor="pointer"
                    width="48.956px"
                    height="48.956px"
                  >
                    <Image src="/shareSocial2.svg" alt="share" />
                  </Flex>
                </div>
              </div>
              <div className="h-[182px] mt-[5px] md:mt-[24px]  lg:w-[274px] md:rounded-[12px] border border-1 border-[#CDCDCD] px-[18px] pt-[11px] pb-[18px]">
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
                className="flex z-[99] gap-y-[10px] w-full lg:w-[calc(100%-543px)] lg:-mt-[30px] backdrop-blur-[15px] md:pt-[29px] lg:fixed lg: top-[99px] gap-x-[20px] lg:gap-x-[54px] lg:pl-[26px] mr-[31px] bg-brand-profile-header border-t-0 border-[3px] border-x-0 lg:border-b-brand-300"
              >
                {profileSections?.map((section, index) => (
                  <Box
                    key={index}
                    minW="fit-content"
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
                    <Link
                      href={section?.href}
                      className={`z-[22] -mb-[3px] lg:-mb-[3px] cursor-pointer`}
                      _hover={{
                        textUnderline: "none",
                        color: "secondary-blue",
                      }}
                      color={
                        currentSection === index + 1
                          ? "secondary-blue"
                          : "grey-1"
                      }
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
                    </Link>
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
                    <AboutMe
                      onClickEditProfile={() => setOpenEditProfileModal(true)}
                      onClickEditCareer={() =>
                        setOpenEditCareerProgressModal(true)
                      }
                    />
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

          {openEditProfileModal && (
            <EditProfile onClose={() => setOpenEditProfileModal(false)} />
          )}

          {openEditCareerProgressModal && (
            <EditCareerProgress
              onClose={() => setOpenEditCareerProgressModal(false)}
            />
          )}

          {viewProfilePicture && (
            <ViewProfileImg onClose={() => setViewProfilePicture(false)} />
          )}

          {viewEditProfilePicture && (
            <EditProfileAndExperience
              onClose={() => setViewEditProfilePicture(false)}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Index;
