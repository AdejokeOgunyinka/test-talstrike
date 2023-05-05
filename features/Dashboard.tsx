/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import BeatLoader from "react-spinners/BeatLoader";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useRouter } from "next/router";

import TalentAd from "@/assets/talentAd1.png";
import InstagramIcon from "@/assets/instagramIcon.svg";
import PhoneCallIcon from "@/assets/phoneCallIcon.svg";
import MessageIcon from "@/assets/messageIcon.svg";
import VideoCameraIcon from "@/assets/videoCameraIcon.svg";
import ImageIcon from "@/assets/imageIcon.svg";
import VideoIcon from "@/assets/videoIcon.svg";
import ProfileImg from "@/assets/profileIcon.svg";
import MoreDropdown from "@/components/DashboardMoreDropdown";
import PostCard from "@/components/PostCard";
import CreatePost from "@/components/ProfileModals/CreatePost";
import CreateArticle from "@/components/ProfileModals/CreateArticle";
import CreateAnnouncements from "@/components/ProfileModals/CreateAnnouncement";
import CreateOpening from "@/components/ProfileModals/CreateOpening";
import { useGetMyProfile, useGetPostsByType } from "@/api/profile";
import { useFollowUser } from "@/api/players";
import { useGetNewsfeed, useGetSuggestedFollows } from "@/api/dashboard";
import notify from "@/libs/toast";
import { useTypedDispatch, useTypedSelector } from "@/hooks/hooks";
import { setProfile } from "@/store/slices/profileSlice";

export const postWidgets = [
  { icon: VideoCameraIcon, name: "Live" },
  { icon: ImageIcon, name: "Photo" },
  { icon: VideoIcon, name: "Video" },
];

const Dashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useTypedDispatch();

  const { userInfo } = useTypedSelector((state) => state.profile);

  const TOKEN = session?.user?.access;

  const USER_ID = session?.user?.id;

  const { data: userData } = useGetMyProfile({
    token: TOKEN as string,
    userId: USER_ID as string,
  });

  useEffect(() => {
    dispatch(setProfile(userData));
  }, [dispatch, userData]);

  const { data: NewsFeedData, isLoading: isLoadingNewsFeed } = useGetNewsfeed(
    TOKEN as string
  );
  const { data: TalentOpenings, isLoading: isLoadingTalentOpenings } =
    useGetPostsByType({
      token: TOKEN as string,
      userId: USER_ID as string,
      post_type: "OPENING",
    });
  const { data: SuggestedFollows } = useGetSuggestedFollows(TOKEN as string);

  const queryClient = useQueryClient();

  const { mutate: followUser, isLoading: isFollowingPlayer } = useFollowUser();

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] =
    useState(false);
  const [showCreateArticleModal, setShowCreateArticleModal] = useState(false);
  const [showCreateOpeningModal, setShowCreateOpeningModal] = useState(false);

  const [openMoreDropdown, setOpenMoreDropdown] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setOpenMoreDropdown(false);
    });
  }, []);

  return (
    <div className="w-full min-h-[100vh] gap-x-[20px] py-[20px] px-[15px] md:px-[26px] flex flex-col md:flex-row bg-brand-1000 md:rounded-tl-[15px] md:rounded-tr-[15px]">
      {showCreatePostModal && (
        <CreatePost onClose={() => setShowCreatePostModal(false)} />
      )}
      {showCreateAnnouncementModal && (
        <CreateAnnouncements
          onClose={() => setShowCreateAnnouncementModal(false)}
        />
      )}
      {showCreateArticleModal && (
        <CreateArticle onClose={() => setShowCreateArticleModal(false)} />
      )}
      {showCreateOpeningModal && (
        <CreateOpening onClose={() => setShowCreateOpeningModal(false)} />
      )}

      <div className="basis-[60%]">
        <div className="w-[100%] py-[12px] px-[14px] mb-[25px] h-[120px] shadow shadow-[0px_5px_14px_rgba(0, 0, 0, 0.09)] rounded-[12px] bg-brand-500">
          <div className="flex items-center">
            <div className="w-[40px] h-[40px] overflow-hidden">
              <img
                src={
                  userInfo?.profile?.user?.image !== null
                    ? userInfo?.profile?.user?.image
                    : ProfileImg
                }
                alt="profile"
                className="w-[40px] h-[40px] rounded-[50%] border-2 border-brand-500"
              />
            </div>
            <div className="ml-[10px] h-[30px] bg-brand-1250 rounded-[6px] w-[calc(100%-50px)]">
              <div className="w-[100%] h-[100%] pl-[11px] flex items-center focus:outline-0 rounded-[6px]  bg-brand-1250 text-[11px] font-light text-brand-200 leading-[16px]">
                <p>Post something interesting...</p>
              </div>
            </div>
          </div>
          <div
            className="mt-[22px] flex justify-between items-center"
            onClick={(e) => e?.stopPropagation()}
          >
            <div className="flex w-full justify-center gap-x-[10px] md:gap-x-[14px] items-center">
              {postWidgets.map((widget, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center cursor-pointer"
                  onClick={() => setShowCreatePostModal(true)}
                >
                  <NextImage src={widget.icon} alt="widget" />
                  <p className="ml-[4px] font-semibold text-[11px] leading-[16px] text-brand-50">
                    {widget.name}
                  </p>
                </div>
              ))}
              <div className="relative">
                <p
                  onClick={() => setOpenMoreDropdown(!openMoreDropdown)}
                  className="font-semibold cursor-pointer text-[11px] leading-[16px] text-brand-50 mr-[5px] md:mr-[0px]"
                >
                  Others
                </p>
                {openMoreDropdown && (
                  <div className="absolute left-[0px] top-[20px] z-[99]">
                    <MoreDropdown
                      onClickAnnouncement={() =>
                        setShowCreateAnnouncementModal(true)
                      }
                      onClickArticle={() => setShowCreateArticleModal(true)}
                      onClickOpening={() => setShowCreateOpeningModal(true)}
                    />
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowCreatePostModal(!showCreatePostModal)}
              className="w-[101px] h-[30px] text-brand-500 bg-brand-600 cursor-pointer rounded-[4px] text-[11px] font-semibold leading-[16px]"
            >
              Create Post
            </button>
          </div>
        </div>
        {isLoadingNewsFeed ? (
          <SkeletonTheme
            baseColor="rgba(0, 116, 217, 0.18)"
            highlightColor="#fff"
          >
            <section>
              <Skeleton height={550} width="100%" />
            </section>
          </SkeletonTheme>
        ) : NewsFeedData?.results?.length === 0 ? (
          <p className="bg-brand-1300 px-2 py-2 text-[14px]">
            Sorry! You are unable to see any posts on your newsfeed, either
            because you have not yet added someone to your friends list, or none
            of your friends have created a post yet, or you have not yet created
            a post...
          </p>
        ) : (
          NewsFeedData?.results
            ?.sort(
              (a: any, b: any) =>
                new Date(a?.updated_at)?.valueOf() -
                new Date(b?.updated_at)?.valueOf()
            )
            ?.map((post: any, index: number) => (
              <PostCard
                postType={post?.post_type}
                postImage={post?.author?.image}
                postAuthor={`${post?.author?.firstname} ${post?.author?.lastname}`}
                timeCreated={post?.created_at}
                postBody={post?.body}
                postMedia={post?.media}
                postLikedAvatars={post.liked_avatars}
                postLikeCount={post?.like_count}
                postCommentCount={post?.comment_count}
                postShareCount={post?.share_count}
                postId={post?.id}
                liked={post?.liked}
                key={index}
                isLoadingPost={isLoadingNewsFeed}
                postTitle={post?.title}
                fileType={post?.file_type}
              />
            ))
        )}
      </div>
      <div className="basis-[40%] pb-[100px] lg:pb-0">
        <div className="w-[100%] h-[176px] overflow-hidden rounded-[12px]">
          <NextImage
            src={TalentAd}
            className="ad-img"
            alt="talent ad"
            width="380"
          />
        </div>

        <div className="w-[100%] h-[173px] shadow shadow-[0px_5px_14px_rgba(0, 0, 0, 0.09)] rounded-[12px] mt-[16px] bg-brand-500 divide-y divide-brand-1150">
          <div className="h-[34px] flex justify-between items-center pl-[17px] pr-[10px]">
            <h4 className="font-bold text-brand-90 text-[11px] lg:text-[13px] 2xl:text-[15px] leading-[16px]">
              Players you might like
            </h4>
            <h5
              onClick={() => router.push("/players")}
              className="text-brand-400 text-[11px] lg:text-[13px] 2xl:text-[15px] leading-[16px] font-normal cursor-pointer"
            >
              See all
            </h5>
          </div>
          <div className="pt-[17px] w-[100%] px-[17px]">
            <div className="w-[100%] flex items-center">
              <div className="w-[40px] h-[40px] mr-[14px]">
                {SuggestedFollows?.data && (
                  <NextImage
                    src={SuggestedFollows?.data[0]?.image}
                    alt="jack"
                    width="40"
                    height="40"
                  />
                )}
              </div>
              <div>
                <p className="text-[11px] lg:text-[13px] 2xl:text-[15px] leading-[16px] text-brand-50">
                  {SuggestedFollows?.data[0]?.firstname}{" "}
                  {SuggestedFollows?.data[0]?.lastname}
                </p>
                <p className="text-[10px] lg:text-[12px] 2xl:text-[14px] text-brand-1200 leading-[15px]">
                  {SuggestedFollows?.data[0]?.roles[0]}
                </p>
              </div>
            </div>
            <div className="w-[100%] mt-[3px] mb-[18px] flex justify-end">
              <div className="flex gap-x-[19px]">
                <NextImage
                  src={InstagramIcon}
                  alt="instagram"
                  style={{ cursor: "pointer", width: "14px", height: "14px" }}
                />
                <NextImage
                  src={PhoneCallIcon}
                  alt="phone"
                  style={{ cursor: "pointer", width: "14px", height: "14px" }}
                />
                <NextImage
                  src={MessageIcon}
                  alt="message"
                  style={{ cursor: "pointer", width: "14px", height: "14px" }}
                />
              </div>
            </div>
            <div className="w-full flex justify-between gap-x-[18px]">
              <button className="basis-[50%] border border-brand-300 text-brand-200 rounded-[7px] h-[32px]">
                Ignore
              </button>
              <button
                className="basis-[50%] rounded-[7px] bg-brand-600 text-brand-500 h-[32px]"
                onClick={() => {
                  followUser(
                    {
                      token: TOKEN as string,
                      userId: SuggestedFollows?.data[0]?.id,
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries(["getSuggestedFollows"]);
                        notify({
                          type: "success",
                          text: `You are now following ${SuggestedFollows?.data[0]?.firstname} ${SuggestedFollows?.data[0]?.lastname}`,
                        });
                      },
                    }
                  );
                }}
              >
                {isFollowingPlayer ? (
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
          </div>
        </div>

        <div className="w-[100%] max-h-[345px] md:max-h-[324px] shadow shadow-[0px_5px_14px_rgba(0, 0, 0, 0.09)] rounded-[12px] mt-[19px] bg-brand-500 divide-y divide-brand-1150">
          <div className="h-[39px] flex justify-between items-center pl-[16px] pr-[16px]">
            <h4 className="font-bold text-brand-90 text-[11px] lg:text-[13px] 2xl:text-[15px] leading-[16px]">
              Talent openings
            </h4>
            <h4 className="font-semibold text-[20px] leading-[30px] text-brand-50">
              ...
            </h4>
          </div>
          <div className="py-[17px] px-[16px] flex flex-col gap-y-[15px]">
            {TalentOpenings?.results?.length === 0 ? (
              <p>There are no talent openings yet..</p>
            ) : isLoadingTalentOpenings ? (
              <SkeletonTheme
                baseColor="rgba(0, 116, 217, 0.18)"
                highlightColor="#fff"
              >
                <section>
                  <Skeleton height={100} width="100%" />
                </section>
              </SkeletonTheme>
            ) : (
              TalentOpenings?.results
                ?.slice(0, 2)
                .map((talentOpening: any, index: number) => (
                  <div
                    className="w-[100%] h-[130px] md:h-[116px] bg-brand-1250 rounded-[10px] divide-y divide-brand-1300"
                    key={index}
                  >
                    <div className="h-[98px] md:h-[81px] w-[100%] pt-[12px] px-[13px] flex items-center">
                      {talentOpening?.media && (
                        <NextImage
                          src={talentOpening?.media}
                          alt="talentOpening media"
                          width="45"
                          height="45"
                          style={{
                            overflow: "hidden",
                            borderRadius: "10px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <div className="ml-[13px]">
                        <p className="text-[11px] mb-[3px] leading-[16px] lg:text-[12px] 2xl:text-[13px] text-brand-50 font-semibold">
                          {talentOpening?.title}
                        </p>
                        <p className="text-[10px] leading-[15px] text-brand-50 font-normal">
                          {talentOpening?.body}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pl-[15px] pt-[9px] relative">
                      <p className="font-semibold text-brand-1350 text-[11px] lg:text-[12px] 2xl:text-[13px] leading-[16px]">
                        {talentOpening?.like_count} likes
                      </p>

                      <div className="absolute -top-[10px] flex right-[14px]">
                        {talentOpening.views?.icons
                          ?.slice(0, 3)
                          ?.map((icon: string, index: number) => (
                            <div className="-ml-[7px]" key={index}>
                              <NextImage
                                src={icon}
                                alt="icons"
                                width="40"
                                height="40"
                              />
                            </div>
                          ))}
                        <p className="text-[11px] lg:text-[12px] 2xl:text-[13px] ml-[3px] pt-[2px] text-brand-1050">
                          {talentOpening?.views?.total > 0
                            ? `+${talentOpening?.views?.total - 3}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
