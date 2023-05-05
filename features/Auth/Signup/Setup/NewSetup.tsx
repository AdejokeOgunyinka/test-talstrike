/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import NextImage from "next/image";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
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
import { SetupIndicator } from "@/features/Auth/Signup/SignupIndicators";
import { useGetSports } from "@/api/auth";
import { getYears } from "@/libs/utils";

const Index = ({ providers }: any) => {
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

  console.log({ values: step4Formik.values });

  const SubstepController = () => {
    return (
      <div className="w-full flex gap-[20px] mt-[70px] justify-center">
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
      </div>
    );
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
          <div className="w-[100%] md:w-[309px]">
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
                      (step2Formik?.values?.sport === "" &&
                        step2Formik?.values?.position === "") ||
                      step2Formik?.values?.sport === "" ||
                      step2Formik?.values?.position === ""
                    }
                  >
                    Next
                  </button>
                </div>
              </form>
            </FormikProvider>
          </div>
          <div className="absolute right-0 top-[230px] invisible md:visible">
            <img src={specialtyBg[chosenSpecialty]} alt="specialty bg" />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="w-full h-full">
          <div className="w-full h-[450px] flex justify-center bg-brand-500 shadow shadow-[0px_0px_16px_4px_rgba(0, 0, 0, 0.08)] rounded-[8px] pt-[38px]">
            <div className="w-[80%] flex flex-col items-center">
              <h3 className="font-semibold text-[20px] leading-[30px] text-brand-600 mb-[30px]">
                Personal Information & Location
              </h3>
              <SetupIndicator active={substep} />
              {substep === 1 && (
                <div className="w-full mt-[41px]">
                  <p className="text-center font-normal text-[14px] color-[#343D45] mb-[26px]">
                    What’s your Date of Birth?
                  </p>
                  <FormikProvider value={step3Formik}>
                    <form onSubmit={step3Formik.handleSubmit}>
                      <div className="flex w-full gap-[20px]">
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
                <div className="w-full mt-[46px]">
                  <p className="text-center font-normal text-[14px] color-[#343D45] mb-[26px]">
                    Select your Gender
                  </p>{" "}
                  <FormikProvider value={step4Formik}>
                    <form onSubmit={step4Formik.handleSubmit}>
                      <div className="w-full">
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
                      <SubstepController />
                    </form>
                  </FormikProvider>
                </div>
              )}
              {substep === 3 && (
                <div className="w-full mt-[46px]">
                  <p className="text-center font-normal text-[14px] color-[#343D45] mb-[26px]">
                    Phone Number
                  </p>{" "}
                  <FormikProvider value={step5Formik}>
                    <form onSubmit={step5Formik.handleSubmit}>
                      <Inputbox
                        placeholder="Enter your Phone number..."
                        type="text"
                        name="phone_number"
                        value={step5Formik.values.phone_number}
                        onChange={step5Formik.handleChange}
                      />
                      <SubstepController />
                    </form>
                  </FormikProvider>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center w-full mt-[46px]">
            <button
              onClick={() => setStep(2)}
              className="w-[128px] h-[40px] border-[1.5px] border-brand-1650 text-brand-1650 text-[14px] rounded-[4px]"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
