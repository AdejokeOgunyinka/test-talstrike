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
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import clsx from "clsx";

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
        "flex items-center transition mb-[17px] py-[12px] w-[156px]  duration-200",
        active
          ? "pl-[23px] bg-brand-light-blue-2 new-active-dashboard-menu"
          : "pl-[25px] hover:pl-[22px] hover:py-[12px] new-inactive-dashboard-menu border-r-transparent border-y-transparent"
      )}
    >
      <Image
        src={active ? ActiveIcons[title as string] : Icon}
        alt="dashboard icons"
        className="h-5 w-5"
      />
      <Text
        textDecoration={"none !important"}
        className={`font-normal ml-[11px] text-[18px] leading-[16px] text-brand-100`}
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
      color={active ? "dark-blue" : "light-blue"}
      display="flex"
      className={clsx(
        "flex flex-col justify-center items-center transition px-[14px] h-[100%]  duration-200 text-brand-100",
        active
          ? "border-3 border-b-brand-1750 border-x-transparent border-t-transparent"
          : "hover:border-3 hover:border-b-brand-1750 border-x-transparent border-t-transparent"
      )}
    >
      <Image
        src={active ? ActiveIcons[title as string] : Icon}
        alt="dashboard icons"
        width="34px"
        height="34.462px"
      />
    </Link>
  );
};

const isActivePath = (sidebarLink: string, currentPath: string): boolean => {
  return sidebarLink === currentPath;
};

export const DashboardSidebar = () => {
  const router = useRouter();

  return (
    <Box
      bg="bg-grey"
      className="absolute md:relative md:translate-x-0 transform -translate-x-full transition duration-200 ease-in-out flex-shrink-0 inset-y-0 left-0"
    >
      <div className="mt-[21px] mb-[21px] pl-[20px] pr-[20px]"></div>
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
            <AccordionButton
              px="25px"
              mb="17px"
              className={
                isActivePath("/players", router.pathname) ||
                isActivePath("/coaches", router.pathname) ||
                isActivePath("/trainers", router.pathname) ||
                isActivePath("/agents", router.pathname)
                  ? "new-active-dashboard-dropdown"
                  : "dashboard-dropdown"
              }
            >
              <Flex align="center">
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
                  fontSize="18px"
                  fontWeight="400"
                  style={{ color: "text-brand-100" }}
                  ml="8px"
                >
                  Athletes
                </Text>
                <AccordionIcon color={"black"} className={"mt-1"} />
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
          path="/messaging"
          active={isActivePath("/messaging", router.pathname)}
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

  const {
    isOpen: isOpenMoreDrawer,
    onOpen: onOpenMoreDrawer,
    onClose: onCloseMoreDrawer,
  } = useDisclosure();

  const {
    isOpen: isOpenAthleteDrawer,
    onClose: onCloseAthleteDrawer,
    onOpen: onOpenAthleteDrawer,
  } = useDisclosure();

  return (
    <nav className="px-[10px] w-full flex gap-x-[10px] h-full justify-center relative z-[9999]">
      <MobileSideBarLink
        path="/dashboard"
        active={show === false && isActivePath("/dashboard", router.pathname)}
        Icon={"/newsfeedInactive.svg"}
        title="Feed"
        onClick={() => setShow(false)}
      />

      <MobileSideBarLink
        path="/explore"
        active={show === false && isActivePath("/explore", router.pathname)}
        Icon={"/exploreInactiveIcon.svg"}
        title="Explore"
        onClick={() => setShow(false)}
      />

      <Flex
        className={clsx(
          "flex flex-col justify-center items-center transition px-[14px] h-[100%]  duration-200 text-brand-100 hover:border-3 hover:border-b-brand-1750 border-x-transparent border-t-transparent"
        )}
        onClick={
          isOpenAthleteDrawer ? onCloseAthleteDrawer : onOpenAthleteDrawer
        }
      >
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
          width="32px"
          height="34.462px"
        />
      </Flex>

      <Drawer
        placement="bottom"
        isOpen={isOpenAthleteDrawer}
        onClose={onCloseAthleteDrawer}
      >
        <DrawerOverlay />
        <DrawerContent
          borderTopLeftRadius="16px"
          borderTopRightRadius="16px"
          pb="60px"
        >
          <Flex justify="center" w="full" pt="28px">
            <Image src="/menuDrawerIcon.svg" alt="menu icon" />
          </Flex>
          <Box pl="26px">
            <Text fontSize="20px" fontWeight="500" color="text" mb="28px">
              Athletes
            </Text>
            <Box ml="-26px !important">
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
            </Box>
          </Box>
        </DrawerContent>
      </Drawer>

      <MobileSideBarLink
        path="/messages"
        active={show === false && isActivePath("/messages", router.pathname)}
        Icon={"/messagesInactiveIcon.svg"}
        title="Messages"
        onClick={() => setShow(false)}
      />

      <Flex
        className={clsx(
          "flex flex-col justify-center items-center transition px-[14px] h-[100%]  duration-200 text-brand-100 hover:border-3 hover:border-b-brand-1750 border-x-transparent border-t-transparent"
        )}
        onClick={isOpenMoreDrawer ? onCloseMoreDrawer : onOpenMoreDrawer}
      >
        <Image
          src="/moreIcon.svg"
          alt="manage more"
          width="32px"
          height="34.462px"
        />
      </Flex>

      <Drawer
        placement="bottom"
        onClose={onCloseMoreDrawer}
        isOpen={isOpenMoreDrawer}
      >
        <DrawerOverlay />
        <DrawerContent
          pb="60px"
          borderTopLeftRadius="16px"
          borderTopRightRadius="16px"
        >
          <Flex justify="center" w="full" pt="28px">
            <Image src="/menuDrawerIcon.svg" alt="menu icon" />
          </Flex>
          <Box pl="28px">
            <Text fontSize="20px" fontWeight="500" color="text" mb="19px">
              More
            </Text>

            <Box ml="-28px !important">
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
            </Box>
          </Box>
        </DrawerContent>
      </Drawer>
    </nav>
  );
};
