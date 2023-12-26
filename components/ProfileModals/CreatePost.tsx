import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Image,
  Box,
  Input,
  useMediaQuery,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
} from "@chakra-ui/react";
import NextImage from "next/image";
import CreatableSelect from "react-select/creatable";
import { useSession } from "next-auth/react";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import styled from "styled-components";
import { useQueryClient } from "@tanstack/react-query";
import BeatLoader from "react-spinners/BeatLoader";
import BarLoader from "react-spinners/BarLoader";

import ModalContainer from "@/components/Modal";
import ProfileImg from "@/assets/profileIcon.svg";
import { useTypedSelector } from "@/hooks/hooks";
import { TextBox } from "./InputBox";
import ChooseMedia from "./ChooseMedia";
import notify from "@/libs/toast";
import {
  useCreateHashtag,
  useCreatePost,
  useGetAllHashtags,
} from "@/api/dashboard";
import { handleOnError } from "@/libs/utils";
import CreatePostImgIcon from "@/assets/svgFiles/CreatePostImg.svg.next";
import CreatePostVidIcon from "@/assets/svgFiles/CreatePostVid.svg.next";
import CreatePostCamIcon from "@/assets/svgFiles/CreatePostCam.svg.next";
import AddMediaIcon from "@/assets/svgFiles/AddMedia.svg.next";
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
} from "@heroicons/react/24/solid";
import ArrowBackMobileIcon from "@/assets/svgFiles/ArrowBackMobile.svg.next";
import MobileDrawerHeaderIcon from "@/assets/svgFiles/MobileDrawerHeader.svg.next";
import DeleteMediaIcon from "@/assets/svgFiles/DeleteMedia.svg.next";

export interface Option {
  readonly label: string;
  readonly value: string;
}

