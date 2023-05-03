import { useEffect, useState } from "react";
import NextImage from "next/image";
import { useRouter } from "next/router";
// import Select from 'react-select';
import * as yup from "yup";
import { ErrorMessage, FormikProvider, useFormik, FieldArray } from "formik";
import BeatLoader from "react-spinners/BeatLoader";
import styled from "styled-components";
import { Country, State, City } from "country-state-city";

import TalstrikeLogo from "@/assets/TalstrikeLogo.svg";
import notify from "@/libs/toast";
import { updateUserInfo, updateUserProfile } from "@/api/auth";
import SetupDropdown from "./dropdown";
import { getYears } from "@/libs/utils";
// import InputBox from '@/features/Profile/Modals/InputBox';

const Image = styled.img``;

const PersonalInfo = ({
  chosenPosition,
  specialties,
  clicked,
  sports,
  chosenSport,
}: {
  chosenPosition?: string;
  specialties?: any;
  clicked?: any;
  sports?: any;
  chosenSport?: string;
}) => {
  const router = useRouter();
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [valuesToBeUpdated, setValuesToBeUpdated] = useState({
    achievements: [],
    interests: [],
    abilities: [],
    skills: [],
    career_goals: [],
    trainings: "",
    date_of_birth: "",
    position: "",
    biography: "",
    years_of_experience: 1,
    sport: "",
    country: "Nigeria",
    state: "",
    city: "",
    day: "1",
    month: "Jan",
    year: "1980",
    gender: "Male",
    phone_number: "",
    country_code: "+234",
  });

  const token = localStorage?.getItem("verificationToken");

  const monthOfBirth: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const onUpdateProfile = async () => {
    try {
      setUpdatingProfile(true);
      const data = {
        gender: valuesToBeUpdated?.gender,
        phone_number: `${valuesToBeUpdated?.country_code}${valuesToBeUpdated?.phone_number}`,
        interests: valuesToBeUpdated?.interests,
        abilities: valuesToBeUpdated?.abilities,
        skills: valuesToBeUpdated?.skills,
        career_goals: valuesToBeUpdated?.achievements,
        date_of_birth: `${valuesToBeUpdated?.year}-${
          monthOfBirth[valuesToBeUpdated?.month]
        }-${valuesToBeUpdated?.day}`,
        ...(chosenPosition && { position: chosenPosition }),
        biography: "",
        years_of_experience: valuesToBeUpdated?.years_of_experience,
        sport: sports?.filter((sport: any) => sport?.name === chosenSport)[0]
          ?.id,
        location: [
          valuesToBeUpdated?.country,
          valuesToBeUpdated?.state,
          valuesToBeUpdated?.city,
        ],
      };

      const updateUser = await updateUserProfile(token as string, data);
      // No access to user ID at this point
      const updateUserRole = await updateUserInfo(
        token as string,
        {
          roles: [specialties[clicked - 1]?.toUpperCase()],
        },
        localStorage.getItem("verifiedUserID") as string
      );
      if (
        updateUser.data.success === true &&
        updateUserRole?.data?.verified === true
      ) {
        notify({
          type: "success",
          text: "Registration Successful! Please login to continue",
        });
        router.push("/login");
      } else {
        notify({
          type: "error",
          text: updateUser?.data?.body || updateUser?.data?.message?.toString(),
        });
      }
    } catch (err) {
      const { data } = (err as any)?.response;
      notify({ type: "error", text: JSON.stringify(data?.message) });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const [page, setPage] = useState(1);

  const headers = [
    "Personal Details & Location",
    "Experience, Expertise & Interests",
    "Finally, Professional Goal",
  ];

  const descriptions = [
    `Setting up your profile will only take two minutes.
  Just provide a few details and you’re good to go.`,
    `Telling us about your experience, expertise and interest will 
  help us match you better with the right prospects.`,
    `Your professional goal means a lot us and that’s why we want
    to know them so that we can always help you achieve them.`,
  ];

  const stageImgs = [
    "/personalDetailsStageIcon.svg",
    "/experienceStageIcon.svg",
    "/goalsStageIcon.svg",
  ];

  const PersonalDetails = () => {
    const personalDetailsValidationSchema = yup.object().shape({
      country: yup.string().required("*Country is required"),
      state: yup.string().required("*State is required"),
      city: yup.string().required("*City is required"),
      day: yup.string().required("*Day of birth is required"),
      month: yup.string().required("*Month of birth is required"),
      year: yup.string().required("*Year of birth is required"),
      gender: yup.string().required("*Gender is required"),
      phone_number: yup.string().required("*Phone number is required"),
      country_code: yup.number().min(5).required("*Country Code is required"),
    });

    const formik = useFormik({
      initialValues: {
        country: valuesToBeUpdated?.country,
        state: valuesToBeUpdated?.state,
        city: valuesToBeUpdated?.city,
        day: valuesToBeUpdated?.day,
        month: valuesToBeUpdated?.month,
        year: valuesToBeUpdated?.year,
        gender: valuesToBeUpdated?.gender,
        phone_number: valuesToBeUpdated?.phone_number,
        country_code: valuesToBeUpdated?.country_code,
      },
      onSubmit: (values) => {
        setValuesToBeUpdated((existingValues) => ({
          ...existingValues,
          ...values,
        }));
        setPage(2);
      },
      validateOnBlur: true,
      validationSchema: personalDetailsValidationSchema,
    });

    const countries = Country.getAllCountries()?.map((country) => {
      return {
        name: country?.name,
        code: country?.isoCode,
        phoneCode: country?.phonecode,
      };
    });
    const [chosenCountryCode, setChosenCountryCode] = useState(
      countries?.filter(
        (country) =>
          country?.name?.toLowerCase() ===
          formik?.values?.country?.toLowerCase()
      )[0]?.code
    );

    const [phoneCode, setPhoneCode] = useState("+234");
    useEffect(() => {
      setPhoneCode(
        `+${
          countries?.filter(
            (country) =>
              country?.name?.toLowerCase() ===
              formik?.values?.country?.toLowerCase()
          )[0]?.phoneCode
        }`
      );

      // eslint-disable-next-line
    }, [chosenCountryCode]);

    const [states, setStates] = useState<any>(
      State.getStatesOfCountry(chosenCountryCode)?.map((state) => {
        return { name: state?.name, code: state?.isoCode };
      })
    );

    useEffect(() => {
      setStates(
        State.getStatesOfCountry(chosenCountryCode)?.map((state) => {
          return { name: state?.name, code: state?.isoCode };
        })
      );
    }, [chosenCountryCode]);

    const [chosenStateCode, setChosenStateCode] = useState(
      states?.filter(
        (state: any) =>
          state.name?.toLowerCase() === formik?.values?.state?.toLowerCase()
      )[0]?.code
    );

    useEffect(() => {
      setChosenStateCode(states[0]?.code);
      //eslint-disable-next-line
    }, [chosenCountryCode, states]);

    const [cities, setCities] = useState<any>([]);

    useEffect(() => {
      setCities(
        City.getCitiesOfState(chosenCountryCode, chosenStateCode)?.map(
          (city) => {
            return { name: city?.name };
          }
        )
      );
    }, [chosenCountryCode, chosenStateCode]);

    return (
      <div className="w-full h-full mt-[56px]">
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <p className="text-brand-1900 font-light text-[14px] mb-[30px]">
              Location *
            </p>
            <div className="flex gap-x-[20px] w-full">
              <SetupDropdown
                label="Country"
                options={countries?.map((country) => country?.name)}
                placeholder="Country"
                id="country"
                onChange={(e) => {
                  setChosenCountryCode(
                    countries?.filter(
                      (country) => country?.name === e.target.value
                    )[0]?.code
                  );

                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.country}
              />

              <SetupDropdown
                label="State"
                options={states?.map((state: any) => state?.name)}
                placeholder="State"
                id="state"
                onChange={(e) => {
                  formik.handleChange(e);
                  setChosenStateCode(
                    states?.filter(
                      (state: any) => state.name === e.target.value
                    )[0]?.code
                  );
                }}
                onBlur={formik.handleBlur}
                value={formik.values.state}
              />

              <SetupDropdown
                label="City"
                options={cities?.map((c: any) => c?.name)}
                placeholder="City"
                id="city"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}
              />
            </div>

            <p className="text-brand-1900 font-light text-[14px] mb-[30px] mt-[30px]">
              Date of Birth *
            </p>
            <div className="flex gap-x-[20px] w-full">
              <SetupDropdown
                label="Date"
                options={[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                  "13",
                  "14",
                  "15",
                  "16",
                  "17",
                  "18",
                  "19",
                  "20",
                  "21",
                  "22",
                  "23",
                  "24",
                  "25",
                  "26",
                  "27",
                  "28",
                  "29",
                  "30",
                  "31",
                ]}
                placeholder="Day"
                id="day"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.day}
              />
              <SetupDropdown
                label="Month"
                options={[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ]}
                placeholder="Month"
                id="month"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.month}
              />
              <SetupDropdown
                label="Year"
                options={getYears(1980)}
                placeholder="Year"
                id="year"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.year}
              />
            </div>
            <div className="flex mt-[50px]">
              <SetupDropdown
                label="Gender *"
                options={["Male", "Female", "Non-binary"]}
                placeholder="Gender"
                id="gender"
                classname="-mr-[3px]"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.gender}
              />
              <NextImage
                src={"/maleFemale.svg"}
                width="83"
                height="52"
                alt="gender"
              />
            </div>

            <div className="flex mt-[50px]">
              <SetupDropdown
                label="Phone Number *"
                options={[phoneCode]}
                placeholder="Phone number"
                classname="w-[30%]"
                blueBg
                id="country_code"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.country_code}
              />
              <input
                placeholder="phone number"
                className="w-[70%] border-2 border-brand-1850 border-l-transparent -ml-[5px] pl-[10px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
                id="phone_number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone_number}
              />
            </div>
            <div>
              <ErrorMessage
                name="phone_number"
                component="p"
                className="text-brand-warning text-[12px]"
              />
            </div>
            <button
              className="w-full mt-[50px] h-[53px] bg-brand-600 text-brand-500 rounded-[4px]"
              type="submit"
              // disabled={!formik.isValid}
            >
              Next
            </button>
          </form>
        </FormikProvider>
      </div>
    );
  };

  const ExperienceDetails = () => {
    const abilitiesOptions = [
      { value: "Lacrosse", label: "Lacrosse" },
      { value: "Tennis", label: "Tennis" },
      { value: "Dancing", label: "Dancing" },
      { value: "Miming", label: "Miming" },
      { value: "Skating", label: "Skating" },
    ];

    const skillsOptions = [
      { value: "Team work", label: "Team work" },
      { value: "Quick decision making", label: "Quick decision making" },
      {
        value: "Interpersonal relationship",
        label: "Interpersonal relationship",
      },
      { value: "Communication", label: "Communication" },
    ];

    const experienceDetailsValidationSchema = yup.object().shape({
      years_of_experience: yup
        .string()
        .required("*Years of experience is required"),
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
      interests: yup
        .array()
        .of(yup.string().required("Interest cannot be empty"))
        .optional()
        .max(5, "Maximum of 5 interests are expected"),
    });

    const formik = useFormik({
      initialValues: {
        years_of_experience: valuesToBeUpdated?.years_of_experience,
        abilities: valuesToBeUpdated?.abilities,
        skills: valuesToBeUpdated?.skills,
        interests: valuesToBeUpdated?.interests,
      },
      validationSchema: experienceDetailsValidationSchema,
      validateOnBlur: true,
      onSubmit: (values) => {
        setValuesToBeUpdated((existingValues) => ({
          ...existingValues,
          ...values,
        }));
        setPage(3);
      },
    });

    const [abilityInput, setAbilityInput] = useState("");
    const [skillInput, setSkillInput] = useState("");
    const [interestInput, setInterestInput] = useState("");

    return (
      <div className="w-full h-full mt-[56px]">
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <div className="w-full relative">
              <label className="absolute -top-[40px] left-0 z-10 mb-[20px] text-brand-1900 z-10 font-light text-[14px]">
                Years of experience *
              </label>
              <input
                placeholder="Enter your years of experience"
                className="w-[100%] h-[46px] border-2 border-brand-1850 pl-[10px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
                id="years_of_experience"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.years_of_experience}
              />
            </div>
            <div>
              <ErrorMessage
                name="years_of_experience"
                component="p"
                className="text-brand-warning text-[12px]"
              />
            </div>
            <div className="w-full mt-[68px] relative">
              <label className="absolute -top-[40px] left-0 z-10 mb-[20px] text-brand-1900 z-10 font-light text-[14px]">
                Special abilities and talents *
              </label>
              <FieldArray
                name="abilities"
                render={(arrayHelpers) => (
                  <div>
                    <div className="flex gap-[15px]">
                      <input
                        placeholder="Enter a maximum of 5 talents or abilities"
                        className="w-[100%] h-[46px] border-2 border-brand-1850 pl-[10px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
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
                      formik.values.abilities.length > 0 && (
                        <div className="bg-brand-2900 mt-[8px] flex flex-wrap py-[25px] px-[28px] gap-[10px] rounded-[4px]">
                          {formik.values.abilities?.map((ability, index) => (
                            <div
                              key={index}
                              className="flex items-center py-[5px] px-[11px] rounded-[2px] bg-brand-2950"
                            >
                              <p
                                className="text-[14px] text-brand-1800"
                                id={`abilities.${index}`}
                              >
                                {ability}
                              </p>
                              <p
                                className="text-[16px] ml-[9px] cursor-pointer"
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
            </div>

            <div>
              <ErrorMessage
                name="abilities"
                component="p"
                className="text-brand-warning text-[12px]"
              />
            </div>
            <div className="w-full mt-[68px] relative">
              <label className="absolute -top-[40px] left-0 z-10 mb-[20px] text-brand-1900 z-10 font-light text-[14px]">
                Skills *
              </label>

              <FieldArray
                name="skills"
                render={(arrayHelpers) => (
                  <div>
                    <div className="flex gap-[15px]">
                      <input
                        placeholder="Enter a maximum of 5 skills"
                        className="w-[100%] h-[46px] border-2 border-brand-1850 pl-[10px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
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
                      formik.values.skills.length > 0 && (
                        <div className="bg-brand-2900 mt-[8px] flex flex-wrap py-[25px] px-[28px] gap-[10px] rounded-[4px]">
                          {formik.values.skills?.map((skill, index) => (
                            <div
                              key={index}
                              className="flex py-[5px] px-[11px] items-center rounded-[2px] bg-brand-2950"
                            >
                              <p
                                className="text-[14px] text-brand-1800"
                                id={`skills.${index}`}
                              >
                                {skill}
                              </p>
                              <p
                                className="text-[16px] ml-[9px] cursor-pointer"
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
            </div>
            <div>
              <ErrorMessage
                name="skills"
                component="p"
                className="text-brand-warning text-[12px]"
              />
            </div>
            <div className="w-full mt-[68px] relative">
              <label className="absolute -top-[40px] left-0 z-10 mb-[20px] text-brand-1900 z-10 font-light text-[14px]">
                Interests (optional)
              </label>

              <FieldArray
                name="interests"
                render={(arrayHelpers) => (
                  <div>
                    <div className="flex gap-[15px]">
                      <input
                        placeholder={`Maximum of 5 things you like as a ${specialties[
                          clicked - 1
                        ]?.toLowerCase()}`}
                        className="w-[100%] h-[46px] border-2 border-brand-1850 pl-[10px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
                        id="interests"
                        onChange={(e) => setInterestInput(e?.target?.value)}
                        value={interestInput}
                      />
                      <button
                        type="button"
                        className="w-[150px] bg-brand-600 text-brand-500 rounded-[4px]"
                        onClick={() => {
                          arrayHelpers.push(interestInput);
                          setInterestInput("");
                        }}
                      >
                        Add Interest
                      </button>
                    </div>

                    {formik.values.interests &&
                      formik.values.interests.length > 0 && (
                        <div className="bg-brand-2900 mt-[8px] flex flex-wrap py-[25px] px-[28px] gap-[10px] rounded-[4px]">
                          {formik.values.interests?.map((interest, index) => (
                            <div
                              key={index}
                              className="flex py-[5px] items-center px-[11px] rounded-[2px] bg-brand-2950"
                            >
                              <p
                                className="text-[14px] text-brand-1800"
                                id={`interests.${index}`}
                              >
                                {interest}
                              </p>
                              <p
                                className="text-[16px] ml-[9px] cursor-pointer"
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
            </div>
            <div className="mt-[68px] flex justify-between">
              <button
                className="h-[53px] rounded-[4px]"
                onClick={() => setPage(1)}
              >
                Back
              </button>
              <button
                className="w-[144px] rounded-[4px] h-[53px] bg-brand-600 text-brand-500"
                type="submit"
              >
                Next
              </button>
            </div>
          </form>
        </FormikProvider>
      </div>
    );
  };

  const ProfessionalGoal = () => {
    const achievementOptions = [
      {
        label: `To become one of the best ${chosenSport} ${
          specialties[clicked - 1]
        }(s/es) in the history of mankind`,
        value: `To become one of the best ${chosenSport} ${
          specialties[clicked - 1]
        }(s/es) in the history of mankind`,
      },
      {
        label: "To make my children proud of me",
        value: "To make my children proud of me",
      },
      {
        label: "To make my family proud of me",
        value: "To make my family proud of me",
      },
      {
        label: `To win ${chosenSport} ${specialties[clicked - 1]} of the year`,
        value: `To win ${chosenSport} ${specialties[clicked - 1]} of the year`,
      },
    ];

    const goalsValidationSchema = yup.object().shape({
      achievements: yup
        .array()
        .of(yup.string())
        .required("*Achievements are required")
        .min(1, "Minimum of 1 achievement is required")
        .max(3, "Maximum of 3 achievements are expected"),
    });

    const formik = useFormik({
      initialValues: {
        achievements: valuesToBeUpdated?.achievements,
      },
      validationSchema: goalsValidationSchema,
      validateOnBlur: true,
      onSubmit: (values) => {
        setValuesToBeUpdated((existingValues) => ({
          ...existingValues,
          ...values,
        }));
        onUpdateProfile();
      },
    });

    const [achievementInput, setAchievementInput] = useState("");

    return (
      <div className="w-full h-full mt-[56px]">
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <div className="w-full relative">
              <label className="absolute -top-[40px] left-0 z-10 mb-[20px] text-brand-1900 z-10 font-light text-[14px]">
                {`What do you aim to achieve as a/an ${specialties[
                  clicked - 1
                ]?.toLowerCase()}? *`}
              </label>

              <FieldArray
                name="achievements"
                render={(arrayHelpers) => (
                  <div>
                    <div className="flex gap-[15px]">
                      <input
                        placeholder={`Enter a maximum of 5 things you desire as a ${specialties[
                          clicked - 1
                        ]?.toLowerCase()}`}
                        className="w-[100%] h-[46px] border-2 border-brand-1850 pl-[10px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
                        id="achievements"
                        onChange={(e) => setAchievementInput(e?.target?.value)}
                        value={achievementInput}
                      />
                      <button
                        type="button"
                        className="w-[250px] bg-brand-600 text-brand-500 rounded-[4px]"
                        onClick={() => {
                          arrayHelpers.push(achievementInput);
                          setAchievementInput("");
                        }}
                      >
                        Add Goal
                      </button>
                    </div>

                    {formik.values.achievements &&
                      formik.values.achievements.length > 0 && (
                        <div className="bg-brand-2900 mt-[8px] flex flex-wrap py-[25px] px-[28px] gap-[10px] rounded-[4px]">
                          {formik.values.achievements?.map(
                            (achievement, index) => (
                              <div
                                key={index}
                                className="flex items-center py-[5px] px-[11px] rounded-[2px] bg-brand-2950"
                              >
                                <p
                                  className="text-[14px] text-brand-1800"
                                  id={`achievements.${index}`}
                                >
                                  {achievement}
                                </p>
                                <p
                                  className="text-[16px] ml-[9px] cursor-pointer"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  x
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                )}
              />
            </div>
            <div>
              <ErrorMessage
                name="achievements"
                component="p"
                className="text-brand-warning text-[12px]"
              />
            </div>
            <div className="mt-[58px] flex justify-between">
              <button
                className="h-[53px] rounded-[4px]"
                onClick={() => setPage(2)}
              >
                Back
              </button>
              <button
                className="w-[144px] rounded-[4px] h-[53px] bg-brand-600 text-brand-500"
                type="submit"
              >
                {updatingProfile ? (
                  <BeatLoader
                    color={"white"}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  "Finish"
                )}
              </button>
            </div>
          </form>
        </FormikProvider>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen lg:flex lg:justify-center bg-brand-1000 bg-[url('/profileBgImg.png')] bg-no-repeat bg-cover lg:bg-cover bg-fixed">
      <div className="w-full absolute top-[41px] lg:pl-[100px] text-center lg:text-start">
        <NextImage src={TalstrikeLogo} alt="logo" />
      </div>
      <div className="lg:flex w-full lg:gap-x-[58px]">
        <div className="mt-[186px] lg:basis-[30%] lg:ml-[90px]">
          <h1 className="font-bold text-center lg:text-left text-[24px] leading-[36px] text-brand-1700 mb-[9px]">
            Tell us a little more about you as a{" "}
            <b className="text-brand-1750 font-bold text-[24px]">
              {specialties[clicked - 1]?.toLowerCase()}
            </b>
          </h1>
          <p className="font-normal text-center lg:text-left text-brand-1800 text-[14px] lg:pr-[60px]">
            Quickly set up the essentials and basic details of your profile.
          </p>
        </div>
        <div className="mt-[82px] mb-[190px] px-[102px] py-[67px] lg:basis-[70%] bg-brand-500  mx-[50px] lg:mr-[105px] rounded-[20px] shadow shadow-[0px_7px_54px_4px_rgba(0, 0, 0, 0.08)]">
          <h2 className="text-brand-1700 text-center font-semibold leading-[36px] text-[24px] mb-[38px]">
            {headers[page - 1]}
          </h2>
          <div className="w-[100%] mb-[38px] h-[38px] flex justify-center">
            <Image src={stageImgs[page - 1]} alt="stage" />
          </div>
          <div className="h-[41px] mb-[37px] w-full"></div>
          <p className="text-brand-1800 text-[16px] text-center font-normal mb-[56px]">
            {descriptions[page - 1]}
          </p>
          {page === 1 && <PersonalDetails />}
          {page === 2 && <ExperienceDetails />}
          {page === 3 && <ProfessionalGoal />}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
