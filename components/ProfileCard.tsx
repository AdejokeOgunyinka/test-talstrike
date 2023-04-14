import NextImage from "next/image";
import { useSession } from "next-auth/react";
import BeatLoader from "react-spinners/BeatLoader";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { UserCircleIcon } from "@heroicons/react/24/outline";

import Star from "@/assets/star2.svg";
import Map from "@/assets/map.svg";
import { useFollowUser } from "@/api/players";
import notify from "@/libs/toast";

type IProfileCardProps = {
  id: string;
  img: any;
  skillsArray: string[];
  name: string;
  position?: string;
  isPlayer: boolean;
  rating: string;
  location: string;
  experience: string;
  appearances: string;
  friend: boolean;
};

const ProfileCard = ({
  id,
  img,
  skillsArray,
  name,
  position,
  isPlayer,
  rating,
  location,
  experience,
  appearances,
  friend,
}: IProfileCardProps) => {
  const queryClient = useQueryClient();

  let ratingColorArray: Record<string, string> = {
    1: "bg-[#DD1111]",
    2: "bg-[#DD1111]",
    3: "bg-[#FF8F69]",
    4: "bg-[#00CDA6]",
  };

  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const { mutate: followUser, isLoading: isFollowingPlayer } = useFollowUser();

  const router = useRouter();

  return (
    <div className="w-[100%] md:basis-[33%] md:w-[250px] h-[250px] bg-brand-1400 rounded-[12px] shadow shadow-[0px_5px_14px_rgba(0, 0, 0, 0.09)] p-[18px]">
      <div className="flex gap-x-[18px]">
        <div className="flex flex-col items-center">
          <div
            onClick={() => router.push(`/profile/${id}`)}
            className="border border-[5px] border-brand-500 cursor-pointer flex justify-center items-center rounded-[50%] w-[61px] h-[61px] shadow shadow-[0px_4px_10px_4px_rgba(0, 0, 0, 0.07)]"
          >
            {img ? (
              <NextImage src={img} alt="profile image" width="61" height="61" />
            ) : (
              <UserCircleIcon className="h-[80px] w-[65px] text-gray-500 cursor-pointer" />
            )}
          </div>

          <div
            className={`${
              ratingColorArray[rating[0]]
            } rounded-[19px] mt-[11px] h-[20px] w-[46px] flex justify-center items-center`}
          >
            <NextImage src={Star} width="12" height="12" alt="star" />
            <p className="text-brand-500 text-[11px] font-semibold pl-[3px]">
              {rating}
            </p>
          </div>
        </div>
        <div className="mt-[11px]">
          <h4
            className="font-semibold text-brand-50 text-[11px] leading-[16px] cursor-pointer"
            onClick={() => router.push(`/profile/${id}`)}
          >
            {name}
          </h4>
          {isPlayer && (
            <h4 className="mt-[2px] font-medium text-[10px] text-['rgba(122, 120, 120, 0.46)']">
              {position}
            </h4>
          )}
          <div className="mt-[16px] flex">
            <NextImage src={Map} width="12" height="12" alt="map" />
            <p className="ml-[6px] text-[10px] text-brand-200 font-semibold leading-[15px]">
              {location}
            </p>
          </div>
          <p className="mt-[12px] font-medium text-[10px] text-['rgba(122, 120, 120, 0.46)'] leading-[15px]">
            {experience} year(s) experience
          </p>
          <p className="mt-[1px] font-medium text-[10px] text-['rgba(122, 120, 120, 0.46)'] leading-[15px]">
            {appearances} game appearance(s)
          </p>
        </div>
      </div>
      <div className="mt-[16px] flex gap-x-[6px]">
        {skillsArray?.slice(2)?.map((skill, index) => (
          <div
            key={index}
            className="flex justify-center items-center text-brand-50 text-[10px] leading-[15px] bg-brand-300 rounded-[19px]"
          >
            {skill}
          </div>
        ))}
        {skillsArray?.length > 2 && (
          <p className="text-brand-200 text-[10px] leading-[15px]">
            {skillsArray?.length - 2}
          </p>
        )}
      </div>
      {friend ? (
        <button className="w-full h-[32px] mt-[24px] border border-brand-90 bg-brand-500 rounded-[7px]">
          Message
        </button>
      ) : (
        <div className="w-full mt-[22px] flex gap-x-[5px]">
          <button className="w-[50%] bg-brand-500 border border-brand-300 h-[32px] rounded-[7px]">
            Ignore
          </button>
          <button
            onClick={() => {
              followUser(
                { token: TOKEN as string, userId: id },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries(["getAllPlayers"]);
                    queryClient.invalidateQueries(["getAllCoaches"]);
                    queryClient.invalidateQueries(["getAllTrainers"]);
                    queryClient.invalidateQueries(["getAllAgents"]);
                    notify({
                      type: "success",
                      text: `You are now following ${name}`,
                    });
                  },
                }
              );
            }}
            className="w-[50%] rounded-[7px] bg-brand-600 text-brand-500 h-[32px]"
          >
            {id && isFollowingPlayer ? (
              <BeatLoader
                color={"orange"}
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "Follow"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
