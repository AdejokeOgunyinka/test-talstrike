/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import NextImage from "next/image";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { BeatLoader } from "react-spinners";
import CreatableSelect from "react-select/creatable";
import { ErrorMessage, FieldArray, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { City, Country, State } from "country-state-city";
import PhoneInput from "react-phone-number-input";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertIcon } from "@chakra-ui/react";

import CoachIcon from "@/assets/coachIcon.svg";
import CoachHoverIcon from "@/assets/coachHoverIcon.svg";
import CoachActiveIcon from "@/assets/coachActiveIcon.svg";
import TrainerIcon from "@/assets/trainerIcon.svg";
import TrainerHoverIcon from "@/assets/trainerHoverIcon.svg";
import TrainerActiveIcon from "@/assets/trainerActiveIcon.svg";
import PlayerIcon from "@/assets/playerIcon.svg";
import PlayerHoverIcon from "@/assets/playerHoverIcon.svg";
import PlayerActiveIcon from "@/assets/playerActiveIcon.svg";
import AgentIcon from "@/assets/agentIcon.svg";
import AgentHoverIcon from "@/assets/agentHoverIcon.svg";
import AgentActiveIcon from "@/assets/agentActiveIcon.svg";
import Dropdown, { Inputbox } from "@/components/NewSelectDropdown";
import { Option } from "@/components/ProfileModals/CreatePost";
import { SetupIndicator } from "@/features/Auth/Signup/SignupIndicators";
import { getYears } from "@/libs/utils";
import notify from "@/libs/toast";
import { updateUserInfo, updateUserProfile, useGetSports } from "@/api/auth";
import { useCreateHashtag, useGetAllHashtags } from "@/api/dashboard";

