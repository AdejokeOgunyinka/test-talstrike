/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "moment";

import SearchBar from "@/components/SearchBar";
import { useGetAllCoaches } from "@/api/coaches";
import { useGetMyFollowers } from "@/api/dashboard";
import { handleOnError } from "@/libs/utils";
import LoadingMyFriends from "@/components/LoadingStates/loadingMyFriends";

const DashboardAside = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const ID = session?.user?.id;

  const router = useRouter();

  const { data: Coaches, isLoading: isLoadingCoaches } = useGetAllCoaches({
    token: TOKEN as string,
  });

  const { data: myFollowers, isLoading: isLoadingMyFollowers } =
    useGetMyFollowers({
      token: TOKEN as string,
      id: ID as string,
    });

  const handleClickUser = ({ id }: { id: string }) => {
    router.push(`/profile/${id}`);
  };

  return (
    <div className="scrollbar-hidden h-[100vh] 2xl:h-[calc(85vh-60px)] hidden lg:inline 2xl:block lg:relative md:translate-x-0 transform translate-x-full transition duration-200 ease-in-out flex-shrink-0 inset-x-0">
      <div className="sticky z-[99] bg-brand-500">
        <div className="h-[40px] mb-[26px] mt-[81px]">
          <SearchBar
            placeholder="Search for players"
            hasRoundedCorners
            bgColor="#F6F6F6"
          />
        </div>
        <div className="flex justify-between items-center mb-[12px]">
          <h4 className="text-[11px] lg:text-[18px] leading-[116%] font-semibold">
            Coaches near me
          </h4>
          <a
            href="/coaches"
            className="text-[#93A3B1] flex gap-x-[1px] text-[15px] font-normal cursor-pointer"
          >
            <p>View All</p>
            <img src="/arrow-forward.svg" alt="forward arrow" />
          </a>
        </div>

        <div className="flex gap-x-[14px]">
          {isLoadingCoaches ? (
            <div className="flex justify-between gap-x-[5px]">
              {Array(4)
                ?.fill("")
                ?.map((_, index) => (
                  <SkeletonTheme
                    key={index}
                    baseColor="#D7DEE1"
                    highlightColor="#fff"
                  >
                    <Skeleton
                      height={55}
                      width={55}
                      style={{ borderRadius: "100%" }}
                    />
                  </SkeletonTheme>
                ))}
            </div>
          ) : Coaches?.pages?.flat(1)?.length === 0 || !Coaches ? (
            <p className="text-[13px]">No coach at the moment...</p>
          ) : (
            Coaches?.pages
              ?.flat(1)
              ?.slice(0, 4)
              ?.map((coach: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleClickUser({ id: coach?.user?.id })}
                >
                  <div className="flex justify-center items-center rounded-[50%] w-[40px] h-[40px] border-[1.092px] border-brand-500 overflow-hidden">
                    <img
                      src={coach?.user?.image || "/user_placeholder.svg"}
                      alt="coach"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                      onError={handleOnError}
                    />
                  </div>
                  <p className="text-[9px] text-[#293137] lg:text-[14px] leading-[14px] font-medium">
                    {coach?.user?.firstname}
                  </p>
                </div>
              ))
          )}
        </div>
        <div className="mt-[27px] mb-[12px] flex justify-between items-center">
          <h4 className="text-[11px] lg:text-[18px] leading-[116%] font-semibold">
            Friends
          </h4>
          <a
            href="/players"
            className="text-[#93A3B1] flex gap-x-[5px] text-[15px] leading-[16px] font-normal cursor-pointer"
          >
            <p>View All</p>
            <img src="/arrow-forward.svg" alt="forward arrow" />
          </a>
        </div>
      </div>
      <div className="flex bg-brand-500 flex-col gap-y-[14px] overflow-y-scroll h-[100%] pb-[230px]">
        {isLoadingMyFollowers ? (
          <LoadingMyFriends repeatLoader={5} />
        ) : myFollowers?.results?.length === 0 || !myFollowers ? (
          <p className="text-[13px]">No one at the moment...</p>
        ) : (
          myFollowers?.results?.map((follower: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center cursor-pointer"
              onClick={() => handleClickUser({ id: follower?.users?.id })}
            >
              <div className="flex gap-[14px] items-center">
                <img
                  src={follower?.users?.image || "/user_placeholder.svg"}
                  alt="player"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  onError={handleOnError}
                />
                <p className="text-[#293137] text-[11px] lg:text-[16px] leading-[16px]">
                  {follower?.users?.firstname} {follower?.users?.lastname}
                </p>
              </div>
              <div>
                {follower?.users?.last_login === "online" ? (
                  <div className="w-[8px] h-[8px] rounded-[50%] bg-brand-1100"></div>
                ) : (
                  <p className="font-medium text-brand-1050 text-[10px]">
                    {follower.users?.last_login !== null
                      ? moment(follower.users?.last_login).fromNow()
                      : ""}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardAside;
