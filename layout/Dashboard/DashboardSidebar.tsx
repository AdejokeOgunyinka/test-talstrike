/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable no-unused-vars */
import { Fragment, useState } from "react";
import NextImage from "next/image";
import {
  Link,
  Accordion,
  AccordionItem,
  AccordionPanel,
  Flex,
  Image,
  AccordionButton,
  AccordionIcon,
  Text,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import clsx from "clsx";

import DashboardLogo from "@/assets/TalstrikeLogo.svg";

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
  Awards: "/trophyActive.svg",
};

const SideBarLink = ({ path, active, Icon, title }: SideBarLinkProps) => {
  return (
    <Link
      textDecoration="none !important"
      textDecorationLine={"none"}
      href={path}
      color={active ? "dark-blue" : "light-blue"}
      className={clsx(
        "flex items-center transition mb-[17px] py-[9px] w-[133px]  duration-200",
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
      <Text
        textDecoration={"none !important"}
        className={`font-medium ml-[11px] text-[13px] lg:text-[14px] 2xl:text-[16px] leading-[16px] ${
          active ? "text-brand-1750" : "text-brand-2150"
        }`}
      >
        {title}
      </Text>
    </Link>
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
    <Link
      href={path}
      textDecoration="none !important"
      textDecorationLine={"none"}
      onClick={onClick}
      display="flex"
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
      <Text
        textDecoration={"none !important"}
        className={`font-normal text-[10px] mt-[7px] lg:text-[14px] 2xl:text-[16px] leading-[16px]  ${
          active ? "text-brand-1750" : "text-brand-2150"
        }`}
      >
        {title}
      </Text>
    </Link>
  );
};

const isActivePath = (sidebarLink: string, currentPath: string): boolean => {
  return sidebarLink === currentPath;
};

export const DashboardSidebar = () => {
  const router = useRouter();

  return (
    <Fragment>
      <Box
        bg="bg-grey"
        className="absolute md:relative md:translate-x-0 transform -translate-x-full transition duration-200 ease-in-out flex-shrink-0 inset-y-0 left-0"
      >
        <div className="mt-[21px] mb-[37px] pl-[20px] pr-[20px]">
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
            path="/explore"
            active={isActivePath("/explore", router.pathname)}
            Icon={"/exploreInactiveIcon.svg"}
            title="Explore"
          />

          <Accordion allowToggle border="none" borderColor="transparent">
            <AccordionItem>
              <AccordionButton px="25px" mb="17px">
                <Flex>
                  <Image
                    alt="initial athlete"
                    src={
                      isActivePath("/players", router.pathname) ||
                      isActivePath("/coaches", router.pathname) ||
                      isActivePath("/trainers", router.pathname) ||
                      isActivePath("/agents", router.pathname)
                        ? "/athletesActiveIcon.svg"
                        : "/athletesInactiveIcon.svg"
                    }
                  />
                  <Text
                    fontSize="13px"
                    fontWeight="500"
                    color={
                      isActivePath("/players", router.pathname) ||
                      isActivePath("/coaches", router.pathname) ||
                      isActivePath("/trainers", router.pathname) ||
                      isActivePath("/agents", router.pathname)
                        ? "dark-blue"
                        : "light-blue"
                    }
                    ml="8px"
                  >
                    Athletes
                  </Text>
                  <AccordionIcon
                    color={
                      isActivePath("/players", router.pathname) ||
                      isActivePath("/coaches", router.pathname) ||
                      isActivePath("/trainers", router.pathname) ||
                      isActivePath("/agents", router.pathname)
                        ? "dark-blue"
                        : "light-blue"
                    }
                  />
                </Flex>
              </AccordionButton>

              <AccordionPanel px="-10px" paddingBottom="0px">
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
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

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
            path="/achievements"
            active={isActivePath("/achievements", router.pathname)}
            Icon="/trophyInactive.svg"
            title="Awards"
          />
        </nav>
      </Box>
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
