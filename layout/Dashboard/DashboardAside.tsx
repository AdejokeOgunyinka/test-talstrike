import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NextImage from "next/image";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import SearchBar from "@/components/SearchBar";
import { useGetAllCoaches } from "@/api/coaches";
import { useGetMyFollowers } from "@/api/dashboard";

const DashboardAside = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const ID = session?.user?.id;

  const router = useRouter();

  const { data: Coaches } = useGetAllCoaches({ token: TOKEN as string });

  const { data: myFollowers, isLoading: isLoadingMyFollowers } =
    useGetMyFollowers({
      token: TOKEN as string,
      id: ID as string,
    });

  const handleClickUser = ({ id }: { id: string }) => {
    router.push(`/profile/${id}`);
  };

  return (
    <div className="bg-brand-500 scrollbar-hidden h-[100vh] hidden lg:inline h-[100%] lg:relative md:translate-x-0 transform translate-x-full transition duration-200 ease-in-out flex-shrink-0 inset-x-0">
      <div className="sticky z-[99] top-[70px] bg-brand-500">
        <div className="h-[40px] mb-[13px]">
          <SearchBar placeholder="Search for players" />
        </div>
        <h4 className="text-brand-90 text-[11px] lg:text-[14px] 2xl:text-[16px] leading-[16px] font-semibold mb-[12px]">
          Coaches near me
        </h4>
        <div className="flex gap-x-[14px]">
          {Coaches?.results?.length === 0 || !Coaches ? (
            <p className="text-[13px]">No coach at the moment...</p>
          ) : (
            Coaches?.results?.slice(0, 4)?.map((coach: any, index: number) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleClickUser({ id: coach?.user?.id })}
              >
                <div className="flex justify-center items-center rounded-[50%] w-[40px] h-[40px] border-[1px] border-brand-400 overflow-hidden">
                  <NextImage
                    src={coach?.user?.image}
                    alt="coach"
                    width="40"
                    height="40"
                  />
                </div>
                <p className="text-[9px] mt-[4px] lg:text-[11px] 2xl:text-[13px] leading-[14px] font-medium">
                  {coach?.user?.firstname} {coach?.user?.lastname}
                </p>
              </div>
            ))
          )}
        </div>
        <div className="mt-[24px] mb-[12px] flex justify-between items-center">
          <h4 className="text-brand-90 text-[11px] lg:text-[14px] 2xl:text-[16px] leading-[16px] font-semibold">
            My Squad
          </h4>
          <h3 className="text-brand-50 text-[20px] font-semibold leading-[30px]">
            ...
          </h3>
        </div>
      </div>
      <div className="flex bg-brand-500 flex-col gap-y-[14px] overflow-y-scroll h-[100%] pt-[70px] pb-[230px]">
        {isLoadingMyFollowers ? (
          <SkeletonTheme
            baseColor="rgba(0, 116, 217, 0.18)"
            highlightColor="#fff"
          >
            <section>
              <Skeleton height={530} width="100%" />
            </section>
          </SkeletonTheme>
        ) : myFollowers?.results?.length === 0 || !myFollowers ? (
          <p className="text-[13px]">No one at the moment...</p>
        ) : (
          myFollowers?.results?.map((follower: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center cursor-pointer"
              onClick={() => handleClickUser({ id: follower?.users?.id })}
            >
              <div className="flex gap-[20px] items-center">
                <NextImage
                  src={follower?.users?.image}
                  alt="player"
                  width="40"
                  height="40"
                />
                <p className="text-brand-50 text-[11px] lg:text-[14px] 2xl:text-[15px] leading-[16px] font-semibold">
                  {follower?.users?.firstname} {follower?.users?.lastname}
                </p>
              </div>
              {/* <div>
              {player.lastSeen === 'active' ? (
                <div className="w-[8px] h-[8px] rounded-[50%] bg-brand-1100"></div>
              ) : (
                <p className="font-medium text-brand-1050 text-[10px]">{player.lastSeen}</p>
              )}
            </div> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardAside;