const Index = ({ providers }: any) => {
  const session = useSession();
  const router = useRouter();

  const [token, setToken] = useState<any>("");
  const [userId, setUserId] = useState("");
  const localToken = localStorage?.getItem("verificationToken");

  useEffect(() => {
    if (session?.data === null) {
      setToken(localToken);
    } else if (session) {
      setToken(session?.data?.user?.access as string);
      setUserId(session?.data?.user?.id as string);
    }
  }, [session, localToken]);

  const specialties = [
    {
      name: "Coach",
      icon: CoachIcon,
      hoverIcon: CoachHoverIcon,
      activeIcon: CoachActiveIcon,
    },
    {
      name: "Trainer",
      icon: TrainerIcon,
      hoverIcon: TrainerHoverIcon,
      activeIcon: TrainerActiveIcon,
    },
    {
      name: "Player",
      icon: PlayerIcon,
      hoverIcon: PlayerHoverIcon,
      activeIcon: PlayerActiveIcon,
    },
    {
      name: "Agent",
      icon: AgentIcon,
      hoverIcon: AgentHoverIcon,
      activeIcon: AgentActiveIcon,
    },
  ];

  const specialtyBg: Record<string, string> = {
    Coach: "/coachImage.png",
    Agent: "/agentImage.png",
    Trainer: "/trainerImage.png",
    Player: "/playerImage.png",
  };

  const [chosenSpecialty, setChosenSpecialty] = useState("");
  const [hoverSpecialty, setHoverSpecialty] = useState("");
  const [step, setStep] = useState(1);

  const { data: sports } = useGetSports();

  const [chosenSportPositions, setChosenSportPositions] = useState([]);

  const step2Validation = yup.object().shape({
    sport: yup.string().required("Sport is required."),
    position:
      chosenSpecialty === "Player"
        ? yup.string().required("Position is required.")
        : yup.string().optional(),
  });
  const step2Formik = useFormik({
    initialValues: {
      sport: "",
      position: "",
    },
    validationSchema: step2Validation,
    onSubmit: (values: any) => {
      setStep(3);
    },
  });

  useEffect(() => {
    if (step2Formik?.values?.sport) {
      setChosenSportPositions(
        sports?.results
          ?.filter(
            (sport: any) => sport?.name === step2Formik?.values?.sport
          )[0]
          ?.positions?.map((position: any) => {
            return { label: position, value: position };
          })
      );
    } else {
      setChosenSportPositions(
        sports?.results[0]?.positions?.map((position: any) => {
          return { label: position, value: position };
        })
      );
    }
  }, [sports, step2Formik?.values?.sport]);

  const [substep, setSubstep] = useState(1);

  const step3Validation = yup.object().shape({
    day: yup.string().required("Day is required."),
    month: yup.string().required("Month is required."),
    year: yup.string().required("Year is required."),
  });
  const step3Formik = useFormik({
    initialValues: {
      day: "",
      month: "",
      year: "",
    },
    validationSchema: step3Validation,
    onSubmit: (values: any) => {
      setSubstep(substep + 1);
    },
  });

  const step4Validation = yup.object().shape({
    gender: yup.string().required("Gender is required."),
  });
  const step4Formik = useFormik({
    initialValues: {
      gender: "",
    },
    validationSchema: step4Validation,
    onSubmit: (values: any) => {
      setSubstep(substep + 1);
    },
  });

  const step5Validation = yup.object().shape({
    phone_number: yup.string().required("Phone Number is required."),
  });
  const step5Formik = useFormik({
    initialValues: {
      phone_number: "",
    },
    validationSchema: step5Validation,
    onSubmit: (values: any) => {
      setSubstep(substep + 1);
    },
  });

  const step6Validation = yup.object().shape({
    country: yup.string().required("Country is required."),
    state: yup.string().required("State is required."),
    city: yup.string().required("City is required."),
  });

  const step6Formik = useFormik({
    initialValues: {
      country: "",
      state: "",
      city: "",
    },
    validationSchema: step6Validation,
    onSubmit: (values: any) => {
      setSubstep(substep + 1);
    },
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
        step6Formik?.values?.country?.toLowerCase()
    )[0]?.code
  );

  const [states, setStates] = useState<any>(
    State.getStatesOfCountry(countries[0]?.code)?.map((state) => {
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
        state.name?.toLowerCase() === step6Formik?.values?.state?.toLowerCase()
    )[0]?.code
  );

  useEffect(() => {
    setChosenStateCode(states[0]?.code);
    //eslint-disable-next-line
  }, [chosenCountryCode, states]);

  const [cities, setCities] = useState<any>([]);

  useEffect(() => {
    setCities(
      City.getCitiesOfState(chosenCountryCode, chosenStateCode)?.map((city) => {
        return { name: city?.name };
      })
    );
  }, [chosenCountryCode, chosenStateCode]);

  const SubstepController = () => {
    return (
      <div className="w-full">
        <div className="w-full flex gap-[20px] mt-[30px] md:mt-[70px] mb-[10px] justify-center">
          {substep > 1 && (
            <button
              onClick={() => setSubstep(substep - 1)}
              className="flex w-[35.85px] h-[35.85px] justify-center items-center border-[1.19px] border-brand-600 rounded-[4.78px]"
            >
              <NextImage
                src="/arrowLeft.svg"
                alt="left-arrow"
                width="10"
                height="10"
              />
            </button>
          )}
          {substep < 8 && (
            <button
              type="submit"
              className="flex w-[35.85px] h-[35.85px] justify-center items-center border-[1.19px] border-brand-600 rounded-[4.78px]"
            >
              <NextImage
                src="/arrowRight.svg"
                alt="left-arrow"
                width="10"
                height="10"
              />
            </button>
          )}
        </div>
        <div className="w-full">
          <Alert status="info" className="text-[12px]">
            <AlertIcon />
            Click one of the arrows above to either proceed or go back to the
            previous step!
          </Alert>
        </div>
      </div>
    );
  };

  const step7Validation = yup.object().shape({
    years_of_experience: yup
      .string()
      .required("Years of Experience is required."),
  });
  const step7Formik = useFormik({
    initialValues: {
      years_of_experience: "",
    },
    validationSchema: step7Validation,
    onSubmit: (values: any) => {
      setSubstep(substep + 1);
    },
  });

  const step8Validation = yup.object().shape({
    skills: yup
      .array()
      .of(yup.string().required("Skill cannot be empty"))
      .required("*Skills are required")
      .min(1, "Minimum of 1 skill is required")
      .max(5, "maximum of 5 skills are expected"),
  });

  const step8Formik = useFormik({
    initialValues: {
      skills: [],
    },
    validationSchema: step8Validation,
    onSubmit: (values: any) => {
      setSubstep(substep + 1);
    },
  });

  const [skillInput, setSkillInput] = useState("");

  const { data: hashtags } = useGetAllHashtags(token as string);
  const dropdownOfHashtags = hashtags?.results?.map((hashtag: any) => {
    return {
      value: hashtag?.id,
      label: hashtag?.hashtag,
    };
  });

  const { mutate: createHashtag, isLoading: isCreatingHashtag } =
    useCreateHashtag();

  const [value, setValue] = useState<readonly Option[]>([]);
  const queryClient = useQueryClient();

  const handleCreate = (inputValue: string) => {
    createHashtag(
      {
        body: {
          hashtag: inputValue[0] !== "#" ? `#${inputValue}` : inputValue,
        },
        token: token as string,
      },
      { onSuccess: () => queryClient.invalidateQueries(["getAllHashtags"]) }
    );
  };

  const step9Validation = yup.object().shape({
    interests: yup
      .array()
      .of(yup.string().required("Interest cannot be empty"))
      .optional()
      .max(5, "maximum of 5 interests are expected"),
  });

  const step9Formik = useFormik({
    initialValues: {
      interests: [],
    },
    validationSchema: step9Validation,
    onSubmit: (values: any) => {
      setSubstep(substep + 1);
    },
  });

  useEffect(() => {
    if (value) {
      step9Formik?.setFieldValue(
        "interests",
        value?.map((val) => val?.value)
      );
    }
    // eslint-disable-next-line
  }, [value]);

  const step10Validation = yup.object().shape({
    career_goals: yup
      .array()
      .of(yup.string().required("Goals cannot be empty"))
      .required("*Goals are required")
      .min(1, "Minimum of 1 goal is required")
      .max(3, "maximum of 3 goals are expected"),
  });

  const step10Formik = useFormik({
    initialValues: {
      career_goals: [],
    },
    validationSchema: step10Validation,
    onSubmit: (values: any) => {
      setSubstep(substep + 1);
    },
  });

  const [goalInput, setGoalInput] = useState("");

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

  const [updatingProfile, setUpdatingProfile] = useState(false);

  const onUpdateProfile = async () => {
    try {
      setUpdatingProfile(true);
      const data = {
        ...(chosenSpecialty === "Player" && {
          position: [step2Formik?.values.position],
        }),
        sport: sports?.results?.filter(
          (sport: any) =>
            sport?.name?.toLowerCase() ===
            step2Formik?.values?.sport?.toLowerCase()
        )[0]?.id,
        date_of_birth: `${step3Formik?.values?.year}-${
          monthOfBirth[step3Formik?.values?.month]
        }-${step3Formik?.values?.day}`,
        ...step4Formik.values,
        ...step5Formik.values,
        location: [
          step6Formik?.values?.country,
          step6Formik?.values?.state,
          step6Formik?.values?.city,
        ],
        ...step7Formik.values,
        ...step8Formik.values,
        ...step9Formik.values,
        ...step10Formik.values,
      };

      const updateUser = await updateUserProfile(token as string, data);
      const updateUserRole = await updateUserInfo(
        token as string,
        {
          roles: [
            chosenSpecialty === "Player"
              ? "TALENT"
              : chosenSpecialty?.toUpperCase(),
          ],
        },
        userId
          ? (userId as string)
          : (localStorage.getItem("verifiedUserID") as string)
      );

      if (
        updateUser.data.success === true &&
        updateUserRole?.data?.verified === true
      ) {
        notify({
          type: "success",
          text: "Registration Successful! Please login to continue",
        });
        signIn("credentials", {
          email: "",
          password: "",
          user: JSON.stringify(updateUser.data),
          callbackUrl: "/dashboard",
        });
      } else {
        notify({
          type: "error",
          text: updateUser?.data?.body || updateUser?.data?.message?.toString(),
        });
      }
    } catch (err) {
      const data = (err as any)?.response?.data || (err as any)?.response;
      notify({ type: "error", text: JSON.stringify(data?.message) });
    } finally {
      setUpdatingProfile(false);
    }
  };

  return (
    <div className="pt-[30px] w-full h-full lg:pt-[76px] ">
      {step === 1 && (
        <div className="w-full h-full flex flex-col items-center">
          <h3 className="text-brand-600 text-[20px] leading-[168.5%] font-bold">
            What is your specialty?
          </h3>
          <div className="flex gap-[15px] justify-center md:justify-start flex-wrap mt-[56px]">
            {specialties?.map((specialty, index) => (
              <div
                key={index}
                onClick={() => setChosenSpecialty(specialty?.name)}
                onMouseOver={() => setHoverSpecialty(specialty?.name)}
                onMouseOut={() => setHoverSpecialty("")}
                className={`cursor-pointer border-2 border-brand-600 ${
                  chosenSpecialty === specialty?.name ||
                  hoverSpecialty === specialty?.name
                    ? "bg-brand-600"
                    : "bg-brand-500"
                } w-[153px] h-[126px] flex flex-col gap-[16px] justify-center items-center rounded-[12px]`}
              >
                <NextImage
                  src={
                    hoverSpecialty === specialty?.name
                      ? specialty?.hoverIcon
                      : chosenSpecialty === specialty?.name
                      ? specialty?.activeIcon
                      : specialty?.icon
                  }
                  alt="specialty"
                />
                <p
                  className={`text-[18px] font-semibold ${
                    chosenSpecialty === specialty?.name ||
                    hoverSpecialty === specialty?.name
                      ? "text-brand-500"
                      : "text-brand-600"
                  }`}
                >
                  {specialty?.name}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            className="mt-[56px] w-[139px] h-[40px] bg-brand-600 rounded-[4px] text-brand-500 text-[14px] font-medium disabled:bg-[#E3E2E2] disabled:text-[#94AEC5]"
            disabled={chosenSpecialty === ""}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full h-full flex justify-between">
          <div className="w-[100%] lg:w-[309px]">
            <h3 className="text-[20px] text-brand-600 font-bold leading-[168.5%] mb-[30px]">
              Please select your preferred sport as a{" "}
              <b className="font-bold text-brand-1650">
                {chosenSpecialty?.toLowerCase()}
              </b>
            </h3>
            <FormikProvider value={step2Formik}>
              <form onSubmit={step2Formik.handleSubmit}>
                <div className="w-full">
                  <Dropdown
                    title="Sport"
                    placeholder="Select a sport..."
                    options={sports?.results?.map((sport: any) => {
                      return { value: sport?.name, label: sport?.name };
                    })}
                    className="auth-dropdown"
                    onChange={(val: any) =>
                      step2Formik?.setFieldValue("sport", val?.value)
                    }
                    name="sport"
                    value={{
                      value: step2Formik.values.sport,
                      label: step2Formik.values.sport,
                    }}
                  />
                  <ErrorMessage
                    name="sport"
                    component="p"
                    className="text-brand-warning text-[12px]"
                  />
                </div>

                {chosenSpecialty === "Player" && (
                  <div className="w-full mt-[24px]">
                    <Dropdown
                      title="Position"
                      placeholder="Select your position..."
                      options={chosenSportPositions}
                      className="auth-dropdown"
                      onChange={(val: any) =>
                        step2Formik?.setFieldValue("position", val?.value)
                      }
                      name="position"
                      value={{
                        value: step2Formik.values.position,
                        label: step2Formik.values.position,
                      }}
                    />
                    <ErrorMessage
                      name="position"
                      component="p"
                      className="text-brand-warning text-[12px]"
                    />
                  </div>
                )}

                <div className="flex gap-[16px] mt-[42px]">
                  <button
                    onClick={() => setStep(1)}
                    className="basis-1/2 w-[100%] border-[1.5px] border-brand-1650 h-[40px] rounded-[4px] text-brand-1650"
                  >
                    Back
                  </button>
                  <button
                    className="basis-1/2 w-[100%] h-[40px] rounded-[4px] bg-brand-600 text-brand-500 disabled:bg-[#E3E2E2] disabled:text-[#94AEC5]"
                    type="submit"
                    disabled={
                      chosenSpecialty === "Player"
                        ? (step2Formik?.values?.sport === "" &&
                            step2Formik?.values?.position === "") ||
                          step2Formik?.values?.sport === "" ||
                          step2Formik?.values?.position === ""
                        : step2Formik?.values?.sport === ""
                    }
                  >
                    Next
                  </button>
                </div>
              </form>
            </FormikProvider>
          </div>
          <div className="absolute right-0 top-[230px] invisible lg:visible">
            <img src={specialtyBg[chosenSpecialty]} alt="specialty bg" />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="w-full h-full">
          <div className="w-full py-[30px] md:pt-[40px] md:py-[51px] flex justify-center bg-brand-500 shadow shadow-[0px_0px_16px_4px_rgba(0, 0, 0, 0.08)] rounded-[8px] pt-[38px]">
            <div className="w-[80%] flex flex-col items-center">
              <h3 className="font-semibold text-[20px] leading-[30px] text-brand-600 mb-[30px] text-center">
                {substep > 4
                  ? "Professional Expertise"
                  : "Personal Information & Location"}
              </h3>
              <SetupIndicator
                active={substep > 4 ? substep - 4 : substep}
                isExperience={substep > 4}
              />
              {substep === 1 && (
                <div className="w-full md:mt-[41px]">
                  <p className="text-center font-normal text-[14px] color-[#343D45] mb-[26px]">
                    What’s your Date of Birth?
                  </p>
                  <FormikProvider value={step3Formik}>
                    <form onSubmit={step3Formik.handleSubmit}>
                      <div className="flex flex-col md:flex-row w-full gap-[20px]">
                        <div className="w-full">
                          <Dropdown
                            placeholder="Day"
                            options={Array.from(
                              { length: 31 },
                              (_, i) => i + 1
                            )?.map((val: number) => {
                              return {
                                value: val?.toString(),
                                label: val?.toString(),
                              };
                            })}
                            name="day"
                            className="auth-dropdown"
                            onChange={(val: any) =>
                              step3Formik?.setFieldValue("day", val?.value)
                            }
                            value={{
                              value: step3Formik.values.day,
                              label: step3Formik.values.day,
                            }}
                          />
                          <ErrorMessage
                            name="day"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>
                        <div className="w-full">
                          <Dropdown
                            placeholder="Month"
                            options={[
                              { value: "Jan", label: "Jan" },
                              { value: "Feb", label: "Feb" },
                              { value: "Mar", label: "Mar" },
                              { value: "Apr", label: "Apr" },
                              { value: "May", label: "May" },
                              { value: "Jun", label: "Jun" },
                              { value: "Jul", label: "Jul" },
                              { value: "Aug", label: "Aug" },
                              { value: "Sep", label: "Sep" },
                              { value: "Oct", label: "Oct" },
                              { value: "Nov", label: "Nov" },
                              { value: "Dec", label: "Dec" },
                            ]}
                            name="month"
                            className="auth-dropdown"
                            onChange={(val: any) =>
                              step3Formik?.setFieldValue("month", val?.value)
                            }
                            value={{
                              value: step3Formik.values.month,
                              label: step3Formik.values.month,
                            }}
                          />
                          <ErrorMessage
                            name="month"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>
                        <div className="w-full">
                          <Dropdown
                            placeholder="Year"
                            options={getYears(1980)?.map((year: string) => {
                              return { value: year, label: year };
                            })}
                            name="year"
                            className="auth-dropdown"
                            onChange={(val: any) =>
                              step3Formik?.setFieldValue("year", val?.value)
                            }
                            value={{
                              value: step3Formik.values.year,
                              label: step3Formik.values.year,
                            }}
                          />
                          <ErrorMessage
                            name="year"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>
                      </div>
                      <SubstepController />
                    </form>
                  </FormikProvider>
                </div>
              )}
              {substep === 2 && (
                <div className="w-full md:mt-[46px]">
                  <p className="text-center font-normal text-[14px] color-[#343D45] mb-[26px]">
                    Select your Gender
                  </p>{" "}
                  <FormikProvider value={step4Formik}>
                    <form onSubmit={step4Formik.handleSubmit}>
                      <div className="w-full flex justify-center">
                        <div className="w-[60%]">
                          <Dropdown
                            placeholder="Gender"
                            options={[
                              { value: "Male", label: "Male" },
                              { value: "Female", label: "Female" },
                            ]}
                            name="gender"
                            className="auth-dropdown"
                            onChange={(val: any) =>
                              step4Formik?.setFieldValue("gender", val?.value)
                            }
                            value={{
                              value: step4Formik.values.gender,
                              label: step4Formik.values.gender,
                            }}
                          />
                          <ErrorMessage
                            name="gender"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>
                      </div>
                      <SubstepController />
                    </form>
                  </FormikProvider>
                </div>
              )}
              {substep === 3 && (
                <div className="w-full md:mt-[46px]">
                  <p className="text-center font-normal text-[14px] color-[#343D45] mb-[26px]">
                    Phone Number
                  </p>{" "}
                  <FormikProvider value={step5Formik}>
                    <form onSubmit={step5Formik.handleSubmit}>
                      <div className="w-full flex justify-center">
                        <div className="w-[100%] md:w-[60%]">
                          <PhoneInput
                            value={step5Formik.values.phone_number}
                            onChange={(e) =>
                              step5Formik.setFieldValue("phone_number", e)
                            }
                            onBlur={step5Formik.handleBlur}
                            className="w-full h-[44px] border-[1.5px] border-brand-600"
                          />
                        </div>
                      </div>
                      <SubstepController />
                    </form>
                  </FormikProvider>
                </div>
              )}
              {substep === 4 && (
                <div className="w-full md:mt-[44px]">
                  <p className="text-center font-normal text-[14px] color-[#343D45] mb-[26px]">
                    Where do you live?
                  </p>{" "}
                  <FormikProvider value={step6Formik}>
                    <form onSubmit={step6Formik.handleSubmit}>
                      <div className="flex flex-col md:flex-row w-full gap-[20px]">
                        <div className="w-full">
                          <Dropdown
                            placeholder="Country"
                            options={countries?.map((country: any) => {
                              return {
                                value: country?.code,
                                label: country?.name,
                              };
                            })}
                            name="country"
                            className="auth-dropdown"
                            onChange={(val: any) => {
                              setChosenCountryCode(val.value);
                              step6Formik?.setFieldValue("country", val?.label);
                            }}
                            value={{
                              value: step6Formik.values.country,
                              label: step6Formik.values.country,
                            }}
                          />
                          <ErrorMessage
                            name="country"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>
                        <div className="w-full">
                          <Dropdown
                            placeholder="State"
                            options={states?.map((state: any) => {
                              return { value: state?.code, label: state?.name };
                            })}
                            name="state"
                            className="auth-dropdown"
                            onChange={(val: any) => {
                              setChosenStateCode(val?.value);
                              step6Formik?.setFieldValue("state", val?.label);
                            }}
                            value={{
                              value: step6Formik.values.state,
                              label: step6Formik.values.state,
                            }}
                          />
                          <ErrorMessage
                            name="state"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>
                        <div className="w-full">
                          <Dropdown
                            placeholder="City"
                            options={cities?.map((city: any) => {
                              return { value: city?.code, label: city?.name };
                            })}
                            name="city"
                            className="auth-dropdown"
                            onChange={(val: any) =>
                              step6Formik?.setFieldValue("city", val?.label)
                            }
                            value={{
                              value: step6Formik.values.city,
                              label: step6Formik.values.city,
                            }}
                          />
                          <ErrorMessage
                            name="year"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>
                      </div>
                      <SubstepController />
                    </form>
                  </FormikProvider>
                </div>
              )}
              {substep === 5 && (
                <div className="w-full md:mt-[46px]">
                  <p className="text-center font-normal text-[14px] color-[#343D45] mb-[26px]">
                    Years of Experience
                  </p>{" "}
                  <FormikProvider value={step7Formik}>
                    <form onSubmit={step7Formik.handleSubmit}>
                      <div className="w-full flex justify-center">
                        <div className="w-[60%]">
                          <Inputbox
                            placeholder="Number of years"
                            type="text"
                            name="years_of_experience"
                            value={step7Formik.values.years_of_experience}
                            onChange={step7Formik.handleChange}
                          />
                        </div>
                      </div>
                      <SubstepController />
                    </form>
                  </FormikProvider>
                </div>
              )}
              {substep === 6 && (
                <div className="w-full md:mt-[46px]">
                  <p className="text-center font-normal text-[14px] color-[#343D45] mb-[26px]">
                    What are your professional skills?
                  </p>{" "}
                  <FormikProvider value={step8Formik}>
                    <form onSubmit={step8Formik.handleSubmit}>
                      <FieldArray
                        name="skills"
                        render={(arrayHelpers: any) => (
                          <div className="flex flex-col items-center">
                            <div className="flex align-center w-[90%] md:w-[60%]">
                              <Inputbox
                                placeholder="Add up to 5 major skills"
                                type="text"
                                name="skill"
                                onChange={(e: any) => {
                                  setSkillInput(e?.target?.value);
                                }}
                                value={skillInput}
                              />

                              <button
                                type="button"
                                className="w-[49px] h-[44px] bg-brand-600 text-brand-500 rounded-tr-[4px] rounded-br-[4px] disabled:bg-[#E3E2E2]"
                                onClick={() => {
                                  if (skillInput?.includes(",")) {
                                    const val = skillInput?.split(",");
                                    val?.map((innerVal) =>
                                      arrayHelpers.push(innerVal?.trim())
                                    );
                                  } else {
                                    arrayHelpers.push(skillInput);
                                  }
                                  setSkillInput("");
                                }}
                                disabled={skillInput === ""}
                              >
                                Add
                              </button>
                            </div>

                            {step8Formik.values.skills &&
                              step8Formik.values.skills.length > 0 && (
                                <div className="mt-[13px] flex flex-wrap gap-[10px] rounded-[4px] w-[90%] md:w-[60%]">
                                  {step8Formik.values.skills?.map(
                                    (skill: any, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center py-[5px] px-[11px] rounded-[100px] border border-brand-600 bg-[#F8FAFB]"
                                      >
                                        <p
                                          className="text-[14px] text-brand-1800"
                                          id={`skills.${index}`}
                                        >
                                          {skill}
                                        </p>
                                        <div
                                          className="text-[16px] ml-[9px] cursor-pointer"
                                          onClick={() =>
                                            arrayHelpers.remove(index)
                                          }
                                        >
                                          <NextImage
                                            src={"/x.svg"}
                                            alt="close"
                                            width="12"
                                            height="12"
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        )}
                      />
                      <div className="w-full flex justify-center">
                        <div className="w-[90%] md:w-[60%] mt-[10px]">
                          <ErrorMessage
                            name="skills"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>
                      </div>
                      <SubstepController />
                    </form>
                  </FormikProvider>
                </div>
              )}
              {substep === 7 && (
                <div className="w-full md:mt-[46px]">
                  <p className="text-center font-normal text-[14px] color-[#343D45] mb-[26px]">
                    What interests you in your preferred sport?
                  </p>{" "}
                  <FormikProvider value={step9Formik}>
                    <form onSubmit={step9Formik.handleSubmit}>
                      <FieldArray
                        name="interests"
                        render={(arrayHelpers: any) => (
                          <div className="flex flex-col items-center">
                            <CreatableSelect
                              isClearable
                              isMulti
                              isDisabled={isCreatingHashtag}
                              isLoading={isCreatingHashtag}
                              onChange={(newValue) => {
                                setValue(newValue);
                              }}
                              onCreateOption={handleCreate}
                              options={dropdownOfHashtags}
                              value={value}
                              className="special-creatable w-[70%]"
                            />
                          </div>
                        )}
                      />
                      <div className="w-full flex justify-center">
                        <div className="w-[90%] md:w-[60%] mt-[10px]">
                          <ErrorMessage
                            name="interests"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>
                      </div>
                      <SubstepController />
                    </form>
                  </FormikProvider>
                </div>
              )}
              {substep === 8 && (
                <div className="w-full md:mt-[46px]">
                  <p className="text-center font-normal text-[14px] color-[#343D45] mb-[26px]">
                    What do you aim to achieve in your preferred sport?
                  </p>{" "}
                  <FormikProvider value={step10Formik}>
                    <form onSubmit={step10Formik.handleSubmit}>
                      <FieldArray
                        name="career_goals"
                        render={(arrayHelpers: any) => (
                          <div className="flex flex-col items-center">
                            <div className="flex align-center w-[90%] md:w-[60%]">
                              <Inputbox
                                placeholder="Add up to 3 major goals"
                                type="text"
                                name="goal"
                                onChange={(e: any) =>
                                  setGoalInput(e?.target?.value)
                                }
                                value={goalInput}
                              />

                              <button
                                type="button"
                                className="w-[49px] h-[44px] bg-brand-600 text-brand-500 rounded-tr-[4px] rounded-br-[4px] disabled:bg-[#E3E2E2]"
                                onClick={() => {
                                  if (goalInput?.includes(",")) {
                                    const val = goalInput?.split(",");
                                    val?.map((innerVal) =>
                                      arrayHelpers.push(innerVal?.trim())
                                    );
                                  } else {
                                    arrayHelpers.push(goalInput);
                                  }
                                  setGoalInput("");
                                }}
                                disabled={goalInput === ""}
                              >
                                Add
                              </button>
                            </div>

                            {step10Formik.values.career_goals &&
                              step10Formik.values.career_goals.length > 0 && (
                                <div className="mt-[13px] flex flex-col gap-[7px] w-[90%] md:w-[60%]">
                                  {step10Formik.values.career_goals?.map(
                                    (goal: any, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center relative py-[11px] px-[16px] rounded-[2px] bg-[#F8FAFB]"
                                      >
                                        <p
                                          className="text-[14px] text-brand-1800"
                                          id={`goals.${index}`}
                                        >
                                          {goal}
                                        </p>
                                        <div
                                          className="text-[16px] ml-[9px] cursor-pointer absolute top-[4px] right-[4px]"
                                          onClick={() =>
                                            arrayHelpers.remove(index)
                                          }
                                        >
                                          <NextImage
                                            src={"/x.svg"}
                                            alt="close"
                                            width="12"
                                            height="12"
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        )}
                      />
                      <div className="w-full flex justify-center">
                        <div className="w-[90%] md:w-[60%] mt-[10px]">
                          <ErrorMessage
                            name="interests"
                            component="p"
                            className="text-brand-warning text-[12px]"
                          />
                        </div>
                      </div>
                      <SubstepController />
                    </form>
                  </FormikProvider>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center gap-[16px] w-full mt-[46px]">
            <button
              onClick={() => setStep(2)}
              className="w-[128px] h-[40px] border-[1.5px] border-brand-1650 text-brand-1650 text-[14px] rounded-[4px]"
            >
              Back
            </button>
            {substep === 8 && (
              <button
                disabled={step10Formik.values.career_goals.length === 0}
                onClick={onUpdateProfile}
                className="w-[128px] bg-brand-600 h-[40px] rounded-[4px] text-brand-500 text-[14px] disabled:bg-[#E3E2E2] disabled:text-[#94AEC5] "
              >
                {updatingProfile ? (
                  <BeatLoader
                    color={"white"}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  "Complete"
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
