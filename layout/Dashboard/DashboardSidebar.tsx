/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable no-unused-vars */
import { Fragment, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import styled from "styled-components";

import DashboardLogo from "@/assets/TalstrikeLogo.svg";

const Image = styled.img``;

type SideBarLinkProps = {
  path: string;
  active: boolean;
  Icon: string;
  title?: string;
  onClick?: () => void;
};

const ActiveIcons: Record<string, string> = {
  Feed: "/newsFeedActive.svg",
  Players: "/playersActiveIcon.svg",
  Coaches: "/coachesActiveIcon.svg",
  Trainers: "/trainersActiveIcon.svg",
  Profile: "/profileActiveIcon.svg",
  Messages: "/messagesActiveIcon.svg",
  Explore: "/exploreActiveIcon.svg",
  Agents: "/agentsActiveIcon.svg",
};

const SideBarLink = ({ path, active, Icon, title }: SideBarLinkProps) => {
  return (
    // <Link href={path}>
    <a
      href={path}
      className={clsx(
        "flex items-center transition mb-[17px] py-[9px] w-[133px]  duration-200 text-brand-100",
        active
          ? "pl-[23px] border-3 border-l-brand-1750 border-r-transparent border-y-transparent"
          : "pl-[25px] hover:pl-[22px] hover:py-[6px] hover:border-3 hover:border-l-brand-1750 border-r-transparent border-y-transparent"
      )}
    >
      <Image
        src={active ? ActiveIcons[title as string] : Icon}
        alt="dashboard icons"
        className="h-5 w-5"
      />
      <span
        className={`font-normal ml-[19px] text-[13px] lg:text-[14px] 2xl:text-[16px] leading-[16px] ${
          active ? "text-brand-1750" : "text-brand-2150"
        }`}
      >
        {title}
      </span>
    </a>
    // </Link>
  );
};

const NewSideBarLink = ({ active, Icon, title, onClick }: SideBarLinkProps) => {
  return (
    <p onClick={onClick} className="cursor-pointer">
      <p
        className={clsx(
          "flex items-center transition mb-[17px] py-[9px] w-[133px]  duration-200 text-brand-100",
          active
            ? "pl-[23px] border-3 border-l-brand-1750 border-r-transparent border-y-transparent"
            : "pl-[25px] hover:border-3 hover:border-l-brand-1750 border-r-transparent border-y-transparent"
        )}
      >
        <Image
          src={active ? ActiveIcons[title as string] : Icon}
          alt="dashboard icons"
          className="h-5 w-5"
        />
        <span
          className={`font-normal ml-[19px] text-[13px] lg:text-[14px] 2xl:text-[16px] leading-[16px] ${
            active ? "text-brand-1750" : "text-brand-2150"
          }`}
        >
          {title}
        </span>
      </p>
    </p>
  );
};

export const MobileSideBarLink = ({
  path,
  active,
  Icon,
  title,
  onClick,
}: SideBarLinkProps) => {
  return (
    // <Link >
    <a
      href={path}
      onClick={onClick}
      className={clsx(
        "flex flex-col justify-center items-center transition px-[14px] w-[100px] h-[100%]  duration-200 text-brand-100",
        active
          ? "border-3 border-b-brand-1750 border-x-transparent border-t-transparent"
          : "hover:border-3 hover:border-b-brand-1750 border-x-transparent border-t-transparent"
      )}
    >
      <Image
        src={active ? ActiveIcons[title as string] : Icon}
        alt="dashboard icons"
        className="h-5 w-5"
      />
      <span
        className={`font-normal text-[10px] mt-[7px] lg:text-[14px] 2xl:text-[16px] leading-[16px]  ${
          active ? "text-brand-1750" : "text-brand-2150"
        }`}
      >
        {title}
      </span>
    </a>
    // </Link>
  );
};

const isActivePath = (sidebarLink: string, currentPath: string): boolean => {
  return sidebarLink === currentPath;
};

export const DashboardSidebar = () => {
  const router = useRouter();

  return (
    <Fragment>
      <div className="bg-brand-500  absolute md:relative md:translate-x-0 transform -translate-x-full transition duration-200 ease-in-out flex-shrink-0 inset-y-0 left-0">
        <div className="mt-[37px] mb-[28px] pl-[20px] pr-[20px]">
          <a href="/dashboard">
            <NextImage src={DashboardLogo} alt="logo" />
          </a>
        </div>
        <nav>
          <SideBarLink
            path="/dashboard"
            active={isActivePath("/dashboard", router.pathname)}
            Icon={"/newsFeedInactive.svg"}
            title="Feed"
          />
          <SideBarLink
            path="/players"
            active={isActivePath("/players", router.pathname)}
            Icon={"/playersInactiveIcon.svg"}
            title="Players"
          />

          <SideBarLink
            path="/coaches"
            active={router.asPath.includes("/coaches")}
            Icon={"/coachesInactiveIcon.svg"}
            title="Coaches"
          />
          <SideBarLink
            path="/trainers"
            active={isActivePath("/trainers", router.pathname)}
            Icon={"/trainersInactiveIcon.svg"}
            title="Trainers"
          />

          <SideBarLink
            path="/agents"
            active={isActivePath("/agents", router.pathname)}
            Icon={"/agentsInactiveIcon.svg"}
            title="Agents"
          />
          <SideBarLink
            path="/messages"
            active={isActivePath("/messages", router.pathname)}
            Icon={"/messagesInactiveIcon.svg"}
            title="Messages"
          />
          <SideBarLink
            path="/profile"
            active={isActivePath("/profile", router.pathname)}
            Icon={"/profileInactiveIcon.svg"}
            title="Profile"
          />
          <SideBarLink
            path="/explore"
            active={isActivePath("/explore", router.pathname)}
            Icon={"/exploreInactiveIcon.svg"}
            title="Explore"
          />
          {/* <NewSideBarLink
            path="/players"
            active={isActivePath('/players', router.pathname)}
            Icon={'/playersInactiveIcon.svg'}
            title="Players"
            onClick={() => router.push('/players')}
          /> */}
        </nav>
      </div>
    </Fragment>
  );
};

export const MobileMenu = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (val: boolean) => void;
}) => {
  const router = useRouter();

  return (
    <nav className="px-[10px] w-full flex gap-x-[10px] h-full justify-center relative">
      <MobileSideBarLink
        path="/dashboard"
        active={show === false && isActivePath("/dashboard", router.pathname)}
        Icon={"/newsfeedInactive.svg"}
        title="Feed"
        onClick={() => setShow(false)}
      />
      <MobileSideBarLink
        path="/players"
        active={show === false && isActivePath("/players", router.pathname)}
        Icon={"/playersInactiveIcon.svg"}
        title="Players"
        onClick={() => setShow(false)}
      />
      {/* <MobileSideBarLink
        path={router.pathname}
        active={showMore && isActivePath(router.pathname, router.pathname)}
        Icon={'/middleMobileMenuInactive.png'}
        title="More"
        more
      /> */}

      {/* $
      {showMore
        ? 'border-3 border-b-brand-1750 border-x-transparent border-t-transparent'
        : 'hover:border-3 hover:border-b-brand-1750 border-x-transparent border-t-transparent'} */}
      <div
        className={`w-[63px] h-[100%] flex items-center justify-center`}
        onClick={() => setShow(!show)}
      >
        <Image
          src={
            show
              ? "/middleMobileMenuActive.svg"
              : "/middleMobileMenuInactive.svg"
          }
          alt="middle"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <MobileSideBarLink
        path="/coaches"
        active={show === false && isActivePath("/coaches", router.pathname)}
        Icon={"/coachesInactiveIcon.svg"}
        title="Coaches"
        onClick={() => setShow(false)}
      />
      <MobileSideBarLink
        path="/messages"
        active={show === false && isActivePath("/messages", router.pathname)}
        Icon={"/messagesInactiveIcon.svg"}
        title="Messages"
        onClick={() => setShow(false)}
      />
    </nav>
  );
};
