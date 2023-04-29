import NextImage from "next/image";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Country, State, City } from "country-state-city";

import ModalContainer from "@/components/Modal";
import InputBox, { TextBox } from "./InputBox";
import { useTypedSelector } from "@/hooks/hooks";
import { updateUserProfile } from "@/api/auth";
import notify from "@/libs/toast";
import BeatLoader from "react-spinners/BeatLoader";
import { useSession } from "next-auth/react";

const EditCareerProgress = ({ onClose }: { onClose: () => void }) => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const { userInfo } = useTypedSelector((state) => state.profile);

  const monthOfBirth: Record<string, string> = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };

  const countries = Country.getAllCountries()?.map((country) => {
    return {
      name: country?.name,
      code: country?.isoCode,
      phoneCode: country?.phonecode,
    };
  });

  const [phoneCode, setPhoneCode] = useState("+234");

  const formik = useFormik({
    initialValues: {
      firstname: userInfo?.profile?.user?.firstname,
      lastname: userInfo?.profile?.user?.lastname,
      country: userInfo?.profile?.location
        ? userInfo?.profile?.location[0]
        : "",
      state: userInfo?.profile?.location ? userInfo?.profile?.location[1] : "",
      city: userInfo?.profile?.location ? userInfo?.profile?.location[2] : "",
      day:
        userInfo?.profile?.date_of_birth &&
        userInfo?.profile?.date_of_birth?.split("-")[2],
      month:
        monthOfBirth[userInfo?.profile?.date_of_birth?.split("-")[1] || "01"],
      year:
        userInfo?.profile?.date_of_birth &&
        userInfo?.profile?.date_of_birth?.split("-")[0],
      gender: userInfo?.profile?.gender,
      phone_number: userInfo?.profile?.phone_number,
      country_code: phoneCode,
      biography: userInfo?.profile?.biography,
      likes: userInfo?.profile?.interests,
      years_of_experience: userInfo?.profile?.years_of_experience,
    },
    onSubmit: async (values) => {
      setUpdatingProfile(true);

      const data = {
        phone_number: values.phone_number,
        interests: values.likes,
        // date_of_birth: `${values.year}-${monthOfBirth[values.month]}-${values.day}`,
        biography: values.biography,
        years_of_experience: values.years_of_experience,
        location: [values.country, values.state, values.city],
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

  const [chosenCountryCode, setChosenCountryCode] = useState(
    countries?.filter(
      (country) =>
        country?.name?.toLowerCase() === formik?.values?.country?.toLowerCase()
    )[0]?.code
  );

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
      City.getCitiesOfState(chosenCountryCode, chosenStateCode)?.map((city) => {
        return { name: city?.name };
      })
    );
  }, [chosenCountryCode, chosenStateCode]);

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const queryClient = useQueryClient();

  const [likeInput, setLikeInput] = useState("");

  return (
    <ModalContainer>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <div className="w-[100%] lg:w-[975px] relative h-[100vh] -mt-[20px] md:-mt-[113px] overflow-y-scroll bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
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
              <h3 className="text-[#343D45] text-[20px] leading-[30px] font-medium">
                Achievements & Trophies
              </h3>
              <div className="flex gap-[20px]">
                <InputBox
                  id="title"
                  placeholder="Title of your achievement"
                  title="Title *"
                  onChange={formik.handleChange}
                  // value={formik.values.title}
                  onBlur={formik.handleBlur}
                />
                <InputBox
                  id="image"
                  type="file"
                  accept="image/*"
                  placeholder="Achievement image"
                  title="Image *"
                  onChange={formik.handleChange}
                  // value={formik.values.image}
                  onBlur={formik.handleBlur}
                />
              </div>

              <TextBox
                id="description"
                onChange={formik.handleChange}
                // value={formik.values.description as string}
                placeholder="Describe your achievement..."
                onBlur={formik.handleBlur}
                title="Description of Achievement"
              />

              <div className="flex gap-[20px]">
                <InputBox
                  id="month"
                  placeholder="Enter the month in full..."
                  title="Month of Achievement *"
                  onChange={formik.handleChange}
                  // value={formik.values.month}
                  onBlur={formik.handleBlur}
                  disabled={true}
                />
                <InputBox
                  id="year"
                  placeholder="Enter the year of your achievement"
                  title="Year of Achievement *"
                  onChange={formik.handleChange}
                  // value={formik.values.year}
                  onBlur={formik.handleBlur}
                  disabled={true}
                />

                <button
                  type="submit"
                  className="bg-brand-600 h-[52px] w-[187px] mt-[34px] text-brand-500 rounded-[4px] p-[13px]"
                >
                  Add
                </button>
              </div>

              <h3 className="text-[#343D45] text-[20px] leading-[30px] font-medium">
                Appearances
              </h3>

              <div className="flex gap-[20px]">
                <InputBox
                  id="title"
                  placeholder="Title of the tournament"
                  title="Tournament Title *"
                  onChange={formik.handleChange}
                  // value={formik.values.title}
                  onBlur={formik.handleBlur}
                />
                <InputBox
                  id="image"
                  type="file"
                  accept="image/*"
                  placeholder="Select image"
                  title="Image *"
                  onChange={formik.handleChange}
                  // value={formik.values.image}
                  onBlur={formik.handleBlur}
                />
              </div>
              <InputBox
                id="appearances"
                placeholder="Number of appearances"
                title="Number of appearances *"
                onChange={formik.handleChange}
                // value={formik.values.appearances}
                onBlur={formik.handleBlur}
              />

              <div className="flex gap-[20px]">
                <InputBox
                  id="month"
                  placeholder="Enter the month in full..."
                  title="Month of Appearance *"
                  onChange={formik.handleChange}
                  // value={formik.values.month}
                  onBlur={formik.handleBlur}
                />
                <InputBox
                  id="year"
                  placeholder="Enter the year of your appearance"
                  title="Year of Appearance *"
                  onChange={formik.handleChange}
                  // value={formik.values.year}
                  onBlur={formik.handleBlur}
                />

                <button
                  type="submit"
                  className="bg-brand-600 h-[52px] w-[187px] mt-[34px] text-brand-500 rounded-[4px] p-[13px]"
                >
                  Add
                </button>
              </div>

              <label className="text-brand-200 font-medium text-[18px] leading-[162%] -mb-[20px]">
                Teams Played With
              </label>
              <FieldArray
                name="teams"
                render={(arrayHelpers) => (
                  <div>
                    <div className="flex gap-[15px]">
                      <input
                        placeholder={"What are the teams you’ve played with?"}
                        className="w-[100%] h-[46px] border-2 border-brand-2850 pl-[10px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
                        id="teams"
                        onChange={(e) => setLikeInput(e?.target?.value)}
                        value={likeInput}
                      />
                      <button
                        type="button"
                        className="w-[150px] bg-brand-600 text-brand-500 rounded-[4px]"
                        onClick={() => {
                          arrayHelpers.push(likeInput);
                          setLikeInput("");
                        }}
                      >
                        Add Team
                      </button>
                    </div>

                    {formik.values.likes && formik.values.likes?.length > 0 && (
                      <div className="bg-brand-2900 mt-[8px] flex flex-wrap py-[25px] px-[28px] gap-[10px] rounded-[4px]">
                        {formik.values.likes?.map((like, index) => (
                          <div
                            key={index}
                            className="flex py-[5px] items-center px-[11px] rounded-[2px] bg-brand-2950"
                          >
                            <p
                              className="text-[14px] text-brand-1800"
                              id={`likes.${index}`}
                            >
                              {like}
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
                        onChange={(e) => setLikeInput(e?.target?.value)}
                        value={likeInput}
                      />
                      <button
                        type="button"
                        className="w-[150px] bg-brand-600 text-brand-500 rounded-[4px]"
                        onClick={() => {
                          arrayHelpers.push(likeInput);
                          setLikeInput("");
                        }}
                      >
                        Add Ability
                      </button>
                    </div>

                    {formik.values.likes && formik.values.likes?.length > 0 && (
                      <div className="bg-brand-2900 mt-[8px] flex flex-wrap py-[25px] px-[28px] gap-[10px] rounded-[4px]">
                        {formik.values.likes?.map((like, index) => (
                          <div
                            key={index}
                            className="flex py-[5px] items-center px-[11px] rounded-[2px] bg-brand-2950"
                          >
                            <p
                              className="text-[14px] text-brand-1800"
                              id={`likes.${index}`}
                            >
                              {like}
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
                        onChange={(e) => setLikeInput(e?.target?.value)}
                        value={likeInput}
                      />
                      <button
                        type="button"
                        className="w-[150px] bg-brand-600 text-brand-500 rounded-[4px]"
                        onClick={() => {
                          arrayHelpers.push(likeInput);
                          setLikeInput("");
                        }}
                      >
                        Add Skill
                      </button>
                    </div>

                    {formik.values.likes && formik.values.likes?.length > 0 && (
                      <div className="bg-brand-2900 mt-[8px] flex flex-wrap py-[25px] px-[28px] gap-[10px] rounded-[4px]">
                        {formik.values.likes?.map((like, index) => (
                          <div
                            key={index}
                            className="flex py-[5px] items-center px-[11px] rounded-[2px] bg-brand-2950"
                          >
                            <p
                              className="text-[14px] text-brand-1800"
                              id={`likes.${index}`}
                            >
                              {like}
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

              <label className="text-brand-200 font-medium text-[18px] leading-[162%] -mb-[20px]">
                Training Courses
              </label>
              <FieldArray
                name="courses"
                render={(arrayHelpers) => (
                  <div className="mb-[100px]">
                    <div className="flex gap-[15px]">
                      <input
                        placeholder={
                          "What are the training courses you've taken?"
                        }
                        className="w-[100%] h-[46px] border-2 border-brand-2850 pl-[10px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
                        id="courses"
                        onChange={(e) => setLikeInput(e?.target?.value)}
                        value={likeInput}
                      />
                      <button
                        type="button"
                        className="w-[150px] bg-brand-600 text-brand-500 rounded-[4px]"
                        onClick={() => {
                          arrayHelpers.push(likeInput);
                          setLikeInput("");
                        }}
                      >
                        Add Course
                      </button>
                    </div>

                    {formik.values.likes && formik.values.likes?.length > 0 && (
                      <div className="bg-brand-2900 mt-[8px] flex flex-wrap py-[25px] px-[28px] gap-[10px] rounded-[4px]">
                        {formik.values.likes?.map((like, index) => (
                          <div
                            key={index}
                            className="flex py-[5px] items-center px-[11px] rounded-[2px] bg-brand-2950"
                          >
                            <p
                              className="text-[14px] text-brand-1800"
                              id={`likes.${index}`}
                            >
                              {like}
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
            <div className="flex justify-between w-[inherit] px-[59px] h-[100px] bg-brand-500 flex justify-end pt-[25px] fixed bottom-0 border-t border-[#E3E2E2] ">
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