const CreatePost = ({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  const { data: session } = useSession();
  const { userInfo } = useTypedSelector((state) => state.profile);

  const TOKEN = session?.user?.access;

  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [selectedMediaUrls, setSelectedMediaUrls] = useState<string[]>([]);

  const createPostValidationSchema = yup.object().shape({
    description: yup.string().required("Description is required"),
  });

  const { mutate: createPost, isLoading: isCreatingPost } = useCreatePost();
  const queryClient = useQueryClient();

  const { data: hashtags } = useGetAllHashtags(TOKEN as string);
  const dropdownOfHashtags = hashtags?.results?.map((hashtag: any) => {
    return {
      value: hashtag?.id,
      label: hashtag?.hashtag,
    };
  });

  const { mutate: createHashtag, isLoading: isCreatingHashtag } =
    useCreateHashtag();

  const [value, setValue] = useState<readonly Option[]>([]);

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

  const formik = useFormik({
    initialValues: {
      description: "",
      hashtags: [],
    },
    validationSchema: createPostValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const initialBody: Record<string, any> = {
        body: values?.description,
      };

      const body = new FormData();

      for (let key in initialBody) {
        body.append(key, initialBody[key]);
      }

      if (selectedMedia.length > 0) {
        for (let i = 0; i < selectedMedia.length; i++) {
          body.append(`media[${i}]`, selectedMedia[i]);
        }
      }

      body.append("hashtags", JSON.stringify(values.hashtags));

      createPost(
        { token: TOKEN as string, body },
        {
          onSuccess: () => {
            notify({
              type: "success",
              text: "Post has been successfully created",
            });
            queryClient.invalidateQueries(["getMyPostsByType"]);
            queryClient.invalidateQueries(["getNewsfeed"]);
            queryClient.invalidateQueries(["getMyPosts"]);
            resetForm({});
            setSelectedMedia([]);
            setSelectedMediaUrls([]);
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

  useEffect(() => {
    if (value) {
      formik?.setFieldValue(
        "hashtags",
        value?.map((val: any) => val?.value)
      );
    }
    // eslint-disable-next-line
  }, [value]);

  const [currImgIndex, setCurrImgIndex] = useState(0);
  const [deleteElement, setDeleteElement] = useState(false);
  const [isLessThan769] = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (deleteElement) {
      setSelectedMedia(
        selectedMedia?.filter((media) => media !== selectedMedia[currImgIndex])
      );
      setSelectedMediaUrls(
        selectedMediaUrls?.filter(
          (url) => url !== selectedMediaUrls[currImgIndex]
        )
      );
      setDeleteElement(false);
    }
  }, [deleteElement, selectedMedia, selectedMediaUrls]);

  return (
    <>
      {isLessThan769 ? (
        <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
          <DrawerOverlay />

          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <DrawerContent fontFamily="PolySans" borderTopRadius="8px">
                <Flex w="full" justify="center" pt="24px">
                  <MobileDrawerHeaderIcon />
                </Flex>
                <DrawerHeader display="flex" justifyContent="center">
                  <ArrowBackMobileIcon
                    onClick={onClose}
                    style={{ position: "absolute", left: "19px" }}
                  />
                  <Text fontSize="22px" fontWeight="600" color="#293137">
                    Create Post
                  </Text>
                </DrawerHeader>
                <DrawerBody overflowY="scroll" padding="12px 21px">
                  <Flex align="center">
                    <Image
                      src={
                        userInfo?.profile?.user?.image !== null
                          ? userInfo?.profile?.user?.image
                          : ProfileImg
                      }
                      alt="profile"
                      mr="8.16px"
                      boxSize="56px"
                      borderRadius="56px"
                    />
                  </Flex>

                  <Box mt="33px">
                    <Box>
                      <div className="w-full -ml-[20px] -mt-[30px]">
                        <TextBox
                          title=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                          id="description"
                          placeholder="Express your thoughts"
                          withoutBorder
                        />
                      </div>
                      <ErrorMessage
                        name="description"
                        component="p"
                        className="text-brand-warning text-[12px] pb-[12px]"
                      />
                    </Box>
                  </Box>

                  {selectedMediaUrls?.length > 0 ? (
                    <Flex w="full" h="347px" pos="relative" cursor="pointer">
                      {currImgIndex > 0 && (
                        <Flex
                          h="full"
                          align="center"
                          pos="absolute"
                          left="0"
                          onClick={() => setCurrImgIndex(currImgIndex - 1)}
                        >
                          <Flex
                            w="40px"
                            bg="#f1f1f1"
                            h="100px"
                            align="center"
                            justify="center"
                          >
                            <ArrowSmallLeftIcon width="20px" height="20px" />
                          </Flex>
                        </Flex>
                      )}
                      {selectedMediaUrls?.map((mediaUrl, index) => (
                        <Flex
                          w="full"
                          h="full"
                          display={
                            currImgIndex === index ? "inline-flex" : "none"
                          }
                          key={index}
                        >
                          <Box pos="absolute" top="10px" right="12px">
                            <DeleteMediaIcon />
                          </Box>
                          <Image
                            w="full"
                            h="full"
                            src={mediaUrl}
                            objectFit="cover"
                          />
                        </Flex>
                      ))}
                      {currImgIndex < selectedMediaUrls?.length - 1 && (
                        <Flex
                          h="full"
                          align="center"
                          pos="absolute"
                          right="0"
                          cursor="pointer"
                        >
                          <Flex
                            w="40px"
                            bg="#f1f1f1"
                            h="100px"
                            align="center"
                            justify="center"
                            onClick={() => setCurrImgIndex(currImgIndex + 1)}
                          >
                            <ArrowSmallRightIcon width="20px" height="20px" />
                          </Flex>
                        </Flex>
                      )}
                    </Flex>
                  ) : (
                    <Flex
                      w="full"
                      h="229px"
                      direction="column"
                      borderRadius="8px"
                      border="1px solid #CDCDCD"
                      justify="center"
                      align="center"
                      mb="29px"
                      cursor="pointer"
                      className="relative"
                      onClick={() =>
                        document.getElementById("media-file-input")?.click()
                      }
                    >
                      <AddMediaIcon />
                      <Text
                        mt="41px"
                        fontSize="18px"
                        fontWeight="600"
                        color="#293137"
                      >
                        Add Media
                      </Text>
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        width="100%"
                        height="100%"
                        pos="absolute"
                        className="invisible"
                        multiple
                        id="media-file-input"
                        onChange={(e) => {
                          const fileList = e.target.files;
                          if (fileList) {
                            const fileSizesArray = Array.from(fileList)?.map(
                              (file: File) => file.size
                            );
                            const totalFileSizes = fileSizesArray?.reduce(
                              (a: any, b: any) => a + b
                            );

                            if (totalFileSizes < 10485760) {
                              setSelectedMedia([...Array.from(fileList)]);
                              setSelectedMediaUrls(
                                Array.from(fileList)?.map((file: File) =>
                                  URL.createObjectURL(file)
                                )
                              );
                            } else {
                              notify({
                                type: "error",
                                text: "Total media size should not exceed 10MB",
                              });
                            }
                          }
                        }}
                      />
                    </Flex>
                  )}
                  {formik.values.hashtags.length > 0 && (
                    <Text
                      mb="16px"
                      color="#0074D9"
                      fontSize="18px"
                      fontWeight="600"
                      lineHeight="163.5%"
                    >
                      Add Hashtag
                    </Text>
                  )}
                  <CreatableSelect
                    isClearable
                    isMulti
                    isDisabled={isCreatingHashtag}
                    isLoading={isCreatingHashtag}
                    onChange={(newValue) => setValue(newValue)}
                    onCreateOption={handleCreate}
                    options={dropdownOfHashtags}
                    value={value}
                    className="creatable-select-talstrike"
                    placeholder="Add Hashtags"
                  />
                </DrawerBody>
                <DrawerFooter
                  paddingBottom="80px"
                  display="flex"
                  justifyContent="space-between"
                  borderTop="1px solid #CDCDCD"
                >
                  <Flex gap="19px" align="center">
                    <CreatePostImgIcon />
                    <CreatePostVidIcon />
                    <CreatePostCamIcon />
                  </Flex>
                  <Button
                    w="100px"
                    h="38.139px"
                    bg="#00B127"
                    color="#fff"
                    onClick={() => formik.handleSubmit()}
                    disabled={formik.values.description?.length === 0}
                    isLoading={isCreatingPost}
                  >
                    Publish
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
                maxW={{ base: "90%", lg: "751px" }}
                minH={{ base: "90%", lg: "80%", xl: "759px" }}
                maxH={{ base: "90%", lg: "759px" }}
                fontFamily="PolySans"
              >
                <ModalHeader borderBottom="1px solid #CDCDCD">
                  <Text fontSize="22px" fontWeight="600" color="#293137">
                    Create Post
                  </Text>
                  <ModalCloseButton bg="unset" />
                </ModalHeader>
                <ModalBody p="23px 26px" overflowY="scroll">
                  <Flex align="center">
                    <Image
                      src={
                        userInfo?.profile?.user?.image !== null
                          ? userInfo?.profile?.user?.image
                          : ProfileImg
                      }
                      alt="profile"
                      mr="8.16px"
                      boxSize="56px"
                      borderRadius="56px"
                    />
                    <Box>
                      <Text fontSize="20px" fontWeight="600" color="#293137">
                        {session?.user?.firstname} {session?.user?.lastname}
                      </Text>
                      <Text color="#93A3B1" fontSize="16px" fontWeight="400">
                        {userInfo?.profile?.position}
                      </Text>
                    </Box>
                  </Flex>

                  <Box mt="29.83px">
                    <Box>
                      <div className="w-full -ml-[20px] -mt-[30px]">
                        <TextBox
                          title=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                          id="description"
                          placeholder="Express your thoughts"
                          withoutBorder
                        />
                      </div>
                      <ErrorMessage
                        name="description"
                        component="p"
                        className="text-brand-warning text-[12px] pb-[12px]"
                      />
                    </Box>
                  </Box>

                  {selectedMediaUrls?.length > 0 ? (
                    <Flex w="full" h="347px" pos="relative" cursor="pointer">
                      {currImgIndex > 0 && (
                        <Flex
                          h="full"
                          align="center"
                          pos="absolute"
                          left="0"
                          onClick={() => setCurrImgIndex(currImgIndex - 1)}
                        >
                          <Flex
                            w="40px"
                            bg="#f1f1f1"
                            h="100px"
                            align="center"
                            justify="center"
                          >
                            <ArrowSmallLeftIcon width="20px" height="20px" />
                          </Flex>
                        </Flex>
                      )}
                      {selectedMediaUrls?.map((mediaUrl, index) => (
                        <Flex
                          w="full"
                          h="full"
                          display={
                            currImgIndex === index ? "inline-flex" : "none"
                          }
                          pos="relative"
                          key={index}
                        >
                          <Box
                            pos="absolute"
                            top="14px"
                            right="15px"
                            onClick={() => setDeleteElement(true)}
                          >
                            <DeleteMediaIcon />
                          </Box>
                          <Image
                            w="full"
                            h="full"
                            src={mediaUrl}
                            objectFit="cover"
                          />
                        </Flex>
                      ))}
                      {currImgIndex < selectedMediaUrls?.length - 1 && (
                        <Flex
                          h="full"
                          align="center"
                          pos="absolute"
                          right="0"
                          cursor="pointer"
                        >
                          <Flex
                            w="40px"
                            bg="#f1f1f1"
                            h="100px"
                            align="center"
                            justify="center"
                            onClick={() => setCurrImgIndex(currImgIndex + 1)}
                          >
                            <ArrowSmallRightIcon width="20px" height="20px" />
                          </Flex>
                        </Flex>
                      )}
                    </Flex>
                  ) : (
                    <Flex
                      w="full"
                      h="300px"
                      direction="column"
                      borderRadius="8px"
                      border="1px solid #CDCDCD"
                      justify="center"
                      align="center"
                      mb="29px"
                      cursor="pointer"
                      className="relative"
                      onClick={() =>
                        document.getElementById("media-file-input")?.click()
                      }
                    >
                      <AddMediaIcon />
                      <Text
                        mt="41px"
                        fontSize="22px"
                        fontWeight="600"
                        color="#293137"
                      >
                        Add Media
                      </Text>
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        width="100%"
                        height="100%"
                        pos="absolute"
                        className="invisible"
                        multiple
                        id="media-file-input"
                        onChange={(e) => {
                          const fileList = e.target.files;
                          if (fileList) {
                            const fileSizesArray = Array.from(fileList)?.map(
                              (file: File) => file.size
                            );
                            const totalFileSizes = fileSizesArray?.reduce(
                              (a: any, b: any) => a + b
                            );

                            if (totalFileSizes < 10485760) {
                              setSelectedMedia([...Array.from(fileList)]);
                              setSelectedMediaUrls(
                                Array.from(fileList)?.map((file: File) =>
                                  URL.createObjectURL(file)
                                )
                              );
                            } else {
                              notify({
                                type: "error",
                                text: "Total media size should not exceed 10MB",
                              });
                            }
                          }
                        }}
                      />
                    </Flex>
                  )}
                  {formik.values.hashtags.length > 0 && (
                    <Text
                      mb="16px"
                      color="#0074D9"
                      fontSize="18px"
                      fontWeight="600"
                      lineHeight="163.5%"
                    >
                      Add Hashtag
                    </Text>
                  )}
                  <CreatableSelect
                    isClearable
                    isMulti
                    isDisabled={isCreatingHashtag}
                    isLoading={isCreatingHashtag}
                    onChange={(newValue) => setValue(newValue)}
                    onCreateOption={handleCreate}
                    options={dropdownOfHashtags}
                    value={value}
                    className="creatable-select-talstrike"
                    placeholder="Add Hashtags"
                  />
                </ModalBody>

                <ModalFooter
                  borderTop="1px solid #CDCDCD"
                  display="flex"
                  justifyContent="space-between"
                >
                  <Flex gap="24px">
                    <Flex gap="8px" alignItems="center">
                      <CreatePostImgIcon />
                      <Text fontSize="20px" fontWeight="600" color="#293137">
                        Image
                      </Text>
                    </Flex>
                    <Flex gap="8px" alignItems="center">
                      <CreatePostVidIcon />
                      <Text fontSize="20px" fontWeight="600" color="#293137">
                        Video
                      </Text>
                    </Flex>
                    <Flex gap="8px" alignItems="center">
                      <CreatePostCamIcon />
                      <Text fontSize="20px" fontWeight="600" color="#293137">
                        Camera
                      </Text>
                    </Flex>
                  </Flex>
                  <Button
                    w="133px"
                    h="48.688px"
                    bg="#00B127"
                    color="#fff"
                    onClick={() => formik.handleSubmit()}
                    disabled={formik.values.description?.length === 0}
                    isLoading={isCreatingPost}
                  >
                    Publish
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

export default CreatePost;
