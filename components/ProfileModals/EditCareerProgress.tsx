import NextImage from "next/image";
import { ErrorMessage, FieldArray, FormikProvider, useFormik } from "formik";
import { useState } from "react";
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
} from "@/api/profile";
import notify from "@/libs/toast";
import BeatLoader from "react-spinners/BeatLoader";
import { useSession } from "next-auth/react";

const EditCareerProgress = ({ onClose }: { onClose: () => void }) => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

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
      .required("*Trainings are required")
      .min(1, "Minimum of 1 training is required")
      .max(5, "maximum of 5 trainings are expected"),
  });

  const formik = useFormik({
    initialValues: {
      teams: userInfo?.profile?.teams,
      abilities: userInfo?.profile?.abilities,
      skills: userInfo?.profile?.skills,
      trainings: userInfo?.profile?.trainings?.split(", "),
    },
    validationSchema: careerProgressValidationSchema,
    onSubmit: async (values) => {
      setUpdatingProfile(true);

      const data = {
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

  return (
    <ModalContainer marginTop="md:mt-[30px]">
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} className="w-full md:w-[unset]">
          <div className="w-full lg:w-[975px] relative h-[90vh] overflow-y-scroll bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
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
            <div className="flex justify-between w-[inherit] px-[59px] h-[100px] bg-brand-500 flex justify-end pt-[25px] fixed bottom-[50px] border-t border-[#E3E2E2] ">
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
