import { useState } from "react";
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import BeatLoader from "react-spinners/BeatLoader";

import ModalContainer from "@/components/Modal";
import notify from "@/libs/toast";
import InputBox, { TextBox } from "../ProfileModals/InputBox";
import { useCreateAchievement } from "@/api/profile";

const CreateAchievement = ({ onClose }: { onClose: () => void }) => {
  const { data: session } = useSession();

  const TOKEN = session?.user?.access;

  const queryClient = useQueryClient();

  const { mutate: createAchievement, isLoading: isCreatingAchievement } =
    useCreateAchievement();

  const achievementValidation = yup.object().shape({
    title: yup.string().required(),
    image: yup.mixed().required("Image is required"),
    description: yup.string().optional(),
    month: yup.string().required(),
    year: yup.string().required(),
  });

  const [chosenAchievementImage, setChosenAchievementImage] =
    useState<any>(null);

  const achievementFormik = useFormik({
    initialValues: {
      title: "",
      image: null,
      description: "",
      month: "",
      year: "",
    },
    validationSchema: achievementValidation,
    validateOnBlur: true,
    onSubmit: (values: any) => {
      createAchievement(
        {
          token: TOKEN as string,
          body: {
            title: values.title,
            image: chosenAchievementImage,
            description: values.description,
            month: values.month,
            year: values.year,
          },
        },
        {
          onSuccess: () => {
            notify({
              type: "success",
              text: "You have successfully created an achievement",
            });
            queryClient.invalidateQueries(["getAchievements"]);
            onClose();
          },
          onError: (err: any) => notify({ type: "error", text: err?.message }),
        }
      );
    },
  });

  return (
    <ModalContainer>
      <div className="relative w-[90%] lg:w-[751px] pb-[100px] overflow-y-scroll h-[520px] bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
        <div className="h-[61px] w-[100%] z-[999] sticky bg-brand-500 top-0 border border-brand-2800 border-t-transparent border-x-transparent flex justify-between items-center">
          <h3 className="text-brand-600 ml-[28px] text-[20px] leading-[30px] font-medium">
            Add Achievement or Trophy
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
        <FormikProvider value={achievementFormik}>
          <form onSubmit={achievementFormik.handleSubmit}>
            <div className="w-full px-[32px] py-[28px]">
              <div className="flex gap-[20px] mb-[12px]">
                <div className="basis-[50%]">
                  <InputBox
                    id="title"
                    placeholder="Title of your achievement"
                    title="Title *"
                    onChange={achievementFormik.handleChange}
                    value={achievementFormik.values.title}
                    onBlur={achievementFormik.handleBlur}
                  />
                  <ErrorMessage
                    name="title"
                    component="p"
                    className="text-brand-warning text-[12px]"
                  />
                </div>
                <div className="basis-[50%]">
                  <InputBox
                    id="image"
                    type="file"
                    accept="image/*"
                    placeholder="Achievement image"
                    title="Image *"
                    onChange={(e: any) => {
                      achievementFormik.handleChange(e);
                      setChosenAchievementImage(e?.target?.files[0]);
                    }}
                    value={achievementFormik.values.image}
                    onBlur={achievementFormik.handleBlur}
                  />
                  <ErrorMessage
                    name="image"
                    component="p"
                    className="text-brand-warning text-[12px]"
                  />
                </div>
              </div>

              <TextBox
                id="description"
                onChange={achievementFormik.handleChange}
                value={achievementFormik.values.description as string}
                placeholder="Describe your achievement..."
                onBlur={achievementFormik.handleBlur}
                title="Description"
              />

              <div className="flex gap-[20px] mt-[12px]">
                <div className="basis-[50%]">
                  <InputBox
                    id="month"
                    placeholder="Enter the month in full..."
                    title="Month*"
                    onChange={achievementFormik.handleChange}
                    value={achievementFormik.values.month}
                    onBlur={achievementFormik.handleBlur}
                  />
                  <ErrorMessage
                    name="month"
                    component="p"
                    className="text-brand-warning text-[12px]"
                  />
                </div>

                <div className="basis-[50%]">
                  <InputBox
                    id="year"
                    placeholder="Enter the year of your achievement"
                    title="Year*"
                    onChange={achievementFormik.handleChange}
                    value={achievementFormik.values.year}
                    onBlur={achievementFormik.handleBlur}
                  />
                  <ErrorMessage
                    name="year"
                    component="p"
                    className="text-brand-warning text-[12px]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-brand-600 h-[52px] w-[187px] mt-[34px] text-brand-500 rounded-[4px] p-[13px]"
                >
                  {isCreatingAchievement ? (
                    <BeatLoader
                      color={"white"}
                      size={10}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </div>
          </form>
        </FormikProvider>
      </div>
    </ModalContainer>
  );
};

export default CreateAchievement;
