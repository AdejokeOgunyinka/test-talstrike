import { useSession } from "next-auth/react";
import NextImage from "next/image";
import { useRouter } from "next/router";

// import { useTypedSelector } from "@/hooks/hooks";
import {
  useGetAchievements,
  useGetAppearances,
  useGetMyProfile,
} from "@/api/profile";
import { useFollowUser } from "@/api/players";
import { useQueryClient } from "@tanstack/react-query";
import notify from "@/libs/toast";
import { BeatLoader } from "react-spinners";

const AboutMe = () => {
  const { data: session } = useSession();
  // const trainingCourses = [
  //   "Daily fitness",
  //   "Webinar",
  //   "How to score hat tricks",
  // ];
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

  return (
    <div className="mt-[28px]">
      <div className="w-full bg-brand-500 rounded-[12px] px-[50px] py-[37px]">
        <div className="flex w-full justify-between items-center mb-[31px]">
          <h2 className="text-brand-2000 font-medium text-[18px]">
            Personal Details
          </h2>
          {!userProfile?.is_following && (
            <button
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
              className="bg-brand-600  w-[142px] h-[41px] rounded-[19px] font-semibold text-[12px] leading-[18px] text-brand-500"
            >
              {isFollowingPlayer ? (
                <BeatLoader
                  color={"orange"}
                  size={10}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                `Follow ${userProfile?.user?.firstname}`
              )}
            </button>
          )}
        </div>
        <h3 className="text-brand-2250 font-semibold text-[24px] leading-[36px]">
          {userProfile?.user.firstname} {userProfile?.user.lastname}
        </h3>
        <h3 className="text-brand-2000 font-semibold text-[16px] leading-[24px]">
          {userProfile?.position?.join("")}
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
              ? userProfile?.career_goals?.join(", ")
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
            {userProfile?.interests?.length === 0 ||
            userProfile?.interests === null ? (
              <p className="text-brand-50 text-[12px] font-normal leading-[18px]">
                No likes added yet...
              </p>
            ) : (
              userProfile?.interests?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="px-[11px] py-[10px] bg-brand-2300 text-[12px] rounded-[4px] text-brand-600 border-[1.2px] border-solid border-brand-2350 flex justify-center items-center"
                >
                  #{item}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[19px] font-semibold text-[18px] leading-[183.5%]">
            Social profiles
          </h3>
          <div className="flex gap-x-[12px]">
            {!userProfile?.socials?.facebook &&
              !userProfile?.socials?.twitter &&
              !userProfile?.socials?.instagram &&
              !userProfile?.socials?.linkedin && (
                <p className="text-brand-50 text-[12px] font-normal leading-[18px]">
                  No socials added yet...
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
            {achievements?.pages?.flat(1)?.length === 0 ? (
              <p>No achievement yet..</p>
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
            {/* {appearances?.results?.length > 5 && (
              <b className="font-semibold cursor-pointer">VIEW ALL</b>
            )} */}
          </p>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[19px] font-semibold text-[18px] leading-[183.5%]">
            Teams Played With
          </h3>
          <div className="flex gap-x-[12px] w-full flex-wrap">
            {userProfile?.teams?.length === 0 || userProfile?.teams === null ? (
              <p className="text-brand-50 text-[12px] font-normal leading-[18px]">
                No team yet..
              </p>
            ) : (
              userProfile?.teams?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="px-[11px] py-[10px] bg-brand-2300 text-[12px] rounded-[4px] text-brand-600 border-[1.2px] border-solid border-brand-2350 flex justify-center items-center"
                >
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mt-[30px]">
          <h3 className="text-brand-600 mb-[19px] font-semibold text-[18px] leading-[183.5%]">
            Special Abilities
          </h3>
          <div className="flex gap-x-[12px]">
            {userProfile?.abilities ? (
              userProfile?.abilities?.map((item: any, index: number) => (
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
            {userProfile?.skills ? (
              userProfile?.skills?.map((item: any, index: number) => (
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
          <div className="flex gap-x-[12px] gap-y-[12px] flex-wrap">
            {userProfile?.trainings ? (
              [...userProfile?.trainings]?.map((item, index) => (
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
