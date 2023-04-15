import { useSession } from "next-auth/react";
import NextImage from "next/image";
import { useRouter } from "next/router";

import { useTypedSelector } from "@/hooks/hooks";
import { useGetMyProfile } from "@/api/profile";

const AboutMe = () => {
  const { data: session } = useSession();
  const { userInfo } = useTypedSelector((state) => state.profile);
  const teamsPlayedWith = [
    "Barcelona",
    "Real Madrid",
    "Arsenal",
    "Chelsea",
    "Manchester United",
  ];
  const trainingCourses = [
    "Daily fitness",
    "Webinar",
    "How to score hat tricks",
  ];
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

  return (
    <div className="mt-[28px]">
      <div className="w-full bg-brand-500 rounded-[12px] px-[50px] py-[37px]">
        <div className="flex w-full justify-between items-center mb-[31px]">
          <h2 className="text-brand-2000 font-medium text-[18px]">
            Personal Details
          </h2>
          {!userProfile?.is_following && (
            <button className="bg-brand-600  w-[142px] h-[41px] rounded-[19px] font-semibold text-[12px] leading-[18px] text-brand-500">
              Follow {userProfile?.user?.firstname}
            </button>
          )}
        </div>
        <h3 className="text-brand-2250 font-semibold text-[24px] leading-[36px]">
          {userProfile?.user.firstname} {userProfile?.user.lastname}
        </h3>
        <h3 className="text-brand-2000 font-semibold text-[16px] leading-[24px]">
          {userInfo?.profile?.position}
        </h3>
        <div className="mt-[34px]">
          <span className="flex items-start">
            <NextImage src={"/location.svg"} alt="map" width="20" height="20" />
            <div className="ml-[7px] text-[12px] leading-[18px] text-brand-600">
              <p>
                {userProfile?.location
                  ? userProfile?.location?.join(", ")
                  : "Unavailable"}
              </p>
            </div>
          </span>
          <span className="flex mt-[7px]">
            <NextImage src={"/call.svg"} alt="phone" width="20" height="20" />
            <p className="ml-[7px]  text-[12px] leading-[18px] text-brand-600">
              {userProfile?.phone_number
                ? userProfile?.phone_number
                : "Unavailable"}
            </p>
          </span>
          <span className="flex mt-[7px]">
            <NextImage src={"/mail.svg"} alt="sport" width="20" height="20" />
            <p className="ml-[7px]  text-[12px] leading-[18px] text-brand-600">
              {userProfile?.user?.email
                ? userProfile?.user?.email
                : "Unavailable"}
            </p>
          </span>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[13px] font-semibold text-[18px] leading-[183.5%]">
            About me
          </h3>
          <p className="mb-[14px] text-brand-50 text-[12px] font-normal leading-[18px]">
            {userProfile?.biography
              ? userProfile?.biography?.slice(0, 100)
              : "Unavailable"}
          </p>
          {userProfile && userProfile?.biography?.length > 100 && (
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
            {userProfile?.career_goals && userProfile?.career_goals?.length > 0
              ? userInfo?.profile?.career_goals?.join(", ")
              : "Unavailable"}
          </p>
          {userProfile && userProfile?.career_goals?.length > 100 && (
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
            {userProfile?.interests && userProfile?.interests === null
              ? "Unavailable"
              : userProfile?.interests?.map((item: any, index: number) => (
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
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[13px] font-semibold text-[18px] leading-[27px]">
            Achievements & Trophies
          </h3>
          <p className="mb-[14px] text-brand-50 text-[12px] font-normal leading-[18px]">
            Most recent achievement title with date awarded,{" "}
            <b className="font-semibold cursor-pointer">VIEW ALL</b>
          </p>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[13px] font-semibold text-[18px] leading-[27px]">
            Appearances
          </h3>
          <p className="mb-[14px] text-brand-50 text-[12px] font-normal leading-[18px]">
            Most recent tournament title with no of appearances,{" "}
            <b className="font-semibold cursor-pointer">VIEW ALL</b>
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
