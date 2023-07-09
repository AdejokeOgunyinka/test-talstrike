/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { useSession } from "next-auth/react";

import ModalContainer from "./Modal";
import DirectIcon from "@/assets/chatbox2.svg";
import InstagramIcon from "@/assets/Instagram.svg";
import TwitterIcon from "@/assets/Twitter.svg";
import FacebookIcon from "@/assets/Facebook2.svg";
import TiktokIcon from "@/assets/TikTok.svg";
import LinkedinIcon from "@/assets/LinkedIn2.svg";
import WhatsappIcon from "@/assets/WhatsApp.svg";
import { useGetMyFollowers } from "@/api/dashboard";
import { handleOnError } from "@/libs/utils";

const ShareModal = ({ onClose, post }: { onClose: () => void; post: any }) => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const ID = session?.user?.id;

  const socialShare = [
    { icon: DirectIcon, name: "Direct", href: "/messaging" },
    { icon: InstagramIcon, name: "Instagram", href: "" },
    {
      icon: TwitterIcon,
      name: "Twitter",
      href: "https://twitter.com/intent/tweet?text=",
    },
    {
      icon: FacebookIcon,
      name: "Facebook",
      href: "https://www.facebook.com/sharer/sharer.php",
    },
    { icon: TiktokIcon, name: "TikTok", href: "" },
    { icon: LinkedinIcon, name: "Linkedin", href: "" },
    {
      icon: WhatsappIcon,
      name: "Whatsapp",
      href: "https://api.whatsapp.com/send?phone=${''}&text=",
    },
  ];

  const url = `${process.env.NEXTAUTH_URL}`;

  const handleClick = (link: any) => {
    const text = post?.body || post?.question_text;

    window.open(
      `${link.href}${
        link.name === "Facebook"
          ? `?quote=${text}&u=${url}`
          : `${text} \n${url}`
      }`
    );
  };

  const { data: myFollowers } = useGetMyFollowers({
    token: TOKEN as string,
    id: ID as string,
  });
  return (
    <ModalContainer>
      <div className="bg-brand-500 w-[95%] md:w-[545px] h-[332px] rounded-[4px]">
        <div className="h-[64px] w-full border border-brand-2800 border-t-transparent border-x-transparent flex justify-between items-center">
          <h3 className="text-brand-600 ml-[28px] text-[20px] leading-[30px] font-medium">
            Share post
          </h3>
          <NextImage
            src={"/closeIcon.svg"}
            className="cursor-pointer"
            onClick={onClose}
            alt="close"
            width="66"
            height="61"
          />
        </div>

        <div className="flex overflow-x-scroll justify-center gap-x-[15px] p-[29px] border border-brand-2800 border-t-transparent border-x-transparent">
          {socialShare?.map((social, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center cursor-pointer"
              onClick={() => handleClick(social)}
            >
              <div className="w-[52px] h-[52px] shadow-[0px_0px_8px_0px_#0000001F] flex justify-center items-center rounded-[50%]">
                <NextImage src={social?.icon} alt="social" />
              </div>
              <p className="mt-[8px] text-[12px]">{social?.name}</p>
            </div>
          ))}
        </div>

        <div className="flex  items-center py-[24px] px-[29px] gap-x-[16px]">
          {myFollowers?.results?.map((follower: any, index: number) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <img
                src={follower?.users?.image}
                alt="player"
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
                onError={handleOnError}
              />
              <p className="text-[10px] leading-[110%]">
                {follower?.users?.firstname}
              </p>
              <p className="text-[10px] leading-[110%]">
                {follower?.users?.lastname}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ModalContainer>
  );
};

export default ShareModal;
