/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { useState } from "react";
import { ErrorMessage, FieldArray, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { useQueryClient } from "@tanstack/react-query";

import ModalContainer from "@/components/Modal";
import InputBox, { TextBox } from "./InputBox";
import { useTypedSelector } from "@/hooks/hooks";
import { updateUserProfile } from "@/api/auth";
import {
  useGetAchievements,
  useCreateAchievement,
  useGetAppearances,
  useCreateAppearance,
  useDeleteAchievement,
  useDeleteAppearance,
} from "@/api/profile";
import notify from "@/libs/toast";
import AchievementDummy from "@/assets/achievementDummyImg.svg";
import BeatLoader from "react-spinners/BeatLoader";
import { useSession } from "next-auth/react";
import SkeletonLoader from "../SkeletonLoader";
import { AchievementSelectDropdown } from "../SelectDropdown";
import { getYears, months } from "@/libs/utils";

const EditCareerProgress = ({ onClose }: { onClose: () => void }) => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const USER_ID = session?.user?.id;

  const { userInfo } = useTypedSelector((state) => state.profile);

  const careerProgressValidationSchema = yup.object().shape({
    teams: yup
      .array()
      .of(yup.string().required("Teams cannot be empty"))
      .required("*Teams is required")
      .min(1, "Minimum of 1 team is required")
      .max(5, "Maximum of 5 teams are expected"),
    abilities: yup
      .array()
      .of(yup.string().required("Ability cannot be empty"))
      .required("*Abilities is required")
      .min(1, "Minimum of 1 ability is required")
      .max(5, "Maximum of 5 abilities are expected"),
    skills: yup
      .array()
      .of(yup.string().required("Skill cannot be empty"))
      .required("*Skills are required")
      .min(1, "Minimum of 1 skill is required")
      .max(5, "maximum of 5 skills are expected"),
    trainings: yup
      .array()
      .of(yup.string().required("Training cannot be empty"))
      .optional()
      .min(1, "Minimum of 1 training is required")
      .max(5, "maximum of 5 trainings are expected"),
  });

  const { data: achievements, isLoading: isLoadingAchievements } =
    useGetAchievements({
      token: TOKEN as string,
      userId: USER_ID as string,
    });

  const { data: appearances, isLoading: isLoadingAppearances } =
    useGetAppearances({
      token: TOKEN as string,
      userId: USER_ID as string,
    });

  const formik = useFormik({
    initialValues: {
      teams: userInfo?.profile?.teams,
      abilities: userInfo?.profile?.abilities,
      skills: userInfo?.profile?.skills,
      trainings: userInfo?.profile?.trainings,
    },
    validationSchema: careerProgressValidationSchema,
    onSubmit: async (values) => {
      setUpdatingProfile(true);

      const data = {
        achievements: achievements?.results?.map(
          (achievement: any) => achievement?.id
        ),
        appearances: appearances?.results?.map(
          (appearance: any) => appearance?.id
        ),
        teams: values.teams,
        abilities: values.abilities,
        skills: values.skills,
        trainings: values.trainings,
      };

      try {
        const updateUser = await updateUserProfile(TOKEN as string, data);
        if (updateUser.data.success === true) {
          notify({
            type: "success",
            text: "Profile has been successfully updated!",
          });
          queryClient.invalidateQueries(["getMyProfile"]);
          setUpdatingProfile(false);
          onClose();
        } else {
          notify({
            type: "error",
            text: updateUser?.data?.message?.toString(),
          });
          setUpdatingProfile(false);
        }
      } catch (err) {
        const { data } = (err as any)?.response;
        notify({ type: "error", text: data?.body || data?.message });
      } finally {
        setUpdatingProfile(false);
      }
    },
    validateOnBlur: true,
  });

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const queryClient = useQueryClient();

  const [teamInput, setTeamInput] = useState("");
  const [abilityInput, setAbilityInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [trainingInput, setTrainingInput] = useState("");

  const { mutate: createAchievement, isLoading: isCreatingAchievement } =
    useCreateAchievement();

  const [chosenAchievementImage, setChosenAchievementImage] =
    useState<any>(null);

  const achievementValidation = yup.object().shape({
    title: yup.string().required(),
    image: yup.mixed().required("Image is required"),
    description: yup.string().optional(),
    month: yup.string().required(),
    year: yup.string().required(),
  });

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
    onSubmit: (values: any, { resetForm }) => {
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
            resetForm({
              values: {
                title: "",
                image: null,
                description: "",
                month: "",
                year: "",
              },
            });
          },
          onError: (err: any) => notify({ type: "error", text: err?.message }),
        }
      );
    },
  });

  const { mutate: createAppearance, isLoading: isCreatingAppearance } =
    useCreateAppearance();

  const [chosenAppearanceImage, setChosenAppearanceImage] = useState<any>(null);

  const appearanceValidation = yup.object().shape({
    tournament_title: yup.string().required(),
    image: yup.mixed().required("Image is required"),
    number_of_appearances: yup.string().optional(),
    month: yup.string().required(),
    year: yup.string().required(),
  });

  const appearanceFormik = useFormik({
    initialValues: {
      tournament_title: "",
      image: null,
      number_of_appearances: "",
      month: "",
      year: "",
    },
    validationSchema: appearanceValidation,
    validateOnBlur: true,
    onSubmit: (values: any, { resetForm }) => {
      createAppearance(
        {
          token: TOKEN as string,
          body: {
            tournament_title: values.tournament_title,
            image: chosenAppearanceImage,
            number_of_appearances: values.number_of_appearances,
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
            queryClient.invalidateQueries(["getAppearances"]);
            resetForm({
              values: {
                tournament_title: "",
                image: null,
                number_of_appearances: "",
                month: "",
                year: "",
              },
            });
          },
          onError: (err: any) => notify({ type: "error", text: err?.message }),
        }
      );
    },
  });

  const [chosenAchievementId, setChosenAchievementId] = useState("");
  const [chosenAppearanceId, setChosenAppearanceId] = useState("");

  const { mutate: deleteAchievement, isLoading: isDeletingAchievement } =
    useDeleteAchievement();

  const { mutate: deleteAppearance, isLoading: isDeletingAppearance } =
    useDeleteAppearance();

  return (
    <ModalContainer>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} className="w-full md:w-[unset]">
          <div className="w-full -mt-[20px] md:-mt-[113px] md:w-[800px] lg:w-[975px] relative h-[100vh] overflow-y-scroll bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
            <div className="h-[61px] w-[100%] z-[999] sticky bg-brand-500 top-0 border border-brand-2800 border-t-transparent border-x-transparent flex justify-between items-center">
              <h3 className="text-brand-600 ml-[28px] text-[20px] leading-[30px] font-medium">
                Edit Career Progress
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
            <div className="w-full px-[20px] md:px-[61px]  flex flex-col gap-y-[25px] pt-[30px] pb-[170px]">
              <div className="w-full">
                <h3 className="text-[#343D45] text-[20px] leading-[30px] font-medium mb-[20px]">
                  Achievements & Trophies
                </h3>

                <FormikProvider value={achievementFormik}>
                  <form onSubmit={achievementFormik.handleSubmit}>
                    <div className="w-full">
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
                          <AchievementSelectDropdown
                            options={months}
                            label="Month*"
                            id="month"
                            name="month"
                            placeholder="Select Month..."
                            onChange={achievementFormik.handleChange}
                            onBlur={achievementFormik.handleBlur}
                          />
                          <ErrorMessage
                            name="month"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>

                        <div className="basis-[50%]">
                          <AchievementSelectDropdown
                            options={getYears(1980, new Date()?.getFullYear())}
                            label="Year*"
                            id="year"
                            name="year"
                            placeholder="Select Year..."
                            onChange={achievementFormik.handleChange}
                            onBlur={achievementFormik.handleBlur}
                          />
                          <ErrorMessage
                            name="year"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e?.preventDefault();
                            achievementFormik?.handleSubmit();
                          }}
                          className="bg-brand-600 h-[46px] w-[187px] mt-[40px] text-brand-500 rounded-[4px] p-[13px]"
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

                <div className="w-full bg-brand-1000 py-[34px] flex-wrap justify-center gap-x-[31px] gap-y-[20px]  px-[42px] mt-[14px] flex">
                  {isLoadingAchievements ? (
                    <SkeletonLoader />
                  ) : achievements?.results?.length === 0 ? (
                    <p>No achievement yet..</p>
                  ) : (
                    achievements?.results?.map(
                      (achievement: any, index: number) => (
                        <div
                          key={index}
                          className="w-[346px] relative h-[399px] border border-[#94AEC5] rounded-[4px] p-[24px]"
                        >
                          <div className="relative">
                            <img
                              src={achievement?.image || AchievementDummy}
                              alt="achievement dummy"
                              className="w-full h-[145px] rounded-[4px] mb-[24px]"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <h3 className="text-brand-100 mb-[10px] font-semibold text-[16px]">
                            {achievement?.title}
                          </h3>
                          <p className="text-brand-100 mb-[10px] text-[12px]">
                            {achievement?.description}
                          </p>
                          <p className="text-brand-100 mb-[19px] text-[14px]">
                            Awarded: {achievement?.month}, {achievement?.year}
                          </p>
                          <div className="absolute left-0 bottom-0 w-full h-[41px]">
                            <button
                              onClick={() => {
                                setChosenAchievementId(achievement?.id);

                                deleteAchievement(
                                  {
                                    id: achievement?.id,
                                    token: TOKEN as string,
                                  },
                                  {
                                    onSuccess: () => {
                                      queryClient.invalidateQueries([
                                        "getAchievements",
                                      ]);
                                    },
                                  }
                                );
                              }}
                              className="bg-brand-600 text-brand-500 h-full w-full"
                            >
                              {isDeletingAchievement &&
                              chosenAchievementId === achievement?.id ? (
                                <BeatLoader
                                  color={"white"}
                                  size={10}
                                  aria-label="Loading Spinner"
                                  data-testid="loader"
                                />
                              ) : (
                                "Remove"
                              )}
                            </button>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>

              <div className="w-full">
                <h3 className="text-[#343D45] text-[20px] leading-[30px] font-medium mb-[20px]">
                  Appearances
                </h3>

                <FormikProvider value={appearanceFormik}>
                  <form onSubmit={appearanceFormik.handleSubmit}>
                    <div className="w-full">
                      <div className="flex gap-[20px] mb-[12px]">
                        <div className="basis-[50%]">
                          <InputBox
                            id="tournament_title"
                            placeholder="Tournament Title"
                            title="Tournament Title *"
                            onChange={appearanceFormik.handleChange}
                            value={appearanceFormik.values.tournament_title}
                            onBlur={appearanceFormik.handleBlur}
                          />
                          <ErrorMessage
                            name="tournament_title"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>
                        <div className="basis-[50%]">
                          <InputBox
                            id="image"
                            type="file"
                            accept="image/*"
                            placeholder="Appearance image"
                            title="Image *"
                            onChange={(e: any) => {
                              appearanceFormik.handleChange(e);
                              setChosenAppearanceImage(e?.target?.files[0]);
                            }}
                            value={appearanceFormik.values.image}
                            onBlur={appearanceFormik.handleBlur}
                          />
                          <ErrorMessage
                            name="image"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>
                      </div>

                      <InputBox
                        id="number_of_appearances"
                        onChange={appearanceFormik.handleChange}
                        value={appearanceFormik.values.number_of_appearances}
                        placeholder="Number of appearances"
                        onBlur={appearanceFormik.handleBlur}
                        title="Number of Appearances"
                      />

                      <div className="flex gap-[20px] mt-[12px]">
                        <div className="basis-[50%]">
                          <AchievementSelectDropdown
                            options={months}
                            label="Month*"
                            id="month"
                            name="month"
                            placeholder="Select Month..."
                            onChange={appearanceFormik.handleChange}
                            onBlur={appearanceFormik.handleBlur}
                          />
                          <ErrorMessage
                            name="month"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>

                        <div className="basis-[50%]">
                          <AchievementSelectDropdown
                            options={getYears(1980, new Date()?.getFullYear())}
                            label="Year*"
                            id="year"
                            name="year"
                            placeholder="Select Year..."
                            onChange={appearanceFormik.handleChange}
                            onBlur={appearanceFormik.handleBlur}
                          />
                          <ErrorMessage
                            name="year"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e?.preventDefault();
                            appearanceFormik?.handleSubmit();
                          }}
                          className="bg-brand-600 h-[46px] w-[187px] mt-[40px] text-brand-500 rounded-[4px] p-[13px]"
                        >
                          {isCreatingAppearance ? (
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

                <div className="w-full bg-brand-1000 py-[34px] flex-wrap justify-center gap-x-[31px] gap-y-[20px]  px-[42px] mt-[14px] flex">
                  {isLoadingAppearances ? (
                    <SkeletonLoader />
                  ) : appearances?.results?.length === 0 ? (
                    <p>No appearance yet..</p>
                  ) : (
                    appearances?.results?.map(
                      (appearance: any, index: number) => (
                        <div
                          key={index}
                          className="w-[346px] relative h-[357px] border border-[#94AEC5] bg-[#E3E2E2] rounded-[4px] p-[24px]"
                        >
                          <div className="relative">
                            <img
                              src={appearance?.image || AchievementDummy}
                              alt="appearance dummy"
                              className="w-full h-[145px] rounded-[4px] mb-[24px]"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <h3 className="text-brand-600 mb-[11px] font-semibold text-[16px]">
                            {appearance?.tournament_title}
                          </h3>
                          <div className="flex justify-between items-center">
                            <p className="text-brand-600 mb-[10px] text-[14px]">
                              <b className="font-semibold text-[32px]">
                                {appearance?.number_of_appearances}
                              </b>{" "}
                              Appearances
                            </p>
                            <p className="text-brand-600 mb-[19px] text-[14px] pt-[22px]">
                              {appearance?.month}, {appearance?.year}
                            </p>
                          </div>
                          <div className="absolute left-0 bottom-0 w-full h-[41px]">
                            <button
                              onClick={() => {
                                setChosenAppearanceId(appearance?.id);

                                deleteAppearance(
                                  {
                                    id: appearance?.id,
                                    token: TOKEN as string,
                                  },
                                  {
                                    onSuccess: () => {
                                      queryClient.invalidateQueries([
                                        "getAppearances",
                                      ]);
                                    },
                                  }
                                );
                              }}
                              className="bg-brand-600 text-brand-500 h-full w-full"
                            >
                              {isDeletingAppearance &&
                              chosenAppearanceId === appearance?.id ? (
                                <BeatLoader
                                  color={"white"}
                                  size={10}
                                  aria-label="Loading Spinner"
                                  data-testid="loader"
                                />
                              ) : (
                                "Remove"
                              )}
                            </button>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>

              <div className="w-full">
                <label className="text-brand-200 font-medium text-[18px] leading-[162%] -mb-[20px]">
                  Teams Played With
                </label>
                <FieldArray
                  name="teams"
                  render={(arrayHelpers) => (
                    <div className="w-full">
                      <div className="flex gap-[15px] w-full">
                        <input
                          placeholder={"What are the teams you’ve played with?"}
                          className="w-full h-[46px] border-2 border-brand-2850 pl-[10px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
                          id="teams"
                          onChange={(e) => setTeamInput(e?.target?.value)}
                          value={teamInput}
                        />
                        <button
                          type="button"
                          className="w-[150px] bg-brand-600 text-brand-500 rounded-[4px]"
                          onClick={() => {
                            arrayHelpers.push(teamInput);
                            setTeamInput("");
                          }}
                        >
                          Add Team
                        </button>
                      </div>

                      {formik.values.teams &&
                        formik.values.teams?.length > 0 && (
                          <div className="bg-brand-2900 mt-[8px] flex flex-wrap py-[25px] px-[28px] gap-[10px] rounded-[4px]">
                            {formik.values.teams?.map((team, index) => (
                              <div
                                key={index}
                                className="flex py-[5px] items-center px-[11px] rounded-[2px]"
                              >
                                <p
                                  className="text-[14px] text-brand-1800"
                                  id={`teams.${index}`}
                                >
                                  {team}
                                </p>
                                <p
                                  className="text-[16px] ml-[12px] cursor-pointer"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  x
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  )}
                />
                <ErrorMessage
                  name="teams"
                  component="p"
                  className="text-brand-warning text-[12px]"
                />
              </div>

              <div className="w-full">
                <label className="text-brand-200 font-medium text-[18px] leading-[162%] -mb-[20px]">
                  Special Abilities
                </label>
                <FieldArray
                  name="abilities"
                  render={(arrayHelpers) => (
                    <div>
                      <div className="flex gap-[15px]">
                        <input
                          placeholder={"What are your special abilities?"}
                          className="w-[100%] h-[46px] border-2 border-brand-2850 pl-[10px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
                          id="abilities"
                          onChange={(e) => setAbilityInput(e?.target?.value)}
                          value={abilityInput}
                        />
                        <button
                          type="button"
                          className="w-[150px] bg-brand-600 text-brand-500 rounded-[4px]"
                          onClick={() => {
                            arrayHelpers.push(abilityInput);
                            setAbilityInput("");
                          }}
                        >
                          Add Ability
                        </button>
                      </div>

                      {formik.values.abilities &&
                        formik.values.abilities?.length > 0 && (
                          <div className="bg-brand-2900 mt-[8px] flex flex-wrap py-[25px] px-[28px] gap-[10px] rounded-[4px]">
                            {formik.values.abilities?.map((ability, index) => (
                              <div
                                key={index}
                                className="flex py-[5px] items-center px-[11px] rounded-[2px]"
                              >
                                <p
                                  className="text-[14px] text-brand-1800"
                                  id={`abilities.${index}`}
                                >
                                  {ability}
                                </p>
                                <p
                                  className="text-[16px] ml-[12px] cursor-pointer"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  x
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  )}
                />
                <ErrorMessage
                  name="abilities"
                  component="p"
                  className="text-brand-warning text-[12px]"
                />
              </div>

              <div className="w-full">
                <label className="text-brand-200 font-medium text-[18px] leading-[162%] -mb-[20px]">
                  Skills
                </label>
                <FieldArray
                  name="skills"
                  render={(arrayHelpers) => (
                    <div>
                      <div className="flex gap-[15px]">
                        <input
                          placeholder={"What are your skills?"}
                          className="w-[100%] h-[46px] border-2 border-brand-2850 pl-[10px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
                          id="skills"
                          onChange={(e) => setSkillInput(e?.target?.value)}
                          value={skillInput}
                        />
                        <button
                          type="button"
                          className="w-[150px] bg-brand-600 text-brand-500 rounded-[4px]"
                          onClick={() => {
                            arrayHelpers.push(skillInput);
                            setSkillInput("");
                          }}
                        >
                          Add Skill
                        </button>
                      </div>

                      {formik.values.skills &&
                        formik.values.skills?.length > 0 && (
                          <div className="bg-brand-2900 mt-[8px] flex flex-wrap py-[25px] px-[28px] gap-[10px] rounded-[4px]">
                            {formik.values.skills?.map((skill, index) => (
                              <div
                                key={index}
                                className="flex py-[5px] items-center px-[11px] rounded-[2px]"
                              >
                                <p
                                  className="text-[14px] text-brand-1800"
                                  id={`skills.${index}`}
                                >
                                  {skill}
                                </p>
                                <p
                                  className="text-[16px] ml-[12px] cursor-pointer"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  x
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  )}
                />
                <ErrorMessage
                  name="skills"
                  component="p"
                  className="text-brand-warning text-[12px]"
                />
              </div>

              <div className="w-full">
                <label className="text-brand-200 font-medium text-[18px] leading-[162%] -mb-[20px]">
                  Training Courses
                </label>
                <FieldArray
                  name="trainings"
                  render={(arrayHelpers) => (
                    <div className="mb-[100px]">
                      <div className="flex gap-[15px]">
                        <input
                          placeholder={
                            "What are the training courses you've taken?"
                          }
                          className="w-[100%] h-[46px] border-2 border-brand-2850 pl-[10px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
                          id="courses"
                          onChange={(e) => setTrainingInput(e?.target?.value)}
                          value={trainingInput}
                        />
                        <button
                          type="button"
                          className="w-[150px] bg-brand-600 text-brand-500 rounded-[4px]"
                          onClick={() => {
                            arrayHelpers.push(trainingInput);
                            setTrainingInput("");
                          }}
                        >
                          Add Course
                        </button>
                      </div>

                      {formik.values.trainings &&
                        formik.values.trainings?.length > 0 && (
                          <div className="bg-brand-2900 mt-[8px] flex flex-wrap py-[25px] px-[28px] gap-[10px] rounded-[4px]">
                            {formik.values.trainings?.map((training, index) => (
                              <div
                                key={index}
                                className="flex py-[5px] items-center px-[11px] rounded-[2px]"
                              >
                                <p
                                  className="text-[14px] text-brand-1800"
                                  id={`trainings.${index}`}
                                >
                                  {training}
                                </p>
                                <p
                                  className="text-[16px] ml-[12px] cursor-pointer"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  x
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  )}
                />
                <ErrorMessage
                  name="trainings"
                  component="p"
                  className="text-brand-warning text-[12px]"
                />
              </div>
            </div>
            <div className="flex justify-between w-[inherit] px-[20px] md:px-[59px] h-[100px] bg-brand-500 flex justify-end pt-[25px] fixed bottom-0 border-t border-[#E3E2E2] ">
              <button
                onClick={onClose}
                className="border border-[2px] font-medium w-[159px] h-[54px] rounded-[4px] border-brand-600 text-brand-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-brand-600 text-brand-500 rounded-[4px] p-[13px] h-[54px]"
              >
                {updatingProfile ? (
                  <BeatLoader
                    color={"white"}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </FormikProvider>
    </ModalContainer>
  );
};

export default EditCareerProgress;
