import { useEffect, useState } from "react";
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import styled from "styled-components";
import { useQueryClient } from "@tanstack/react-query";
import BeatLoader from "react-spinners/BeatLoader";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import BarLoader from "react-spinners/BarLoader";

import ModalContainer from "@/components/Modal";
import ProfileImg from "@/assets/profileIcon.svg";
import { useTypedSelector } from "@/hooks/hooks";
import { TextBox } from "./InputBox";
import ChooseMedia from "./ChooseMedia";
import notify from "@/libs/toast";
import { useEditPost, useGetSinglePost } from "@/api/profile";
import { handleOnError } from "@/libs/utils";

const Image = styled.img``;

const EditPost = ({ onClose, id }: { onClose: () => void; id: string }) => {
  const { data: session } = useSession();
  const { userInfo } = useTypedSelector((state) => state.profile);

  const editPostValidationSchema = yup.object().shape({
    description: yup.string().optional(),
  });

  const TOKEN = session?.user?.access;

  const { data: postDetail, isLoading: isLoadingPostDetail } = useGetSinglePost(
    {
      token: TOKEN as string,
      postId: id,
    }
  );

  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(postDetail?.media);

  useEffect(() => {
    setSelectedMediaUrl(postDetail?.media);
  }, [postDetail]);

  const [openChooseMedia, setOpenChooseMedia] = useState(false);
  const [fileType, setFileType] = useState("");

  const { mutate: editPost, isLoading: isEditingPost } = useEditPost();
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      description: postDetail?.body,
    },
    validationSchema: editPostValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const initialBody = {
        body: values.description,
        post_type:
          fileType === "IMAGE"
            ? "PHOTO"
            : fileType === "VIDEO"
            ? "VIDEO"
            : "PHOTO",
        ...(selectedMedia && { media: selectedMedia }),
        file_type: fileType,
      };

      const body = new FormData();

      for (let key in initialBody) {
        body.append(key, initialBody[key]);
      }

      editPost(
        { token: TOKEN as string, body, id },
        {
          onSuccess: () => {
            notify({
              type: "success",
              text: "Post has been successfully created",
            });
            queryClient.invalidateQueries(["getMyPostsByType"]);
            queryClient.invalidateQueries(["getNewsfeed"]);
            queryClient.invalidateQueries(["getMyPosts"]);
            onClose();
          },
          onError: (err: any) =>
            notify({
              type: "error",
              text: err?.body || err?.data?.body || err?.data?.message,
            }),
        }
      );
    },
  });

  return (
    <ModalContainer>
      {openChooseMedia ? (
        <ChooseMedia
          fileType={fileType}
          setSelectedMedia={setSelectedMedia}
          setSelectedMediaUrl={setSelectedMediaUrl}
          onClose={() => setOpenChooseMedia(false)}
          formik={formik}
        />
      ) : (
        <div className="relative w-[90%] lg:w-[751px] pb-[100px] h-[450px] bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <div className="h-[61px] border border-brand-2800 border-t-transparent border-x-transparent flex justify-between items-center">
                <h3 className="text-brand-600 ml-[28px] text-[20px] leading-[30px] font-medium">
                  Edit Post
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
              {isLoadingPostDetail ? (
                <SkeletonTheme
                  baseColor="rgba(0, 116, 217, 0.18)"
                  highlightColor="#fff"
                >
                  <section>
                    <Skeleton height={550} width="100%" />
                  </section>
                </SkeletonTheme>
              ) : (
                <>
                  <div className="w-full px-[32px] pt-[28px] pb-[80px] overflow-y-scroll h-[350px]">
                    <div className="flex items-center gap-x-[8px] mb-[36px]">
                      <div className="w-[50px] h-[50px] rounded-[50%] border border-[3px] border-brand-500 shadow shadow-[0px_1.275px_12.75px_rgba(0, 0, 0, 0.2)]">
                        <NextImage
                          src={
                            userInfo?.profile?.user?.image !== null
                              ? userInfo?.profile?.user?.image
                              : ProfileImg
                          }
                          alt="profile"
                          width="50"
                          height="50"
                          onError={handleOnError}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-[16px] leading-[24px] text-brand-2250">
                          {session?.user?.firstname} {session?.user?.lastname}
                        </p>
                        <p className="font-medium text-[14px] leading-[21px] text-brand-2450">
                          {userInfo?.profile?.position}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-y-[35px]">
                      <div className="w-full -ml-[20px] -mt-[30px]">
                        <TextBox
                          title=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="description"
                          placeholder="Type something interesting..."
                          value={formik.values.description}
                          withoutBorder
                        />
                      </div>
                    </div>

                    <ErrorMessage
                      name="media"
                      component="p"
                      className="text-brand-warning text-[12px]"
                    />
                    {selectedMediaUrl && (
                      <div className="mt-[10px] w-[50%] h-[300px]">
                        {postDetail?.file_type?.toLowerCase() === "video" ? (
                          <video
                            controls
                            src={selectedMediaUrl}
                            width="100%"
                            className="w-full h-full"
                          ></video>
                        ) : (
                          <Image src={selectedMediaUrl} alt="media" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 w-[100%] lg:w-[751px] rounded-bl-[8px] rounded-br-[8px]  bg-brand-500 flex justify-between items-center fixed h-[98px] border border-brand-2800 border-b-transparent border-x-transparent">
                    {fileType === "VIDEO" && isEditingPost && (
                      <div className="absolute top-0 w-[100%]">
                        <BarLoader color="#0074D9" width="100%" />
                      </div>
                    )}
                    <div className="flex gap-x-[10px] lg:gap-x-[48px]">
                      <div
                        className="flex ml-[10px] lg:ml-[48px] cursor-pointer"
                        onClick={() => {
                          setFileType("IMAGE");
                          setOpenChooseMedia(true);
                        }}
                      >
                        <NextImage
                          src="/image.svg"
                          alt="img"
                          width="19"
                          height="16"
                        />
                        <p className="ml-[7.89px] text-[12px] lg:text-[18px] font-semibold leading-[27px] text-brand-600">
                          Photo
                        </p>
                      </div>
                      <div
                        className="flex cursor-pointer"
                        onClick={() => {
                          setFileType("VIDEO");
                          setOpenChooseMedia(true);
                        }}
                      >
                        <NextImage
                          src="/video.svg"
                          alt="video"
                          width="22"
                          height="16"
                        />
                        <p className="ml-[7.89px] text-[12px] lg:text-[18px] font-semibold leading-[27px] text-brand-600">
                          Video
                        </p>
                      </div>
                    </div>
                    <div className=" mr-[10px] lg:mr-[36px] flex gap-x-[14px]">
                      <button
                        onClick={() => {
                          setSelectedMedia("");
                          formik.resetForm();
                          onClose();
                        }}
                        className="border border-[2px] border-brand-600 rounded-[4px] h-[41px] w-[80px] lg:w-[127px] text-brand-600 text-[14px] lg:text-[18px] font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="h-[41px] w-[80px] lg:w-[127px] rounded-[4px] bg-brand-600 text-brand-500 text-[14px] lg:text-[18px] font-semibold"
                        disabled={isEditingPost}
                      >
                        {isEditingPost ? (
                          <BeatLoader
                            color={"white"}
                            size={10}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                          />
                        ) : (
                          "Post"
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </FormikProvider>
        </div>
      )}
    </ModalContainer>
  );
};

export default EditPost;
