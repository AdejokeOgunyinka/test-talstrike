import NextImage from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Text } from "@chakra-ui/react";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import { Country, State, City } from "country-state-city";
import PhoneInput from "react-phone-number-input";
import BeatLoader from "react-spinners/BeatLoader";
import CreatableSelect from "react-select/creatable";

import ModalContainer from "@/components/Modal";
import InputBox, { TextBox } from "./InputBox";
import { useTypedSelector } from "@/hooks/hooks";
import { updateUserProfile } from "@/api/auth";
import notify from "@/libs/toast";
import { useCreateHashtag, useGetAllHashtags } from "@/api/dashboard";

import "react-phone-number-input/style.css";

const EditProfile = ({ onClose }: { onClose: () => void }) => {
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

  const [value, setValue] = useState<any>([]);

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
      linkedin: userInfo?.profile?.socials?.linkedin,
      facebook: userInfo?.profile?.socials?.facebook,
      instagram: userInfo?.profile?.socials?.instagram,
      twitter: userInfo?.profile?.socials?.twitter,
      career_goals: userInfo?.profile?.career_goals?.join(""),
    },
    onSubmit: async (values) => {
      setUpdatingProfile(true);

      const data = {
        phone_number: values.phone_number,
        interests: value?.map((val: any) => val?.value),
        biography: values.biography,
        years_of_experience: values.years_of_experience,
        location: [values.country, values.state, values.city],
        socials: {
          linkedin: values?.linkedin,
          facebook: values?.facebook,
          instagram: values?.instagram,
          twitter: values?.twitter,
        },
        career_goals: [values?.career_goals],
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

  const { data: hashtags } = useGetAllHashtags(TOKEN as string);
  const dropdownOfHashtags = hashtags?.results?.map((hashtag: any) => {
    return {
      value: hashtag?.id,
      label: hashtag?.hashtag,
    };
  });

  const { mutate: createHashtag, isLoading: isCreatingHashtag } =
    useCreateHashtag();

  useEffect(() => {
    const initialInterests = userInfo
      ? userInfo?.profile?.interests?.map((val) => {
          const hashtagValue = dropdownOfHashtags?.filter(
            (innerVal: { value: string; label: string }) =>
              innerVal?.value === val
          )[0]?.label;
          return {
            label: hashtagValue,
            value: val,
          };
        })
      : [];

    setValue(initialInterests);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (value) {
      formik?.setFieldValue("interests", value);
    }
    // eslint-disable-next-line
  }, [value]);
  const queryClient = useQueryClient();

  const handleCreate = (inputValue: string) => {
    createHashtag(
      {
        body: {
          hashtag: inputValue[0] !== "#" ? `#${inputValue}` : inputValue,
        },
        token: TOKEN as string,
      },
      { onSuccess: () => queryClient.invalidateQueries(["getAllHashtags"]) }
    );
  };

  return (
    <ModalContainer>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <div className="w-[100%] md:w-[800px] lg:w-[975px] relative h-[100vh] -mt-[20px] md:-mt-[113px] overflow-y-scroll bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
            <div className="h-[61px] w-[100%] z-[999] sticky bg-brand-500 top-0 border border-brand-2800 border-t-transparent border-x-transparent flex justify-between items-center">
              <h3 className="text-brand-600 ml-[28px] text-[20px] leading-[30px] font-medium">
                Edit Personal Details
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
            <div className="w-full px-[20px] md:px-[61px] flex flex-col gap-y-[25px] pt-[30px] pb-[170px]">
              <InputBox
                id="lastname"
                placeholder="Enter your firstname"
                title="Firstname *"
                onChange={formik.handleChange}
                value={formik.values.firstname}
                onBlur={formik.handleBlur}
                disabled={true}
              />
              <InputBox
                id="lastname"
                placeholder="Enter your lastname"
                title="Lastname *"
                onChange={formik.handleChange}
                value={formik.values.lastname}
                onBlur={formik.handleBlur}
                disabled={true}
              />

              <div className="flex gap-x-[12px]">
                <InputBox
                  id="country"
                  placeholder="Enter your country"
                  title="Country *"
                  value={formik.values.country}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={false}
                />

                <InputBox
                  id="state"
                  placeholder="Enter your state"
                  title="State *"
                  value={formik.values.state}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={false}
                />

                <InputBox
                  id="city"
                  placeholder="Enter your city"
                  title="City *"
                  value={formik.values.city}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={false}
                />
              </div>

              <Text
                color="text"
                className="font-medium text-[18px] leading-[162%] -mb-[20px]"
              >
                Phone number *
              </Text>

              <PhoneInput
                value={formik.values.phone_number}
                onChange={(e) => formik.setFieldValue("phone_number", e)}
                onBlur={formik.handleBlur}
                className="w-full h-[46px] border-2 border-brand-1850 focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
              />

              <TextBox
                id="biography"
                onChange={formik.handleChange}
                value={formik.values.biography as string}
                placeholder="About me..."
                onBlur={formik.handleBlur}
                title="About Me *"
              />

              <TextBox
                id="career_goals"
                onChange={formik.handleChange}
                value={formik.values.career_goals as string}
                placeholder="Career Goal"
                onBlur={formik.handleBlur}
                title="My Career Goal *"
              />

              <label className="text-brand-200 font-medium text-[18px] leading-[162%] -mb-[20px]">
                My interests
              </label>
              <FieldArray
                name="likes"
                render={(arrayHelpers) => (
                  <div>
                    {/* <div className="flex gap-[15px]">
                      <input
                        placeholder={`Enter a maximum of 5 topics that are interesting to you`}
                        className="w-[100%] h-[46px] border-2 border-brand-2850 pl-[10px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
                        id="likes"
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
                        Add Interest
                      </button>
                    </div> */}

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
                      className="special-creatable"
                    />

                    {/* {formik.values.likes && formik.values.likes?.length > 0 && (
                      <div className="bg-brand-2900 mt-[8px] flex flex-wrap py-[25px] px-[28px] gap-[10px] rounded-[4px]">
                        {formik.values.likes?.map((like, index) => (
                          <div
                            key={index}
                            className="flex py-[5px] items-center px-[11px] rounded-[2px]"
                          >
                            <p
                              className="text-[14px] text-brand-1800"
                              id={`likes.${index}`}
                            >
                              {like}
                            </p>
                            <p
                              className="text-[16px] ml-[14px] cursor-pointer"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              x
                            </p>
                          </div>
                        ))}
                      </div>
                    )} */}
                  </div>
                )}
              />

              <label className="text-brand-200 font-medium text-[18px] leading-[162%] -mb-[20px]">
                Social Profiles
              </label>
              <p className="text-[#343D45]">
                Please enter the url of your social profiles
              </p>
              <div className="flex  gap-[20px]">
                <InputBox
                  id="linkedin"
                  placeholder="Linkedin url"
                  title="Linkedin"
                  value={formik.values.linkedin}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={false}
                />
                <InputBox
                  id="facebook"
                  placeholder="Facebook url"
                  title="Facebook"
                  value={formik.values.facebook}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={false}
                />
              </div>
              <div className="flex gap-[20px]">
                <InputBox
                  id="twitter"
                  placeholder="Twitter url"
                  title="Twitter"
                  value={formik.values.twitter}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={false}
                />
                <InputBox
                  id="instagram"
                  placeholder="Instagram url"
                  title="Instagram"
                  value={formik.values.instagram}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={false}
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

export default EditProfile;
