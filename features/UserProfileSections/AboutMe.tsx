import { useSession } from "next-auth/react";
import NextImage from "next/image";
import { useRouter } from "next/router";
import { Flex, Box, Image, Text, Button } from "@chakra-ui/react";
import { uppercaseFirsLetter } from "@/libs/utils";

import {
  useGetAchievements,
  useGetAppearances,
  useGetMyProfile,
} from "@/api/profile";
import { useFollowUser } from "@/api/players";
import { useQueryClient } from "@tanstack/react-query";
import notify from "@/libs/toast";
import { useGetAllHashtags } from "@/api/dashboard";
import ProfileVectorIcon from "@/assets/svgFiles/ProfileVector.svg.next";

const AboutMe = () => {
  const { data: session } = useSession();

  const socialProfiles = [
    { name: "facebook", link: "#", icon: "/fbIcon.svg" },
    { name: "twitter", link: "#", icon: "/twIcon.svg" },
    { name: "linkedin", link: "#", icon: "/linkedinIcon.svg" },
    { name: "instagram", link: "#", icon: "/instaIcon.svg" },
  ];

  const router = useRouter();
  const { id } = router.query;

  const TOKEN = session?.user?.access;

  const { data: userProfile } = useGetMyProfile({
    token: TOKEN as string,
    userId: id as string,
  });

  const { data: achievements } = useGetAchievements({
    token: TOKEN as string,
    userId: id as string,
  });

  const { data: appearances } = useGetAppearances({
    token: TOKEN as string,
    userId: id as string,
  });

  const { mutate: followUser, isLoading: isFollowingPlayer } = useFollowUser();
  const queryClient = useQueryClient();

  const { data: hashtags } = useGetAllHashtags(TOKEN as string);
  const dropdownOfHashtags = hashtags?.results?.map((hashtag: any) => {
    return {
      value: hashtag?.id,
      label: hashtag?.hashtag,
    };
  });

  const interestValues = userProfile?.interests?.map((val: any) => {
    const interestValue = dropdownOfHashtags?.filter(
      (innerVal: any) => innerVal?.value === val
    )[0]?.label;
    return interestValue;
  });

  return (
    <div>
      <Flex
        border="1px solid"
        borderColor="#CDCDCD"
        width="full"
        justify="space-between"
        align="center"
        p="9px 19px"
        marginTop="17px"
      >
        <Flex gap="15px" align="center">
          <Image
            src="/arrow-back.svg"
            alt="arrow back"
            onClick={() => router.back()}
          />
          <Text fontWeight="600" lineHeight="30.03px" fontSize="22px">
            About {userProfile?.user.firstname}
          </Text>
        </Flex>
        <Button
          bg="#293137"
          color="#fff"
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
                    text: `You  ${
                      userProfile?.is_following
                        ? "have unfollowed"
                        : "are now following"
                    } ${userProfile?.user?.firstname} ${
                      userProfile?.user?.lastname
                    }`,
                  });
                },
              }
            );
          }}
        >
          {userProfile?.is_following ? "Unfollow" : "Follow"}
        </Button>
      </Flex>
      <Box
        border="1px solid"
        borderColor="#CDCDCD"
        className="w-[calc(100%-11px)] bg-brand-500 mt-[6px] px-[24] lg:px-[41px] pt-[24px] pr-[24px] lg:pr-[29px] pb-[39.67px]"
      >
        <h3 className="text-brand-text font-bold text-[24px] leading-[36px]">
          {userProfile?.user.firstname} {userProfile?.user.lastname}
        </h3>
        <h3 className="text-brand-text font-normal text-[16px] leading-[24px]">
          {uppercaseFirsLetter(userProfile?.user?.roles[0] as string)} |{" "}
          {userProfile?.position?.join("")}
        </h3>
        <div className="mt-[18.95px] flex items-center gap-[16px]">
          <span className="flex mt-[7px] items-center">
            <NextImage src={"/call.svg"} alt="phone" width="20" height="20" />
            <p className="ml-[7px]  text-[16px] leading-[18px] text-brand-600">
              {userProfile?.phone_number
                ? userProfile?.phone_number
                : "Unavailable"}
            </p>
          </span>

          <ProfileVectorIcon />

          <span className="flex mt-[7px] items-center">
            <NextImage src={"/mail.svg"} alt="sport" width="20" height="20" />
            <p className="ml-[7px]  text-[16px] leading-[18px] text-brand-600">
              {userProfile?.user?.email
                ? userProfile?.user?.email
                : "Unavailable"}
            </p>
          </span>

          <ProfileVectorIcon />

          <span className="flex mt-[7px] items-center">
            <NextImage src={"/location.svg"} alt="map" width="20" height="20" />
            <div className="ml-[7px] text-[16px] leading-[18px] text-brand-600">
              <p>
                {userProfile?.location
                  ? userProfile?.location?.join(", ")
                  : "Unavailable"}
              </p>
            </div>
          </span>
        </div>
        <div className="mt-[32px]">
          <h3 className="text-brand-text mb-[5.5px] font-semibold text-[18px]">
            Intro
          </h3>
          <p className="mb-[5px] text-brand-text text-[18px] font-normal leading-[33.03px]">
            {userProfile?.biography
              ? userProfile?.biography?.slice(0, 100)
              : "Say something interesting about me"}
          </p>
          {userProfile && userProfile?.biography?.length > 100 && (
            <div className="flex gap-x-[5px] cursor-pointer">
              <p className="text-brand-text text-[18px] font-semibold leading-[18px]">
                Read more
              </p>
              <p className="rotate-90 text-brand-text text-[20px] leading-[30px] font-medium -mt-[6px]">
                {">"}
              </p>
            </div>
          )}
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-text mb-[5px] font-semibold text-[18px] leading-[183.5%]">
            Goal
          </h3>
          <p className="mb-[5px] text-brand-50 text-[18px] font-normal leading-[18px]">
            {userProfile?.career_goals && userProfile?.career_goals?.length > 0
              ? userProfile?.career_goals?.join(", ")
              : "What I aspire to become in the nearest future."}
          </p>
          {userProfile && userProfile?.career_goals?.length > 100 && (
            <div className="flex gap-x-[5px] cursor-pointer">
              <p className="text-brand-text text-[18px] font-semibold leading-[18px]">
                Read more
              </p>
              <p className="rotate-90 text-brand-text text-[20px] leading-[30px] font-medium -mt-[6px]">
                {">"}
              </p>
            </div>
          )}
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-text mb-[16px] font-semibold text-[18px] leading-[183.5%]">
            Likes to talk about
          </h3>
          <div className="flex gap-x-[12px] gap-y-[10px] flex-wrap">
            {userProfile?.interests?.length === 0 ||
            userProfile?.interests === null ? (
              <p className="text-brand-text text-[18px] font-normal leading-[18px]">
                Topics I find interesting will be added here.
              </p>
            ) : (
              interestValues?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="px-[16px] py-[8px]  text-[18px] rounded-[4px] text-brand-text border-[1.2px] border-solid border-brand-text flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-text mb-[16px] font-semibold text-[18px] leading-[183.5%]">
            Social profiles
          </h3>
          <div className="flex gap-x-[12px]">
            {!userProfile?.socials?.facebook &&
              !userProfile?.socials?.twitter &&
              !userProfile?.socials?.instagram &&
              !userProfile?.socials?.linkedin && (
                <p className="text-brand-text text-[18px] font-normal leading-[18px]">
                  My socials will show up here when added.
                </p>
              )}

            {userProfile?.socials?.facebook && (
              <a
                href={userProfile?.socials?.facebook}
                target="_blank"
                rel="noreferrer"
              >
                <div className="w-[35px] h-[35px] rounded-[4px] bg-brand-2300 border-[1.2px] border-solid border-brand-2350 flex justify-center items-center">
                  <NextImage
                    src={socialProfiles[0].icon}
                    width="18"
                    height="18"
                    alt="profile"
                  />
                </div>
              </a>
            )}
            {userProfile?.socials?.twitter && (
              <a
                href={userProfile?.socials?.twitter}
                target="_blank"
                rel="noreferrer"
              >
                <div className="w-[35px] h-[35px] rounded-[4px] bg-brand-2300 border-[1.2px] border-solid border-brand-2350 flex justify-center items-center">
                  <NextImage
                    src={socialProfiles[1].icon}
                    width="18"
                    height="18"
                    alt="profile"
                  />
                </div>
              </a>
            )}
            {userProfile?.socials?.linkedin && (
              <a
                href={userProfile?.socials?.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <div className="w-[35px] h-[35px] rounded-[4px] bg-brand-2300 border-[1.2px] border-solid border-brand-2350 flex justify-center items-center">
                  <NextImage
                    src={socialProfiles[2].icon}
                    width="18"
                    height="18"
                    alt="profile"
                  />
                </div>
              </a>
            )}
            {userProfile?.socials?.instagram && (
              <a
                href={userProfile?.socials?.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <div className="w-[35px] h-[35px] rounded-[4px] bg-brand-2300 border-[1.2px] border-solid border-brand-2350 flex justify-center items-center">
                  <NextImage
                    src={socialProfiles[3].icon}
                    width="18"
                    height="18"
                    alt="profile"
                  />
                </div>
              </a>
            )}
          </div>
        </div>
      </Box>
      <Box
        border="1px solid"
        borderColor="#CDCDCD"
        className="w-[calc(100%-11px)] mt-[9px] bg-brand-500 pl-[24px] md:pl-[43px] pt-[26px] pb-[54px] pr-[24px] md:pr-[33px]"
      >
        <div className="flex w-full justify-between items-center mb-[31px]">
          <h2 className="text-brand-text font-medium text-[20px]">
            Career Progress
          </h2>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-text mb-[12px] font-semibold text-[18px] leading-[27px]">
            Awards & Trophies
          </h3>
          <p className="mb-[14px] text-brand-text text-[18px] font-normal leading-[18px]">
            {achievements?.pages?.flat(1)?.length === 0 ? (
              <p>My wins and my accomplishments.</p>
            ) : (
              achievements?.pages
                ?.flat(1)
                ?.map((achievement: any, index: number) => (
                  <b key={index} className="font-normal">
                    {achievement?.title}, {achievement?.month}{" "}
                    {achievement?.year}
                    {index !== achievements?.pages?.flat(1)?.length - 1
                      ? ";"
                      : "."}{" "}
                  </b>
                ))
            )}
            {/* {achievements?.pages?.flat(1) &&
              achievements?.pages?.flat(1)?.length > 3 && (
                <b className="font-semibold cursor-pointer">VIEW ALL</b>
              )} */}
          </p>
        </div>

        <div className="mt-[30px]">
          <h3 className="text-brand-text mb-[12px] font-semibold text-[18px] leading-[183.5%]">
            Teams Played With
          </h3>
          <div className="flex gap-x-[12px] w-full gap-y-[10px] flex-wrap">
            {userProfile?.teams?.length === 0 || userProfile?.teams === null ? (
              <p className="text-brand-text text-[18px] font-normal leading-[18px]">
                The teams and sports association I once played with (both
                current past).
              </p>
            ) : (
              userProfile?.teams?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="px-[16px] py-[8px]  text-[12px] rounded-[2px] text-brand-text border-[1.2px] border-solid border-brand-text flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-text mb-[12px] font-semibold text-[18px] leading-[183.5%]">
            Special Abilities
          </h3>
          <div className="flex gap-x-[12px] gap-y-[10px] flex-wrap">
            {userProfile?.abilities && userProfile?.abilities?.length > 0 ? (
              userProfile?.abilities?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="px-[16px] py-[8px] text-[18px] rounded-[2px] text-brand-text border-[1.2px] border-solid border-brand-text flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-brand-text text-[18px] font-normal leading-[18px]">
                special gifts I possess as an athlete or sports professional.
              </p>
            )}
          </div>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-text mb-[12px] font-semibold text-[18px] leading-[183.5%]">
            Skills
          </h3>
          <div className="flex gap-x-[12px] gap-y-[10px] flex-wrap">
            {userProfile?.skills && userProfile?.skills?.length > 0 ? (
              userProfile?.skills?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="px-[16px] py-[8px] text-[18px] rounded-[2px] text-brand-text border-[1.2px] border-solid border-brand-text flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-brand-text text-[18px] font-normal leading-[18px]">
                The amazing skills that I have
              </p>
            )}
          </div>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-text mb-[12px] font-semibold text-[18px] leading-[183.5%]">
            Training Courses
          </h3>
          <div className="flex gap-x-[12px] gap-y-[10px] flex-wrap">
            {userProfile?.trainings && userProfile?.trainings?.length > 0 ? (
              [...userProfile?.trainings]?.map((item, index) => (
                <div
                  key={index}
                  className="px-[16px] py-[8px] text-[18px] rounded-[2px] text-brand-text border-[1.2px] border-solid border-brand-text flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-brand-text text-[18px] font-normal leading-[18px]">
                Courses I take/took will appear here.
              </p>
            )}
          </div>
        </div>
      </Box>
    </div>
  );
};

export default AboutMe;
