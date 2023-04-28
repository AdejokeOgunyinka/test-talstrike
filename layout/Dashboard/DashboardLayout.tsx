import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NextImage from "next/image";

import { DashboardSidebar, MobileMenu } from "./DashboardSidebar";
import SearchBar from "@/components/SearchBar";
import DashboardAside from "./DashboardAside";
import DashboardTopBarModal from "./DashboardTopModal";
import { useGetMyProfile } from "@/api/profile";
import { setProfile } from "@/store/slices/profileSlice";
import { useTypedDispatch } from "@/hooks/hooks";
import ProfileImg from "@/assets/profileIcon.svg";
import { isActivePath } from "@/libs/utils";
import { MobileSideBarLink } from "./DashboardSidebar";

type LayoutProps = {
  children?: React.ReactNode;
};

export const DashboardLayout = ({ children }: LayoutProps) => {
  const dispatch = useTypedDispatch();
  const router = useRouter();
  const [showSignOutButton, setShowSignOutButton] = useState(false);

  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const USER_ID = session?.user?.id;

  const { data: userData } = useGetMyProfile({
    token: TOKEN as string,
    userId: USER_ID as string,
  });
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    dispatch(setProfile(userData));
  }, [dispatch, userData]);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowSignOutButton(false);
    });
  }, []);

  return (
    <div className="w-full min-h-screen lg:flex lg:justify-center">
      <div className="w-full 2xl:w-[70vw] 2xl:h-[85vh] h-[100%] relative flex 2xl: mx-auto 2xl: my-auto 2xl:rounded-[29px] 2xl:overflow-hidden bg-brand-500">
        <div className="w-[178px] 2xl:rounded-tl-[29px] 2xl:rounded-bl-[29px] h-[100%] bg-brand-500 2xl:h-[85vh] fixed">
          <DashboardSidebar />
        </div>
        <div className="ml-[unset] md:ml-[178px] w-[100%] md:w-[calc(100%-178px)] relative md:static scrollbar-hidden">
          <div className="bg-brand-500 z-[10] h-[70px] w-[100%] flex justify-between py-[15px] pr-[10px] lg:pr-[23px] pl-[10px] sticky top-0 z-[999]">
            <div className="w-[50%] lg:w-[475px] h-[100%]">
              <SearchBar placeholder="Search" />
            </div>
            <div className="flex items-center justify-end h-[100%] w-[50%] md:w-[calc(100%-475px)]">
              <p
                onClick={() => setShowSignOutButton(!showSignOutButton)}
                className="mr-[9px] cursor-pointer font-normal text-[11px] text-brand-90 lg:text-[14px] 2xl:text-[16px] leading-[16px]"
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
                <div className="rounded-[7px] overflow-hidden flex justify-center items-center cursor-pointer">
                  <NextImage
                    src={
                      session?.user?.image !== null
                        ? (session?.user?.image as string)
                        : ProfileImg
                    }
                    alt="me"
                    width="35"
                    height="35"
                  />
                </div>
                {showSignOutButton && <DashboardTopBarModal />}
              </div>
            </div>
          </div>
          <div className="w-[100%] min-h-[calc(100vh-70px)] flex scrollbar-hidden">
            <div
              className={`w-[100%] ${
                router.pathname === "/explore" ||
                router.pathname === "/profile" ||
                router.pathname === "/profile/[id]"
                  ? "md:w-[calc(100%-23px)]"
                  : "lg:w-[calc(100%-267px)]"
              } h-[100%] scrollbar-hidden`}
            >
              {children}
            </div>
            {router.pathname !== "/explore" &&
              router.pathname !== "/profile" &&
              router.pathname !== "/profile/[id]" && (
                <aside className="fixed right-0 top-0 bottom-0 md:w-[267px] px-[20px] scrollbar-hidden">
                  <DashboardAside />
                </aside>
              )}
          </div>
        </div>
        <div className="inline-block md:hidden fixed bottom-0 left-0 right-0 h-[81px] w-full bg-brand-500 z-[999] overflow-y-scroll">
          <MobileMenu show={showMore} setShow={setShowMore} />
        </div>

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
