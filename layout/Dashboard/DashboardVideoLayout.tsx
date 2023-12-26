/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Flex, Image, Link } from "@chakra-ui/react";

import {
  DashboardSidebar,
  MobileMenu,
  MobileSideBarLink,
} from "./DashboardSidebar";
import SearchBar from "@/components/SearchBar";
import { useTypedDispatch, useTypedSelector } from "@/hooks/hooks";
import { handleOnError, isActivePath } from "@/libs/utils";
import { setSearchQuery } from "@/store/slices/dashboardSlice";
import DashboardAside from "./DashboardAside";
import DashboardTopBarModal from "./DashboardTopModal";

type LayoutProps = {
  children?: React.ReactNode;
};

export const DashboardVideoLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [showSignOutButton, setShowSignOutButton] = useState(false);

  const { userInfo } = useTypedSelector((state) => state.profile);

  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowSignOutButton(false);
    });
  }, []);

  const dispatch = useTypedDispatch();
  const { search_query } = useTypedSelector((state) => state.dashboard);
  const menuLinks = ["Pricing", "About", "Support", "Privacy policy"];

  return (
    <div className="w-full min-h-screen lg:flex lg:justify-center">
      <div className="w-full 2xl:w-[80vw] 2xl:h-[85vh] h-[100%] relative flex 2xl: mx-auto 2xl: my-auto 2xl:rounded-[29px] 2xl:overflow-hidden bg-brand-500">
        <div className="w-[100%] h-[100%]">
          <div className="bg-[#293137] h-[60px] w-[100%] 2xl:w-[80vw] flex justify-between py-[15px] pr-[10px] lg:pr-[23px] pl-[21px] fixed top-0 2xl:top-[5vh] z-[999]">
            <Flex display={{ base: "none", md: "inline-flex" }}>
              <Image
                src="/newTalstrikeLogoWhite.svg"
                mr="14px"
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer"
              />
              <Flex gap="26px">
                {menuLinks?.map((inner, index) => (
                  <Link
                    href="#"
                    key={index}
                    color="#fff"
                    fontSize="15px"
                    lineHeight="24px"
                    fontWeight="400"
                    textDecoration="none"
                    textDecorationLine="none"
                  >
                    {inner}
                  </Link>
                ))}
              </Flex>
            </Flex>
            <div className="flex items-center justify-end h-[100%]">
              <div
                className={`w-[50%] lg:w-[350px] h-[40px] flex items-center mr-[57px] ${
                  router.pathname === "/dashboard" && "ml-[15px]"
                }`}
              >
                <SearchBar
                  placeholder="Search"
                  isLight
                  isLeftIcon
                  hasRoundedCorners
                  differentOnChange={(e: any) => {
                    dispatch(setSearchQuery(e?.target?.value));
                    if (router.pathname !== "/dashboard") {
                      router.push("/dashboard");
                    }
                  }}
                  value={search_query}
                  hasClearBtn={search_query?.length > 0}
                  onClickClear={() => dispatch(setSearchQuery(""))}
                  bgColor="#15191D"
                />
              </div>
              {/* <p
                onClick={() => setShowSignOutButton(!showSignOutButton)}
                className="mr-[9px] cursor-pointer font-normal text-[11px] text-brand-500 lg:text-[14px] 2xl:text-[16px] leading-[16px]"
              >
                {session?.user?.firstname} {session?.user?.lastname}
              </p> */}
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
          <div className="w-[100%] 2xl:h-[calc(85vh-60px)] mt-[60px] 2xl:mt-[20px] flex relative md:static scrollbar-hidden">
            <div
              className={`ml-[unset] md:ml-[175px] min-h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] 2xl:min-h-[calc(85vh-60px)] 2xl:max-h-[calc(85vh-60px)] flex ${
                router.pathname?.startsWith("/profile")
                  ? "md:w-[calc(100%-175px)]"
                  : router.pathname?.startsWith("/messaging")
                  ? "w-[100%]"
                  : "w-[100%] lg:w-[calc(100%-445px)]"
              } scrollbar-hidden`}
            >
              {children}
            </div>
           
                <aside className="fixed 2xl:relative right-0 top-0 bottom-0 md:w-[281px] 2xl:-mt-[60px] min-h-[calc(100vh)] max-h-[calc(100vh)] 2xl:min-h-[calc(85vh-60px)] 2xl:max-h-[calc(85vh-60px)] scrollbar-hidden hidden md:inline-block lg:border lg:border-l-[#CDCDCD] lg:bg-brand-500 px-[20px]">
                  <DashboardAside />
                </aside>
            
          </div>
        </div>
      
      
      </div>
    </div>
  );
};
