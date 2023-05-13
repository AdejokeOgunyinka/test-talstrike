import { useSession } from "next-auth/react";
import NextImage from "next/image";

import { useTypedSelector } from "@/hooks/hooks";
import { useGetAchievements, useGetAppearances } from "@/api/profile";

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
  const teamsPlayedWith = [
    "Barcelona",
    "Real Madrid",
    "Arsenal",
    "Chelsea",
    "Manchester United",
  ];
  // const trainingCourses = ['Daily fitness', 'Webinar', 'How to score hat tricks'];
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

  return (
    <div className="mt-[28px]">
      <div className="w-full bg-brand-500 rounded-[12px] px-[50px] py-[37px]">
        <div className="flex w-full justify-between items-center mb-[31px]">
          <h2 className="text-brand-2000 font-medium text-[18px]">
            Personal Details
          </h2>
          <NextImage
            src="/editBtn.svg"
            alt="edit"
            width="104"
            height="45"
            className="cursor-pointer"
            onClick={onClickEditProfile}
          />
        </div>
        <h3 className="text-brand-2250 font-semibold text-[24px] leading-[36px]">
          {session?.user.firstname} {session?.user.lastname}
        </h3>
        <h3 className="text-brand-2000 font-semibold text-[16px] leading-[24px]">
          {userInfo?.profile?.position}
        </h3>
        <div className="mt-[34px]">
          <span className="flex items-start">
            <NextImage src={"/location.svg"} alt="map" width="20" height="20" />
            <div className="ml-[7px] text-[12px] leading-[18px] text-brand-600">
              <p>
                {userInfo?.profile?.location
                  ? userInfo?.profile?.location?.join(", ")
                  : "Unavailable"}
              </p>
            </div>
          </span>
          <span className="flex mt-[7px]">
            <NextImage src={"/call.svg"} alt="phone" width="20" height="20" />
            <p className="ml-[7px]  text-[12px] leading-[18px] text-brand-600">
              {userInfo?.profile?.phone_number
                ? userInfo?.profile?.phone_number
                : "Unavailable"}
            </p>
          </span>
          <span className="flex mt-[7px]">
            <NextImage src={"/mail.svg"} alt="sport" width="20" height="20" />
            <p className="ml-[7px]  text-[12px] leading-[18px] text-brand-600">
              {session?.user?.email ? session?.user?.email : "Unavailable"}
            </p>
          </span>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[13px] font-semibold text-[18px] leading-[183.5%]">
            About me
          </h3>
          <p className="mb-[14px] text-brand-50 text-[12px] font-normal leading-[18px]">
            {userInfo?.profile?.biography
              ? userInfo?.profile?.biography?.slice(0, 100)
              : "Unavailable"}
          </p>
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
          <h3 className="text-brand-600 mb-[13px] font-semibold text-[18px] leading-[183.5%]">
            My Career goal
          </h3>
          <p className="mb-[14px] text-brand-50 text-[12px] font-normal leading-[18px]">
            {userInfo?.profile?.career_goals &&
            userInfo?.profile?.career_goals?.length > 0
              ? userInfo?.profile?.career_goals?.join(", ")
              : "Unavailable"}
          </p>
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
          <h3 className="text-brand-600 mb-[19px] font-semibold text-[18px] leading-[183.5%]">
            Likes to talk about
          </h3>
          <div className="flex gap-x-[12px]">
            {userInfo?.profile?.interests?.map((item, index) => (
              <div
                key={index}
                className="px-[11px] py-[10px] bg-brand-2300 text-[12px] rounded-[4px] text-brand-600 border-[1.2px] border-solid border-brand-2350 flex justify-center items-center"
              >
                #{item}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[19px] font-semibold text-[18px] leading-[183.5%]">
            Social profiles
          </h3>
          <div className="flex gap-x-[12px]">
            {socialProfiles?.map((profile, index) => (
              <a
                key={index}
                href={profile.link}
                target="_blank"
                rel="noreferrer"
              >
                <div className="w-[35px] h-[35px] rounded-[4px] bg-brand-2300 border-[1.2px] border-solid border-brand-2350 flex justify-center items-center">
                  <NextImage
                    src={profile.icon}
                    width="18"
                    height="18"
                    alt="profile"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full mt-[18px] bg-brand-500 rounded-[12px] px-[50px] py-[37px]">
        <div className="flex w-full justify-between items-center mb-[31px]">
          <h2 className="text-brand-2000 font-medium text-[18px]">
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
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[13px] font-semibold text-[18px] leading-[27px]">
            Achievements & Trophies
          </h3>
          <p className="mb-[14px] text-brand-50 text-[12px] font-normal leading-[18px]">
            {achievements?.results?.length === 0 ? (
              <p>No achievement yet..</p>
            ) : (
              achievements?.results?.map((achievement: any, index: number) => (
                <b key={index} className="font-normal">
                  {achievement?.title}, {achievement?.month} {achievement?.year}
                  {index !== achievements?.results?.length - 1 ? ";" : "."}{" "}
                </b>
              ))
            )}
            {achievements?.results?.length > 5 && (
              <b className="font-semibold cursor-pointer">VIEW ALL</b>
            )}
          </p>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[13px] font-semibold text-[18px] leading-[27px]">
            Appearances
          </h3>
          <p className="mb-[14px] text-brand-50 text-[12px] font-normal leading-[18px]">
            {appearances?.results?.length === 0 ? (
              <p>No appearance yet..</p>
            ) : (
              appearances?.results?.map((appearance: any, index: number) => (
                <b key={index} className="font-normal">
                  {appearance?.tournament_title} (
                  {appearance?.number_of_appearances} appearances),{" "}
                  {appearance?.month} {appearance?.year}
                  {index !== appearances?.results?.length - 1 ? ";" : "."}{" "}
                </b>
              ))
            )}
            {appearances?.results?.length > 5 && (
              <b className="font-semibold cursor-pointer">VIEW ALL</b>
            )}
          </p>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[19px] font-semibold text-[18px] leading-[183.5%]">
            Teams Played With
          </h3>
          <div className="flex gap-x-[12px] w-full flex-wrap">
            {teamsPlayedWith?.map((item, index) => (
              <div
                key={index}
                className="px-[11px] py-[10px] bg-brand-2300 text-[12px] rounded-[4px] text-brand-600 border-[1.2px] border-solid border-brand-2350 flex justify-center items-center"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[19px] font-semibold text-[18px] leading-[183.5%]">
            Special Abilities
          </h3>
          <div className="flex gap-x-[12px]">
            {userInfo?.profile?.abilities ? (
              userInfo?.profile?.abilities?.map((item, index) => (
                <div
                  key={index}
                  className="px-[11px] py-[10px] bg-brand-2300 text-[12px] rounded-[4px] text-brand-600 border-[1.2px] border-solid border-brand-2350 flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-[11px] text-brand-600">Unavailable</p>
            )}
          </div>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[19px] font-semibold text-[18px] leading-[183.5%]">
            Skills
          </h3>
          <div className="flex gap-x-[12px]">
            {userInfo?.profile?.skills ? (
              userInfo?.profile?.skills?.map((item, index) => (
                <div
                  key={index}
                  className="px-[11px] py-[10px] bg-brand-2300 text-[12px] rounded-[4px] text-brand-600 border-[1.2px] border-solid border-brand-2350 flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-[11px] text-brand-600">Unavailable</p>
            )}
          </div>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[19px] font-semibold text-[18px] leading-[183.5%]">
            Training Courses
          </h3>
          <div className="flex gap-x-[12px]">
            {userInfo?.profile?.trainings ? (
              [userInfo?.profile?.trainings]?.map((item, index) => (
                <div
                  key={index}
                  className="px-[11px] py-[10px] bg-brand-2300 text-[12px] rounded-[4px] text-brand-600 border-[1.2px] border-solid border-brand-2350 flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-[11px] text-brand-600">Unavailable</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
