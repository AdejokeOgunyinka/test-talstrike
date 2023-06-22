/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { DashboardLayout } from "@/layout/Dashboard";
import { useDeleteAchievement, useGetAchievements } from "@/api/profile";
import { useSession } from "next-auth/react";
import { BeatLoader } from "react-spinners";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

import AchievementDummy from "@/assets/achievementDummyImg.svg";
import CreateAchievement from "@/components/AchievementModals/CreateAchievement";
import EditAchievement from "@/components/AchievementModals/EditAchievement";
import SkeletonLoader from "@/components/SkeletonLoader";
import { useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const USER_ID = session?.user?.id;

  const [openAddAchievementsModal, setOpenAddAchievementsModal] =
    useState(false);
  const [openEditAchievementModal, setOpenEditAchievementModal] =
    useState(false);

  const [chosenAchievementId, setChosenAchievementId] = useState("");

  const [page, setPage] = useState(1);
  const { data: achievements, isLoading: isLoadingAchievements } =
    useGetAchievements({
      token: TOKEN as string,
      userId: USER_ID as string,
      page: page,
    });

  const { mutate: deleteAchievement, isLoading: isDeletingAchievement } =
    useDeleteAchievement();
  const queryClient = useQueryClient();

  return (
    <DashboardLayout>
      <div className="w-full md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 py-[28px] px-[15px] lg:px-[31px]">
        <div className="flex items-center justify-between w-full">
          <h4 className="text-brand-1750 font-semibold text-[22px]">
            My Achievements and Trophies
          </h4>
          <button
            onClick={() =>
              setOpenAddAchievementsModal(!openAddAchievementsModal)
            }
            className="bg-brand-600  w-[214px] h-[41px] rounded-[19px] font-semibold text-[15px] leading-[18px] text-brand-500"
          >
            Add Achievement
          </button>
        </div>
        <div className="w-full flex flex-wrap mt-[33px] justify-center">
          <div className="flex flex-wrap gap-x-[31px] gap-y-[20px] justify-center lg:justify-normal">
            {isLoadingAchievements ? (
              <SkeletonLoader />
            ) : achievements?.results?.length === 0 ? (
              <p>No achievement yet..</p>
            ) : (
              achievements?.results?.map((achievement: any, index: number) => (
                <div
                  key={index}
                  className="w-[346px] relative h-[399px] border border-[#94AEC5] rounded-[4px] p-[24px]"
                >
                  <div className="relative">
                    <img
                      src={achievement?.image || AchievementDummy}
                      alt="achievement dummy"
                      className="w-full h-[145px] rounded-[4px] mb-[24px]"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="absolute -right-[8px] -top-[5px]">
                      <img
                        src={"/editAchievement.svg"}
                        alt="edit"
                        className="cursor-pointer"
                        onClick={() => {
                          setChosenAchievementId(achievement?.id);
                          setOpenEditAchievementModal(true);
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="text-brand-600 mb-[10px] font-semibold text-[16px]">
                    {achievement?.title}
                  </h3>
                  <p className="text-brand-600 mb-[10px] text-[12px]">
                    {achievement?.description}
                  </p>
                  <p className="text-brand-600 mb-[19px] text-[14px]">
                    Awarded: {achievement?.month}, {achievement?.year}
                  </p>
                  <div className="absolute left-0 bottom-0 w-full h-[41px]">
                    <button
                      onClick={() => {
                        setChosenAchievementId(achievement?.id);

                        deleteAchievement(
                          {
                            id: achievement?.id,
                            token: TOKEN as string,
                          },
                          {
                            onSuccess: () => {
                              queryClient.invalidateQueries([
                                "getAchievements",
                              ]);
                            },
                          }
                        );
                      }}
                      className="bg-brand-600 text-brand-500 h-full w-full"
                    >
                      {isDeletingAchievement &&
                      chosenAchievementId === achievement?.id ? (
                        <BeatLoader
                          color={"white"}
                          size={10}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {!isLoadingAchievements && achievements?.results?.length > 0 && (
          <div className="flex justify-between items-center w-full mt-[20px]">
            <div>
              {achievements?.current_page > 1 && (
                <ArrowLeftCircleIcon
                  color="#0074D9"
                  height="30px"
                  onClick={() => {
                    if (page === 1) {
                      setPage(1);
                    } else {
                      setPage(page - 1);
                    }
                  }}
                  className="cursor-pointer"
                />
              )}
            </div>
            <div className="flex gap-[20px] items-center">
              <div className="border border-brand-600 w-[55px] rounded-[5px] flex justify-end pr-[10px]">
                {page}
              </div>
              {achievements?.current_page < achievements?.total_pages && (
                <ArrowRightCircleIcon
                  color="#0074D9"
                  height="30px"
                  aria-disabled={achievements?.links?.next === null}
                  onClick={() => {
                    if (achievements?.links?.next === null) {
                      setPage(page);
                    } else setPage(page + 1);
                  }}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        )}
      </div>
      {openAddAchievementsModal && (
        <CreateAchievement onClose={() => setOpenAddAchievementsModal(false)} />
      )}
      {openEditAchievementModal && (
        <EditAchievement
          onClose={() => setOpenEditAchievementModal(false)}
          id={chosenAchievementId}
        />
      )}
    </DashboardLayout>
  );
};

export default Index;
