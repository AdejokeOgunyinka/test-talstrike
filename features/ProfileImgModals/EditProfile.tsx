/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import NextImage from "next/image";
import { useSession } from "next-auth/react";

import ModalContainer from "@/components/Modal";
import InputBox from "@/components/ProfileModals/InputBox";
import ProfileImg from "@/assets/profileIcon.svg";

const EditProfileAndExperience = ({ onClose }: { onClose: () => void }) => {
  const { data: session } = useSession();
  const [modal, setModal] = useState("");

  const editProfilePictureControl = [
    { name: "Edit", icon: "/editBlue.svg" },
    {
      name: "Change",
      icon: "/album.svg",
      onClick: () => setModal("change-profile"),
    },
    { name: "Delete", icon: "/deleteBlue.svg" },
  ];

  return (
    <ModalContainer>
      {modal === "initial-edit" && (
        <div className="w-[584px] h-[462px] bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
          <div className="flex border-b border-[#E3E2E2] w-full h-[61px] justify-between items-center pl-[30px]">
            <p className="text-[20px] text-brand-600 leading-[30px]">
              Edit Profile Picture
            </p>
            <NextImage
              src="/blueCloseIcon.svg"
              alt="close"
              width="60"
              height="61"
              className="cursor-pointer"
              onClick={() => setModal("")}
            />
          </div>
          <div className="w-full h-[calc(100%-61px)] pt-[18px] px-[21px]">
            <div className="w-full h-[282px] rounded-[8px]">
              <img
                src={(session?.user?.image as string) || ProfileImg}
                alt="profile"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="mt-[42px] flex justify-between items-center px-[56px]">
              {editProfilePictureControl?.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-[9px] cursor-pointer"
                  onClick={item?.onClick}
                >
                  <NextImage
                    src={item.icon}
                    alt="icon"
                    width="17"
                    height="17"
                  />
                  <p className="text-[18px] text-brand-600 leading-[27px] font-medium">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {modal === "change-profile" && (
        <div className="w-[584px] h-[505px] bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
          <div className="flex border-b border-[#E3E2E2] w-full h-[61px] justify-between items-center pl-[30px]">
            <p className="text-[20px] text-brand-600 leading-[30px]">
              Change Profile Picture
            </p>
            <NextImage
              src="/blueCloseIcon.svg"
              alt="close"
              width="60"
              height="61"
              className="cursor-pointer"
              onClick={() => setModal("initial-edit")}
            />
          </div>
          <div className="w-full h-[calc(100%-173px)] px-[20px]">
            <div className="w-full h-full rounded-[8px] flex items-center">
              <img
                src={(session?.user?.image as string) || ProfileImg}
                alt="profile"
                className="object-cover w-full h-[282px]"
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-[24px] w-full h-[93px] mb-[19px] border border-t border-b-transparent border-[#E3E2E2]">
            <button className="border border-[2px] font-medium w-[135px] h-[41px] rounded-[4px] border-brand-600 text-brand-600">
              {" "}
              Edit Image
            </button>
            <button className="w-[135px] h-[41px] font-medium rounded-[4px] bg-brand-600 text-brand-500">
              Upload
            </button>
          </div>
        </div>
      )}
      {modal === "" && (
        <div className="w-[429px] h-[239px] bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
          <div className="flex border-b border-[#E3E2E2] w-full h-[49px] justify-between items-center pl-[30px]">
            <p className="text-[20px] text-brand-600 leading-[30px]">
              Edit Profile
            </p>
            <NextImage
              src="/blueCloseIcon.svg"
              alt="close"
              width="60"
              height="49"
              className="cursor-pointer"
              onClick={onClose}
            />
          </div>
          <div className="flex gap-[18px] justify-center w-full h-[calc(100%-49px)] px-[30px] py-[27px]">
            <div className="relative w-[134px] h-full border-[3.82857px] border-brand-500 rounded-[9.6px] shadow shadow-[0px_0.812121px_4.87273px_0.812121px_rgba(0, 0, 0, 0.15)]">
              <img
                src={(session?.user?.image as string) || ProfileImg}
                alt="profile"
                className="object-cover w-full h-full"
              />
              <NextImage
                src="/editCircle.svg"
                alt="edit circle"
                width="36"
                height="36"
                className="absolute bottom-0 right-[9px] cursor-pointer"
                onClick={() => setModal("initial-edit")}
              />
            </div>
            <div className="w-[217px]">
              <InputBox
                id="years_of_experience"
                title="Years of Experience"
                onChange={() => console.log("")}
                placeholder="Enter years of experience"
              />
              <button className="w-full mt-[12px] h-[41px] text-brand-500 rounded-[4px] bg-brand-600">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContainer>
  );
};

export default EditProfileAndExperience;
