/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import {
  Box,
  useMediaQuery,
  Text,
  Flex,
  Image,
  Button,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

import { DashboardLayout } from "@/layout/Dashboard";
import profilePhotos1 from "@/assets/profilePhotos1.png";
import { useTypedSelector } from "@/hooks/hooks";
import ProfileImg from "@/assets/profileIcon.svg";
import AboutMe from "./UserProfileSections/AboutMe";
import { useGetMyProfile, useGetUserPhotos } from "@/api/profile";
import {
  handleMediaPostError,
  handleOnError,
  uppercaseFirsLetter,
  userTypeIcon,
} from "@/libs/utils";
import { useFollowUser } from "@/api/players";
import notify from "@/libs/toast";
import {
  setMessagingUserId,
  setMessagingUserInfo,
} from "@/store/slices/messagingSlice";
import { useTypedDispatch } from "@/hooks/hooks";


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

  const { mutate: followUser, isLoading: isFollowingPlayer } = useFollowUser();
  const queryClient = useQueryClient();

  const followStatistic = {
    topStatistic: [
      { name: "Following", val: userProfile?.following },
      { name: "Followers", val: userProfile?.followers },
    ],
    bottomStatistic: [
      {
        name: `Year${
          userProfile?.years_of_experience &&
          userProfile?.years_of_experience > 1
            ? "s "
            : " "
        } Experience`,
        val: userProfile?.years_of_experience ?? 1,
      },
    ],
  };

  const settingIcons = [
    { img: "/notification.svg", onClick: () => {} },
    { img: "/shareSocial2.svg", onClick: () => {} },
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
  const dispatch = useTypedDispatch();


  const startMessaging = () => {
    dispatch(setMessagingUserId(id));
    dispatch(
      setMessagingUserInfo({
        id: userProfile?.user?.id,
        name: `${userProfile?.user?.firstname} ${userProfile?.user?.lastname}`,
        img: userProfile?.user?.image,
      })
    );

    router.push("/messaging");
  };

  const [isMobileView] = useMediaQuery("(max-width: 1200px)");
  const [isMobileView1] = useMediaQuery("(max-width: 769px)");

  return (
    <DashboardLayout>
      {userInfo?.loading ? (
        <div className="w-full flex justify-center items-center md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 py-[28px] px-[15px] lg:px-[11px]">
          <PageLoader />
        </div>
      ) : (
        <div className="w-full md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] 2xl:min-h-[calc(85vh-60px)] px-[0px]">
          <div className="flex h-[100%] flex-col lg:flex-row ">
            <div className="px-[0px] lg:px-[11px] min-h-[100vh]">
              <Box
                bg="transparent-white"
                className="lg:w-[274px] h-[100%] lg:fixed lg:overflow-y-scroll lg:top-[73px] 2xl:top-[100px] md:mr-[5px]"
              >
                <div className="h-[636px] w-[100%] lg:w-[274px] bg-brand-500 md:rounded-[12px] border border-1 border-[#CDCDCD] flex flex-col items-center pt-[22px] ">
                  <Text
                    color={userProfile?.user?.is_online ? "#00B127" : "#758797"}
                    className="mb-[16px] opacity-50 text-[11px] lg:text-[13px] font-semibold"
                    fontSize="18px"
                    fontWeight="600"
                  >
                    {userProfile?.user?.is_online ? "Online" : "Offline"}
                  </Text>
                  <div className="w-[155px] h-[155px] mb-[16px] rounded-[50%] overflow-hidden">
                    <img
                      src={
                        userProfile?.user?.image !== null
                          ? userProfile?.user?.image
                          : ProfileImg
                      }
                      style={{
                        width: "155px",
                        height: "155px",
                        objectFit: "cover",
                      }}
                      alt="profile"
                      className="profile-img"
                      onError={handleOnError}
                    />
                  </div>

                  <Text
                    color="#293137"
                    fontSize="22px"
                    fontWeight="600"
                    mb="17px"
                  >
                    {userProfile?.user?.firstname} {userProfile?.user?.lastname}
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
                          <Text
                            color="#293137"
                            fontSize="20px"
                            fontWeight="600"
                          >
                            {inner.val}
                          </Text>
                          <Text
                            color="#758797"
                            fontSize="18px"
                            fontWeight="400"
                          >
                            {inner.name}
                          </Text>
                        </Flex>
                      ))}
                    </Flex>

                    <Flex justify="center" align="center">
                      {followStatistic?.bottomStatistic?.map((inner) => (
                        <Flex
                          key={inner.name}
                          direction="column"
                          align="center"
                        >
                          <Text
                            color="#293137"
                            fontSize="20px"
                            fontWeight="600"
                          >
                            {inner.val}
                          </Text>
                          <Text
                            color="#758797"
                            fontSize="18px"
                            fontWeight="400"
                          >
                            {inner.name}
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  </Box>

                  <div className="flex gap-x-[8.6px] mb-[16px]">
                    <Flex
                      w="108px"
                      h="43px"
                      align="center"
                      justify="center"
                      borderRadius="26.703px"
                      bg="#EAF2EA"
                      gap="5px"
                    >
                      <Image
                        src={
                          userTypeIcon[
                            userProfile?.user?.roles[0]?.toLowerCase() as string
                          ]?.img
                        }
                        alt="user"
                        w="19.077px"
                        h="22.058px"
                      />
                      <Text fontSize="18px" fontWeight="600" color="#00B127">
                        {uppercaseFirsLetter(userProfile?.user?.roles[0])}
                      </Text>
                    </Flex>
                    <Flex
                      justify="center"
                      align="center"
                      bg="#EAF2EA"
                      borderRadius="23.232px"
                      w="126.852px"
                      h="42.593px"
                    >
                      <Image src="/send.svg" />
                      <Text fontSize="16px" fontWeight="600">
                        Message
                      </Text>
                    </Flex>
                  </div>

                  <Flex gap="8.6px" mb="42.57px">
                    {settingIcons?.map((inner) => (
                      <Flex
                        justify="center"
                        align="center"
                        cursor="pointer"
                        key={inner.img}
                        bg="#EAF2EA"
                        borderRadius="6.462px"
                        width="44.427px"
                        height="44.427px"
                      >
                        <Image src={inner.img} />
                      </Flex>
                    ))}
                  </Flex>

                  <Button
                    w="102px"
                    h="38px"
                    bg="#293137"
                    borderRadius="19px"
                    color="#fff"
                    fontSize="18px"
                    onClick={() => {
                      followUser(
                        { token: TOKEN as string, userId: id as string },
                        {
                          onSuccess: () => {
                            queryClient.invalidateQueries(["getAllPlayers"]);
                            queryClient.invalidateQueries(["getAllCoaches"]);
                            queryClient.invalidateQueries(["getAllTrainers"]);
                            queryClient.invalidateQueries(["getAllAgents"]);
                            queryClient.invalidateQueries(["getMyProfile"]);
                            notify({
                              type: "success",
                              text: `You are now following ${userProfile?.user?.firstname} ${userProfile?.user?.lastname}`,
                            });
                          },
                        }
                      );
                    }}
                    isLoading={isFollowingPlayer}
                  >
                    {userProfile?.is_following ? "Unfollow" : "Follow"}
                  </Button>
                </div>
                <div className="h-[182px] mt-[5px] md:mt-[24px] bg-brand-500 lg:w-[274px] md:rounded-[12px] border border-1 border-[#CDCDCD] px-[18px] pt-[11px] pb-[18px]">
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
            </div>
            <Box
              borderLeft={{ md: "1px solid" }}
              borderLeftColor={{ md: "stroke" }}
              paddingTop="18px"
              className="w-full lg:ml-[274px] pb-[100px]"
            >
              <Box
                borderBottom="1px solid"
                borderColor="stroke"
                overflowX={isMobileView1 ? "scroll" : "unset"}
                paddingX={isMobileView ? "20px" : "30px"}
                className="flex z-[99] gap-y-[10px] w-full lg:w-[calc(100%-463px)] 2xl:max-w-[calc(70vw-523px)] lg:-mt-[40px] 2xl:mt-[4rem] backdrop-blur-[15px] md:pt-[29px] lg:fixed lg: top-[99px] gap-x-[20px] lg:gap-x-[54px] lg:pl-[26px] mr-[31px] bg-brand-profile-header border-t-0 border-[3px] border-x-0 lg:border-b-brand-300"
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
                          : "text-[#93A3B1]"
                      } mb-[11px] text-[11px] lg:text-[14px] font-semibold`}
                    >
                      {section.title}
                    </h3>
                  </Box>
                ))}
              </Box>

              <Box className="md:pt-[28px] -mt-[15px] lg:mt-[28px] xl:mt-0 w-full">
                <Box>
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
