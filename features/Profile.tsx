/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";

import { DashboardLayout } from "@/layout/Dashboard";
import Star from "@/assets/star.svg";
import profilePhotos1 from "@/assets/profilePhotos1.png";
import { useTypedSelector } from "@/hooks/hooks";
import ProfileImg from "@/assets/profileIcon.svg";
import EditProfile from "@/components/ProfileModals/EditProfile";
import EditCareerProgress from "@/components/ProfileModals/EditCareerProgress";
import AboutMe from "./ProfileSections/AboutMe";
import ViewProfileImg from "./ProfileImgModals/ViewProfileImg";
import EditProfileAndExperience from "./ProfileImgModals/EditProfile";
import { useGetUserPhotos } from "@/api/profile";

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

  const { data: media } = useGetUserPhotos({
    token: TOKEN as string,
    userId: USERID as string,
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
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [openEditCareerProgressModal, setOpenEditCareerProgressModal] =
    useState(false);
  const [viewProfilePicture, setViewProfilePicture] = useState(false);
  const [viewEditProfilePicture, setViewEditProfilePicture] = useState(false);

  return (
    <DashboardLayout>
      {userInfo?.loading ? (
        <div className="w-full flex justify-center items-center md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 py-[28px] px-[15px] lg:px-[31px]">
          <PageLoader />
        </div>
      ) : (
        <div className="w-full md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 py-[28px] px-[15px] lg:px-[31px]">
          <div className="flex h-[100%] flex-col lg:flex-row ">
            <div className="lg:w-[274px] h-[100%] lg:sticky lg:top-[99px]">
              <div className="h-[515px] w-[100%] lg:w-[274px] bg-brand-500 rounded-[12px] shadow shadow-[0px_5px_14px_rgba(0, 0, 0, 0.09)] flex flex-col items-center pt-[22px] ">
                <div className="relative w-[161px] profile-pic h-[161px] mb-[28px] border-8 border-brand-500 shadow shadow-[0px_4px_10px_4px_rgba(0, 0, 0, 0.07)] rounded-[50%] overflow-hidden">
                  <NextImage
                    src={
                      session?.user?.image !== null
                        ? (session?.user?.image as string)
                        : ProfileImg
                    }
                    width="161"
                    height="161"
                    alt="profile"
                    className="profile-img"
                  />

                  <div
                    onClick={() => setViewProfilePicture(true)}
                    className="profile-pic__overlay bg-brand-100 opacity-20 absolute top-0 w-full h-full flex justify-center items-center"
                  >
                    <p className="text-[16px] font-medium text-brand-500">
                      View
                    </p>
                  </div>
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
                  {userInfo?.profile?.years_of_experience || 1} year(s)
                  Experience
                </p>
                <p className="text-brand-2400 mb-[29px] opacity-50 text-[11px] lg:text-[13px] font-semibold">
                  online
                </p>
                <div
                  onClick={() => setViewEditProfilePicture(true)}
                  className="cursor-pointer"
                >
                  <NextImage
                    src={"/editBtn.svg"}
                    alt="edit"
                    width="102"
                    height="38"
                  />
                </div>
              </div>
              <div className="h-[182px] mt-[24px] bg-brand-500 lg:w-[274px] rounded-[12px] shadow shadow-[0px_5px_14px_rgba(0, 0, 0, 0.09)] px-[18px] pt-[11px] pb-[18px]">
                <div className="flex justify-between mb-[6px]">
                  <p className="font-semibold text-[14px] leading-[21px] text-brand-50">
                    Photos
                  </p>
                  <p className="text-brand-300 text-[12px]">
                    {media?.count} pictures
                  </p>
                </div>
                <div className="w-full h-[26px]">
                  {media?.photos ? (
                    <div className="w-full h-full flex flex-wrap gap-[2px]">
                      {media?.photos?.map((photo: string, index: number) => (
                        <div key={index} className="basis-[33%] relative">
                          <img
                            src={photo}
                            alt="nail"
                            className="rounded-[4px]"
                          />
                          {index === media?.count - 1 && (
                            <div className="absolute top-0 bottom-0 w-full h-full flex justify-center items-center bg-[rgba(0, 0, 0, 0.5)]">
                              <p className="text-brand-500 text-[10px]">
                                View all
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <NextImage src={profilePhotos1} alt="profile photos 1" />
                  )}
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[calc(100%-274px)] pb-[100px]">
              <div className="flex z-[99] flex-wrap lg:flex-nowrap gap-y-[10px] w-full lg:w-[calc(100%-550px)] lg:-mt-[30px] backdrop-blur-[15px] pt-[29px] lg:fixed lg: top-[99px] gap-x-[20px] lg:gap-x-[54px] lg:ml-[26px] mr-[31px] bg-brand-profile-header border-t-0 border-[3px] border-x-0 lg:border-b-brand-300">
                {profileSections?.map((section, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentSection(index + 1)}
                    className={`border-t-0 border-[3px] border-x-0 z-[22] -mb-[3px] lg:-mb-[3px] ${
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
                  </div>
                ))}
              </div>
              <div className="lg:ml-[26px] pt-[28px]  lg:mt-[28px] xl:mt-0">
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
              </div>
            </div>
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
