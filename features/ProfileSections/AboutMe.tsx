/* eslint-disable @next/next/no-html-link-for-pages */
import { useSession } from "next-auth/react";
import NextImage from "next/image";

import { useTypedSelector } from "@/hooks/hooks";
import { useGetAchievements, useGetAppearances } from "@/api/profile";
import { useGetAllHashtags } from "@/api/dashboard";
import { Flex, Box, Image, Text, Button } from "@chakra-ui/react";
import { uppercaseFirsLetter } from "@/libs/utils";
import ProfileVectorIcon from "@/assets/svgFiles/ProfileVector.svg.next";
import { useRouter } from "next/router";

const AboutMe = ({
  onClickEditProfile,
  onClickEditCareer,
}: {
  onClickEditProfile: any;
  onClickEditCareer: any;
}) => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const USER_ID = session?.user?.id;

  const { userInfo } = useTypedSelector((state) => state.profile);

  const socialProfiles = [
    { name: "facebook", link: "#", icon: "/fbIcon.svg" },
    { name: "twitter", link: "#", icon: "/twIcon.svg" },
    { name: "linkedin", link: "#", icon: "/linkedinIcon.svg" },
    { name: "instagram", link: "#", icon: "/instaIcon.svg" },
  ];

  const { data: achievements } = useGetAchievements({
    token: TOKEN as string,
    userId: USER_ID as string,
  });

  const { data: appearances } = useGetAppearances({
    token: TOKEN as string,
    userId: USER_ID as string,
  });

  const { data: hashtags } = useGetAllHashtags(TOKEN as string);
  const dropdownOfHashtags = hashtags?.results?.map((hashtag: any) => {
    return {
      value: hashtag?.id,
      label: hashtag?.hashtag,
    };
  });

  const interestValues = userInfo?.profile?.interests?.map((val: any) => {
    const interestValue = dropdownOfHashtags?.filter(
      (innerVal: any) => innerVal?.value === val
    )[0]?.label;
    return interestValue;
  });

  const router = useRouter();

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
            About Me
          </Text>
        </Flex>
        <Button bg="#293137" color="#fff">
          Add New
        </Button>
      </Flex>
      <Box
        border="1px solid"
        borderColor="#CDCDCD"
        className="w-[calc(100%-11px)] bg-brand-500 mt-[6px] px-[24] lg:px-[41px] pt-[24px] pr-[24px] lg:pr-[29px] pb-[39.67px]"
      >
        <div className="flex justify-between mb-2">
          <h3 className="text-brand-text font-bold text-[24px] leading-[36px]">
            {session?.user.firstname} {session?.user.lastname}
          </h3>
          <NextImage
            src="/editBtn.svg"
            alt="edit"
            width="104"
            height="45"
            className="cursor-pointer"
            onClick={onClickEditProfile}
          />
        </div>
        <h3 className="text-brand-text font-normal text-[16px] leading-[24px]">
          {uppercaseFirsLetter(userInfo?.profile?.user?.roles[0] as string)} |{" "}
          {userInfo?.profile?.position}
        </h3>
        <div className="mt-[18.95px] flex items-center gap-[16px]">
          <span className="flex mt-[7px] items-center">
            <NextImage src={"/call.svg"} alt="phone" width="20" height="20" />
            <p className="ml-[7px]  text-[16px] leading-[18px] text-brand-600">
              {userInfo?.profile?.phone_number
                ? userInfo?.profile?.phone_number
                : "Unavailable"}
            </p>
          </span>

          <ProfileVectorIcon />

          <span className="flex mt-[7px] items-center">
            <NextImage src={"/mail.svg"} alt="sport" width="20" height="20" />
            <p className="ml-[7px]  text-[16px] leading-[18px] text-brand-600">
              {session?.user?.email ? session?.user?.email : "Unavailable"}
            </p>
          </span>

          <ProfileVectorIcon />

          <span className="flex items-center">
            <NextImage src={"/location.svg"} alt="map" width="20" height="20" />
            <div className="ml-[7px] text-[16px] leading-[18px] text-brand-600">
              <p>
                {userInfo?.profile?.location
                  ? userInfo?.profile?.location?.join(", ")
                  : "Unavailable"}
              </p>
            </div>
          </span>
        </div>
        <div className="mt-[32px]">
          <h3 className="text-brand-text mb-[5.5px] font-semibold text-[18px]">
            Intro
          </h3>
          <p className="mb-[5px] text-brand-50 text-[18px] font-normal leading-[33.03px]">
            {userInfo?.profile?.biography
              ? userInfo?.profile?.biography?.slice(0, 100)
              : "Say something interesting about you"}
          </p>
          {!userInfo?.profile?.biography && (
            <p
              className="cursor-pointer text-brand-600 text-[18px] font-normal"
              onClick={onClickEditProfile}
            >
              {"Add intro >"}
            </p>
          )}
          {userInfo?.profile && userInfo?.profile?.biography?.length > 100 && (
            <div className="flex gap-x-[5px] cursor-pointer">
              <p className="text-brand-90 text-[12px] font-semibold leading-[18px]">
                Read more
              </p>
              <p className="rotate-90 text-brand-90 text-[20px] leading-[30px] font-medium -mt-[6px]">
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
            {userInfo?.profile?.career_goals &&
            userInfo?.profile?.career_goals?.length > 0
              ? userInfo?.profile?.career_goals?.join(", ")
              : "What you aspire to become in the nearest future."}
          </p>
          {userInfo?.profile &&
            userInfo?.profile?.career_goals.length === 0 && (
              <p
                className="cursor-pointer text-brand-600 text-[18px] font-normal"
                onClick={onClickEditProfile}
              >
                {"Add goal >"}
              </p>
            )}
          {userInfo?.profile &&
            userInfo?.profile?.career_goals?.length > 100 && (
              <div className="flex gap-x-[5px] cursor-pointer">
                <p className="text-brand-90 text-[12px] font-semibold leading-[18px]">
                  Read more
                </p>
                <p className="rotate-90 text-brand-90 text-[20px] leading-[30px] font-medium -mt-[6px]">
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
            {userInfo?.profile?.interests?.length === 0 ||
            userInfo?.profile?.interests === null ? (
              <p className="text-brand-text text-[18px] font-normal leading-[18px]">
                Topics you find interesting you can add them here.
              </p>
            ) : (
              interestValues?.map((item, index) => (
                <div
                  key={index}
                  className="px-[8px] py-[16px] font-medium text-[16px] rounded-[2px] text-brand-text border-[1.2px] border-solid border-brand-text flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            )}
          </div>
          {(userInfo?.profile?.interests?.length === 0 ||
            userInfo?.profile?.interests === null) && (
            <p
              className="cursor-pointer text-brand-600 text-[18px] font-normal"
              onClick={onClickEditProfile}
            >
              {"Add interests >"}
            </p>
          )}
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-text mb-[14.11px] font-semibold text-[18px] leading-[183.5%]">
            Social profiles
          </h3>
          <div className="flex gap-x-[12px]">
            {!userInfo?.profile?.socials?.facebook &&
              !userInfo?.profile?.socials?.twitter &&
              !userInfo?.profile?.socials?.instagram &&
              !userInfo?.profile?.socials?.linkedin && (
                <p className="text-brand-text text-[18px] font-normal leading-[18px]">
                  Add your social media profiles.
                </p>
              )}
            {userInfo?.profile?.socials?.facebook && (
              <a
                href={userInfo?.profile?.socials?.facebook}
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

            {userInfo?.profile?.socials?.twitter && (
              <a
                href={userInfo?.profile?.socials?.twitter}
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
            {userInfo?.profile?.socials?.linkedin && (
              <a
                href={userInfo?.profile?.socials?.linkedin}
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
            {userInfo?.profile?.socials?.instagram && (
              <a
                href={userInfo?.profile?.socials?.instagram}
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
          {!userInfo?.profile?.socials?.facebook &&
            !userInfo?.profile?.socials?.twitter &&
            !userInfo?.profile?.socials?.instagram &&
            !userInfo?.profile?.socials?.linkedin && (
              <p
                className="cursor-pointer text-brand-600 text-[18px] font-normal mt-[8px]"
                onClick={onClickEditProfile}
              >
                {"Add social profiles >"}
              </p>
            )}
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
          <NextImage
            src="/editBtn.svg"
            alt="edit"
            width="104"
            height="45"
            className="cursor-pointer"
            onClick={onClickEditCareer}
          />
        </div>
        <div className="mt-[36px]">
          <h3 className="text-brand-text mb-[12px] font-semibold text-[18px] leading-[27px]">
            Awards & Trophies
          </h3>
          <p className="mb-[14px] text-brand-text text-[18px] font-normal leading-[18px]">
            {achievements?.pages?.flat(1)?.length === 0 ? (
              <p>
                Showcase your wins and let other athletes have a feel of your
                accomplishments.
              </p>
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
          </p>
          {achievements?.pages?.flat(1)?.length === 0 && (
            <p
              className="cursor-pointer text-brand-600 text-[18px] font-normal mt-[8px]"
              onClick={onClickEditCareer}
            >
              {"Add awards >"}
            </p>
          )}
        </div>

        <div className="mt-[30px]">
          <h3 className="text-brand-text mb-[12px] font-semibold text-[18px] leading-[183.5%]">
            Teams Played With
          </h3>
          <div className="flex gap-x-[12px] w-full gap-y-[10px] flex-wrap">
            {userInfo?.profile?.teams?.length === 0 ||
            userInfo?.profile?.teams === null ? (
              <p className="text-brand-text text-[18px] font-normal leading-[18px]">
                Add teams and sports association you once played with (both
                current past).
              </p>
            ) : (
              userInfo?.profile?.teams?.map((item, index) => (
                <div
                  key={index}
                  className="px-[16px] py-[8px] bg-brand-2300 text-[18px] rounded-[2px] text-brand-text border-[1.2px] border-solid border-brand-2350 flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            )}
          </div>
          {(userInfo?.profile?.teams?.length === 0 ||
            userInfo?.profile?.teams === null) && (
            <p
              className="cursor-pointer text-brand-600 text-[18px] font-normal mt-[12px]"
              onClick={onClickEditCareer}
            >
              {"Add teams >"}
            </p>
          )}
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-text mb-[12px] font-semibold text-[18px] leading-[183.5%]">
            Special Abilities
          </h3>
          <div className="flex gap-x-[12px] gap-y-[10px] flex-wrap">
            {userInfo?.profile?.abilities &&
            userInfo?.profile?.abilities?.length > 0 ? (
              userInfo?.profile?.abilities?.map((item, index) => (
                <div
                  key={index}
                  className="px-[16px] py-[8px] text-[18px] rounded-[2px] text-brand-text border-[1.2px] border-solid border-brand-text flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-[18px] text-brand-text">
                Those special gifts you possess as an athlete or sports
                professional.
              </p>
            )}
          </div>
          {(!userInfo?.profile?.abilities ||
            userInfo?.profile?.abilities?.length === 0) && (
            <p
              className="cursor-pointer text-brand-600 text-[18px] font-normal mt-[12px]"
              onClick={onClickEditCareer}
            >
              {"Add special abilities >"}
            </p>
          )}
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-text mb-[12px] font-semibold text-[18px] leading-[183.5%]">
            Skills
          </h3>
          <div className="flex gap-x-[12px] gap-y-[10px] flex-wrap">
            {userInfo?.profile?.skills &&
            userInfo?.profile?.skills?.length > 0 ? (
              userInfo?.profile?.skills?.map((item, index) => (
                <div
                  key={index}
                  className="px-[16px] py-[8px] text-[18px] rounded-[2px] text-brand-text border-[1.2px] border-solid border-brand-text flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-[11px] text-brand-text">
                Let other athletes know that you have amazing skills.
              </p>
            )}
          </div>
          {(!userInfo?.profile?.skills ||
            userInfo?.profile?.skills?.length === 0) && (
            <p
              className="cursor-pointer text-brand-600 text-[18px] font-normal mt-[12px]"
              onClick={onClickEditCareer}
            >
              {"Add special abilities >"}
            </p>
          )}
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-text mb-[12px] font-semibold text-[18px] leading-[183.5%]">
            Training Courses
          </h3>
          <div className="flex gap-x-[12px] gap-y-[10px] flex-wrap">
            {userInfo?.profile?.trainings &&
            userInfo?.profile?.trainings?.length > 0 ? (
              [...userInfo?.profile?.trainings]?.map((item, index) => (
                <div
                  key={index}
                  className="px-[11px] py-[10px] text-[18px] rounded-[2px] text-brand-text border-[1.2px] border-solid border-brand-text flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-[18px] text-brand-text">
                Courses you take/took will appear here.
              </p>
            )}
          </div>
          {(!userInfo?.profile?.trainings ||
            userInfo?.profile?.trainings?.length === 0) && (
            <p
              className="cursor-pointer text-brand-600 text-[18px] font-normal mt-[12px]"
              onClick={onClickEditCareer}
            >
              {"Add special abilities >"}
            </p>
          )}
        </div>
      </Box>
    </div>
  );
};

export default AboutMe;
