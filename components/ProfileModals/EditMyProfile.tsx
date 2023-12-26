import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import PhoneInput from "react-phone-number-input";
import CreatableSelect from "react-select/creatable";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { useTypedSelector } from "@/hooks/hooks";
import { monthOfBirth } from "@/libs/utils";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useMediaQuery,
} from "@chakra-ui/react";
import { updateUserProfile } from "@/api/auth";
import notify from "@/libs/toast";
import InputBox, { TextBox } from "./InputBox";
import { useCreateHashtag, useGetAllHashtags } from "@/api/dashboard";

const EditMyProfile = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const queryClient = useQueryClient();
  const { userInfo } = useTypedSelector((state) => state.profile);

  const [phoneCode, setPhoneCode] = useState("+234");
  const [value, setValue] = useState<any>([]);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [isLessThan769] = useMediaQuery("(max-width: 768px)");

  const { mutate: createHashtag, isLoading: isCreatingHashtag } =
    useCreateHashtag();

  const { data: hashtags } = useGetAllHashtags(TOKEN as string);
  const dropdownOfHashtags = hashtags?.results?.map((hashtag: any) => {
    return {
      value: hashtag?.id,
      label: hashtag?.hashtag,
    };
  });

  const handleCreate = (inputValue: string) => {
    createHashtag(
      {
        body: {
          hashtag: !inputValue.startsWith("#") ? `#${inputValue}` : inputValue,
        },
        token: TOKEN as string,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["getAllHashtags"]);
        },
      }
    );
  };

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

  return (
    <>
      {isLessThan769 ? (
        <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
          <DrawerOverlay />

          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <DrawerContent fontFamily="PolySans">
                <DrawerHeader borderBottom="1px solid #CDCDCD">
                  <h3 className="text-brand-text ml-[28px] text-[20px] leading-[30px] font-medium">
                    Edit Personal Details
                  </h3>
                  <DrawerCloseButton />
                </DrawerHeader>
                <DrawerBody overflowY="scroll"></DrawerBody>
                <DrawerFooter>
                  <Button
                    border="1px solid #293137"
                    bg="#fff"
                    borderRadius="4px"
                    h={{ base: "50px", md: "48px" }}
                    w={{ base: "127px", md: "111px" }}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    w={{ base: "173px", md: "182px" }}
                    borderRadius="4px"
                    h="50px"
                    bg="#00B127"
                    color="#fff"
                    isLoading={updatingProfile}
                  >
                    Save Changes
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </form>
          </FormikProvider>
        </Drawer>
      ) : (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />

          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <ModalContent
                maxW={{ base: "90%", xl: "975px" }}
                minH={{ base: "90%", lg: "80%", xl: "759px" }}
                maxH={{ base: "90%", lg: "759px" }}
                fontFamily="PolySans"
              >
                <ModalHeader borderBottom="1px solid #CDCDCD">
                  <h3 className="text-brand-text ml-[28px] text-[20px] leading-[30px] font-medium">
                    Edit Personal Details
                  </h3>
                  <ModalCloseButton />
                </ModalHeader>
                <ModalBody p="32px 61px" overflowY="scroll">
                  <Flex flexDirection="column" gap="37px">
                    <InputBox
                      id="lastname"
                      placeholder="Enter your firstname"
                      title="First Name"
                      onChange={formik.handleChange}
                      value={formik.values.firstname}
                      onBlur={formik.handleBlur}
                      disabled={true}
                    />

                    <InputBox
                      id="lastname"
                      placeholder="Enter your lastname"
                      title="Last Name"
                      onChange={formik.handleChange}
                      value={formik.values.lastname}
                      onBlur={formik.handleBlur}
                      disabled={true}
                    />

                    <Box>
                      <label className="text-brand-text text-[20px]">
                        Phone Number
                      </label>

                      <Box mt="17px">
                        <PhoneInput
                          value={formik.values.phone_number}
                          onChange={(e) =>
                            formik.setFieldValue("phone_number", e)
                          }
                          onBlur={formik.handleBlur}
                          className="w-full h-[52px] border rounded-[4px] border-brand-text focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
                        />
                      </Box>
                    </Box>

                    <TextBox
                      id="biography"
                      onChange={formik.handleChange}
                      value={formik.values.biography as string}
                      placeholder="About me..."
                      onBlur={formik.handleBlur}
                      title="Intro"
                    />

                    <TextBox
                      id="career_goals"
                      onChange={formik.handleChange}
                      value={formik.values.career_goals as string}
                      placeholder="Career Goal"
                      onBlur={formik.handleBlur}
                      title="My Goal"
                    />

                    <Box>
                      <label className="text-brand-text text-[20px]">
                        My interests
                      </label>
                      <Box mt="20px">
                        <FieldArray
                          name="likes"
                          render={() => (
                            <div>
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
                            </div>
                          )}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <label className="text-brand-text text-[20px]">
                        Social Profiles
                      </label>
                      <p className="text-brand-text text-[16px] mt-[11px] mb-[17px]">
                        Please enter the url of your social profiles
                      </p>
                      <div className="flex gap-[20px] mb-[28px]">
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
                    </Box>
                  </Flex>
                </ModalBody>
                <ModalFooter
                  borderTop="1px solid #CDCDCD"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  fontSize="18px"
                  fontWeight="400"
                >
                  <Button
                    border="1px solid #293137"
                    bg="#fff"
                    borderRadius="4px"
                    h={{ base: "50px", md: "48px" }}
                    w={{ base: "127px", md: "111px" }}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    w={{ base: "173px", md: "182px" }}
                    borderRadius="4px"
                    h="50px"
                    bg="#00B127"
                    color="#fff"
                    isLoading={updatingProfile}
                  >
                    Save Changes
                  </Button>
                </ModalFooter>
              </ModalContent>
            </form>
          </FormikProvider>
        </Modal>
      )}
    </>
  );
};

export default EditMyProfile;
