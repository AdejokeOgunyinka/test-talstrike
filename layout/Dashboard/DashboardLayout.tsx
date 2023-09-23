/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Box, Image } from "@chakra-ui/react";

import { DashboardSidebar, MobileMenu } from "./DashboardSidebar";
import SearchBar from "@/components/SearchBar";
import DashboardAside from "./DashboardAside";
import DashboardTopBarModal from "./DashboardTopModal";
import { useTypedSelector } from "@/hooks/hooks";
import { handleOnError, isActivePath } from "@/libs/utils";
import { MobileSideBarLink } from "./DashboardSidebar";

type LayoutProps = {
  children?: React.ReactNode;
};

export const DashboardLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [showSignOutButton, setShowSignOutButton] = useState(false);

  const { data: session } = useSession();

  const { userInfo } = useTypedSelector((state) => state.profile);

  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowSignOutButton(false);
    });
  }, []);

  return (
    <div className="w-full min-h-screen lg:flex lg:justify-center">
      <div className="w-full 2xl:w-[70vw] 2xl:h-[85vh] h-[100%] relative flex 2xl: mx-auto 2xl: my-auto 2xl:rounded-[29px] 2xl:overflow-hidden bg-brand-500">
        <Box
          className="w-[178px] 2xl:rounded-tl-[29px] 2xl:rounded-bl-[29px] h-[100%] 2xl:h-[85vh] fixed hidden md:inline-block"
          borderRight="1px solid #93A3B1"
          bg="bg-grey"
        >
          <DashboardSidebar />
        </Box>
        <div className="ml-[unset] md:ml-[178px] w-[100%] md:w-[calc(100%-178px)] relative md:static scrollbar-hidden">
          <div className="bg-[#343D45] z-[10] h-[70px] w-[100%] flex justify-between py-[15px] pr-[10px] lg:pr-[23px] pl-[10px] sticky top-0 z-[999]">
            <div
              className={`w-[50%] lg:w-[350px] h-[100%] flex items-center ${
                router.pathname === "/dashboard" && "ml-[15px]"
              }`}
            >
              {router.pathname !== "/dashboard" && (
                <Image
                  width={{ base: "15px", md: "25px" }}
                  height={{ base: "15px", md: "25px" }}
                  src="/arrowBack.svg"
                  alt="back"
                  mr={{ base: "10px", md: "55px" }}
                  onClick={() => router.back()}
                  cursor="pointer"
                />
              )}
              <SearchBar
                placeholder="Search"
                isLight
                isLeftIcon
                hasRoundedCorners
              />
            </div>
            <div className="flex items-center justify-end h-[100%] w-[50%] md:w-[calc(100%-475px)]">
              <p
                onClick={() => setShowSignOutButton(!showSignOutButton)}
                className="mr-[9px] cursor-pointer font-normal text-[11px] text-brand-500 lg:text-[14px] 2xl:text-[16px] leading-[16px]"
              >
                {session?.user?.firstname} {session?.user?.lastname}
              </p>
              <div
                className="relative"
                onClick={(e) => {
                  e?.stopPropagation();
                  setShowSignOutButton(!showSignOutButton);
                }}
              >
                <div className="overflow-hidden flex justify-center items-center cursor-pointer">
                  <img
                    src={
                      userInfo?.profile?.user?.image !== null
                        ? userInfo?.profile?.user?.image
                        : "/profileIcon.svg"
                    }
                    alt="me"
                    className="object-cover w-[35px] h-[35px]"
                    style={{
                      borderRadius: "100%",
                      border: "1px solid #D7EAFB",
                    }}
                    onError={handleOnError}
                  />
                </div>
                {showSignOutButton && <DashboardTopBarModal />}
              </div>
            </div>
          </div>
          <div className="w-[100%] min-h-[calc(100vh-70px)] flex scrollbar-hidden">
            <div
              className={`w-[100%] ${
                router.pathname === "/profile" ||
                router.pathname === "/profile/[id]" ||
                router.pathname === "/profile/section/[section]"
                  ? "md:w-[calc(100%-23px)]"
                  : "lg:w-[calc(100%-267px)]"
              } h-[100%] scrollbar-hidden`}
            >
              {children}
            </div>
            {router.pathname !== "/profile" &&
              router.pathname !== "/profile/[id]" &&
              router.pathname !== "/profile/section/[section]" && (
                <aside className="fixed 2xl:relative right-0 top-0 bottom-0 md:w-[267px] px-[20px] scrollbar-hidden hidden md:inline-block">
                  <DashboardAside />
                </aside>
              )}
          </div>
        </div>
        <Box
          borderTop="1px solid"
          borderColor="stroke"
          h="64px"
          w="full"
          bg="primary-white-3"
          className="inline-block md:hidden fixed bottom-0 left-0 right-0 w-full z-[9999] overflow-y-scroll"
        >
          <MobileMenu show={showMore} setShow={setShowMore} />
        </Box>

        {showMore && (
          <div className="w-full flex justify-center fixed bottom-0 left-0 right-0">
            <div className="absolute w-[327px] rounded-[15px] shadow shadow-[2px_19px_27px_-1px_rgba(0, 0, 0, 0.1)] h-[81px] items-center bg-brand-500 -top-[170px] flex">
              <MobileSideBarLink
                path="/trainers"
                active={isActivePath("/trainers", router.pathname)}
                Icon={"/trainersInactiveIcon.svg"}
                title="Trainers"
              />

              <MobileSideBarLink
                path="/agents"
                active={isActivePath("/agents", router.pathname)}
                Icon={"/agentsInactiveIcon.svg"}
                title="Agents"
              />
              <MobileSideBarLink
                path="/profile"
                active={isActivePath("/profile", router.pathname)}
                Icon={"/profileInactiveIcon.svg"}
                title="Profile"
              />
              <MobileSideBarLink
                path="/explore"
                active={isActivePath("/explore", router.pathname)}
                Icon={"/exploreInactiveIcon.svg"}
                title="Explore"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
