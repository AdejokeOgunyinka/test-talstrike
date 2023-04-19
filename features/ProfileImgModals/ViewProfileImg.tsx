/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import ModalContainer from "@/components/Modal";
import ProfileImg from "@/assets/profileIcon.svg";

const ViewProfileImg = ({ onClose }: { onClose: () => void }) => {
  const { data: session } = useSession();
  return (
    <ModalContainer>
      <div className="w-[664px] h-[490px] bg-brand-500 border rounded-[8px]">
        <div className="flex w-full h-[54px] justify-between items-center pl-[30px]">
          <p className="text-[20px] text-brand-600 leading-[30px]">
            Profile Picture
          </p>
          <NextImage
            src="/blueCloseIcon.svg"
            alt="close"
            width="60"
            height="54"
            className="cursor-pointer"
            onClick={onClose}
          />
        </div>
        <img
          className="w-full h-[calc(100%-54px)] object-cover"
          src={(session?.user?.image as string) || ProfileImg}
          alt="profile"
        />
      </div>
    </ModalContainer>
  );
};

export default ViewProfileImg;
