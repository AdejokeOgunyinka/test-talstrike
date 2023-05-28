import { useState } from "react";
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import { ErrorMessage, FieldArray, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import styled from "styled-components";
import { useQueryClient } from "@tanstack/react-query";
import BeatLoader from "react-spinners/BeatLoader";
import BarLoader from "react-spinners/BarLoader";

import ModalContainer from "@/components/Modal";
import ProfileImg from "@/assets/profileIcon.svg";
import { useTypedSelector } from "@/hooks/hooks";
import InputBox, { TextBox, Dropdown } from "./InputBox";
import ChooseMedia from "./ChooseMedia";
import notify from "@/libs/toast";
import { useCreatePoll } from "@/api/profile";
import { handleOnError } from "@/libs/utils";

const Image = styled.img``;

const CreatePoll = ({ onClose }: { onClose: () => void }) => {
  const { data: session } = useSession();
  const { userInfo } = useTypedSelector((state) => state.profile);

  const [selectedMedia, setSelectedMedia] = useState<any>("");
  const [selectedMediaUrl, setSelectedMediaUrl] = useState("");
  const [openChooseMedia, setOpenChooseMedia] = useState(false);
  const [fileType, setFileType] = useState("");

  const createPollValidationSchema = yup.object().shape({
    question_text: yup.string().required("Poll Question is required"),
    choices: yup
      .array()
      .of(yup.string()?.required("Option cannot be empty"))
      .min(2, "Minimum of 2 options required")
      .required("Option cannot be empty"),
    mins: yup.string().optional(),
    hours: yup.string().optional(),
    days: yup.string().required(),
  });

  const TOKEN = session?.user?.access;

  const { mutate: createPoll, isLoading: isCreatingPoll } = useCreatePoll();
  const queryClient = useQueryClient();

  const time = Array.from({ length: 61 }, (v, k) => k)?.map((val) => {
    if (val < 10) {
      return { value: `0${val}`, label: `${val}` };
    } else {
      return { value: `${val}`, label: `${val}` };
    }
  });

  const formik = useFormik({
    initialValues: {
      question_text: "",
      choices: [""],
      media: selectedMedia,
      mins: "",
      hours: "",
      days: "",
    },
    validationSchema: createPollValidationSchema,
    onSubmit: (values) => {
      const initialBody: Record<string, any> = {
        question_text: values?.question_text,
        duration: `${values.days} ${values.hours}:${values.mins}:00`,
        ...(fileType === "IMAGE" && { image: selectedMedia }),
        ...(fileType === "VIDEO" && { video: selectedMedia }),
      };

      console.log({ initialBody });

      const body = new FormData();

      for (let key in initialBody) {
        body.append(key, initialBody[key]);
      }

      for (var i = 0; i < values?.choices.length; i++) {
        body.append(`choices[${i}]`, values?.choices[i]);
      }

      createPoll(
        { token: TOKEN as string, data: body },
        {
          onSuccess: () => {
            notify({
              type: "success",
              text: "Poll has been successfully created",
            });
            queryClient.invalidateQueries(["getPollsByUserId"]);
            queryClient.invalidateQueries(["getNewsfeed"]);
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

  const days = Array.from(
    {
      length:
        formik?.values?.mins === "00" && formik?.values?.hours === "00" ? 7 : 6,
    },
    (v, k) => k + 1
  )?.map((val) => {
    return { value: `${val}`, label: `${val}` };
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
        <div className="relative w-[90%] lg:w-[751px] pb-[100px] h-[608px] bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <div className="h-[61px] border border-brand-2800 border-t-transparent border-x-transparent flex justify-between items-center">
                <h3 className="text-brand-600 ml-[28px] text-[20px] leading-[30px] font-medium">
                  Create Poll
                </h3>
                <NextImage
                  src={"/closeIcon.svg"}
                  alt="close"
                  className="cursor-pointer"
                  onClick={onClose}
                  width="66"
                  height="61"
                />
              </div>
              <div className="w-full px-[32px] pt-[28px] pb-[80px] overflow-y-scroll h-[450px]">
                <div className="flex items-center gap-x-[8px] mb-[36px]">
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
                    className="object-cover w-[50px] h-[50px] rounded-[50%] border border-[3px] border-brand-500 shadow shadow-[0px_1.275px_12.75px_rgba(0, 0, 0, 0.2)]"
                  />
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
                  <div className="w-full">
                    <InputBox
                      title="Poll Question"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.question_text}
                      id="question_text"
                      placeholder="Poll question"
                      disabled={false}
                    />
                    <ErrorMessage
                      name="question_text"
                      component="p"
                      className="text-brand-warning text-[12px]"
                    />
                  </div>

                  <div className="w-full">
                    <FieldArray
                      name="choices"
                      render={(arrayHelpers) => (
                        <div>
                          <p className="text-brand-3000 font-medium text-[18px] leading-[162%]">
                            Options
                          </p>
                          <div className="flex items-end">
                            <div className="w-[93%]">
                              {formik.values.choices?.map((value, index) => (
                                <div key={index}>
                                  <InputBox
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={value}
                                    id={`choices.${index}`}
                                    placeholder="Option"
                                    name={`choices.${index}`}
                                  />
                                </div>
                              ))}
                            </div>
                            <div>
                              <button
                                className="modal__addBtn"
                                onClick={() =>
                                  arrayHelpers.insert(
                                    formik.values.choices?.length + 1,
                                    ""
                                  )
                                }
                                type="button"
                              >
                                <Image src="/add.svg" alt="add" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    />
                    <ErrorMessage
                      name="choices"
                      component="p"
                      className="text-brand-warning text-[12px]"
                    />
                  </div>

                  <div>
                    <p className="text-brand-3000 font-medium text-[18px] leading-[162%] mb-[11px]">
                      Set Duration
                    </p>

                    <div className="flex gap-x-[15px]">
                      <div className="w-full">
                        <Dropdown
                          options={time}
                          name="mins"
                          id="mins"
                          className="poll-dropdown"
                          placeholder="Mins"
                          onChange={(e: any) =>
                            formik?.setFieldValue("mins", e?.value)
                          }
                        />
                        <ErrorMessage
                          name="mins"
                          component="p"
                          className="text-brand-warning text-[12px]"
                        />
                      </div>

                      <div className="w-full">
                        <Dropdown
                          options={time}
                          name="hours"
                          id="hours"
                          className="poll-dropdown"
                          placeholder="Hours"
                          onChange={(e: any) =>
                            formik?.setFieldValue("hours", e?.value)
                          }
                        />
                        <ErrorMessage
                          name="hours"
                          component="p"
                          className="text-brand-warning text-[12px]"
                        />
                      </div>

                      <div className="w-full">
                        <Dropdown
                          options={days}
                          name="days"
                          id="days"
                          className="poll-dropdown"
                          placeholder="Days"
                          onChange={(e: any) =>
                            formik?.setFieldValue("days", e?.value)
                          }
                        />
                        <ErrorMessage
                          name="days"
                          component="p"
                          className="text-brand-warning text-[12px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <ErrorMessage
                  name="media"
                  component="p"
                  className="text-brand-warning text-[12px]"
                />
                {selectedMediaUrl && (
                  <div className="mt-[35px] w-[50%] h-[300px]">
                    {fileType?.toLowerCase() === "image" ? (
                      <Image src={selectedMediaUrl} alt="media" />
                    ) : (
                      <video
                        controls
                        src={selectedMediaUrl}
                        width="100%"
                        className="w-full h-full"
                      ></video>
                    )}
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 w-[100%] lg:w-[751px] rounded-bl-[8px] rounded-br-[8px]  bg-brand-500 flex justify-between items-center fixed h-[98px] border border-brand-2800 border-b-transparent border-x-transparent">
                {fileType === "VIDEO" && isCreatingPoll && (
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
                    disabled={isCreatingPoll}
                  >
                    {isCreatingPoll ? (
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
            </form>
          </FormikProvider>
        </div>
      )}
    </ModalContainer>
  );
};

export default CreatePoll;
