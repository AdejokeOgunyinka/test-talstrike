/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import * as yup from "yup";
import Cropper from "react-easy-crop";
import BeatLoader from "react-spinners/BeatLoader";
import { useQueryClient } from "@tanstack/react-query";

import ModalContainer from "@/components/Modal";
import InputBox from "@/components/ProfileModals/InputBox";
import ProfileImg from "@/assets/profileIcon.svg";
import RotateLeftIcon from "@/assets/rotateL.svg";
import RotateRightIcon from "@/assets/rotateR.svg";
import CropIcon from "@/assets/crop.svg";
import { useTypedSelector } from "@/hooks/hooks";
import { useUpdateMyProfile, useUpdateMyProfileImage } from "@/api/profile";
import notify from "@/libs/toast";
import getCroppedImg, { handleOnError } from "@/libs/utils";

const EditProfileAndExperience = ({ onClose }: { onClose: () => void }) => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const [modal, setModal] = useState("");

  const editProfilePictureControl = [
    {
      name: "Edit",
      icon: "/editBlue.svg",
      onClick: () => setModal("edit"),
    },
    {
      name: "Change",
      icon: "/album.svg",
      onClick: () => setModal("change-profile"),
    },
    {
      name: "Delete",
      icon: "/deleteBlue.svg",
      onClick: () => setModal("delete-profile"),
    },
  ];

  const { userInfo } = useTypedSelector((state) => state.profile);

  const { mutate, isLoading: isUpdatingMyProfile } = useUpdateMyProfile();
  const { mutate: updateMyImage, isLoading: isUpdatingMyImage } =
    useUpdateMyProfileImage();

  const experienceValidationSchema = yup.object().shape({
    years_of_experience: yup
      .number()
      .min(1, "years of experience cannot be less than 1")
      .required("Please enter your years of experience"),
  });

  const queryClient = useQueryClient();

  const experienceFormik = useFormik({
    initialValues: {
      years_of_experience: userInfo?.profile?.years_of_experience,
    },
    validationSchema: experienceValidationSchema,
    onSubmit: (values: any) => {
      mutate(
        { token: TOKEN as string, data: values },
        {
          onSuccess: () => {
            notify({
              type: "success",
              text: "You have successfully updated your years of experience",
            });
            queryClient.invalidateQueries(["getMyProfile"]);
            onClose();
          },
        }
      );
    },
  });

  const imageValidationSchema = yup.object().shape({
    image: yup.mixed().required("Image is required"),
  });

  const [fileImg, setFileImg] = useState<any>(null);
  const [successfullyUpdated, setSuccessfullyUpdated] = useState(false);

  const imageFormik = useFormik({
    initialValues: {
      image:
        userInfo?.profile?.user?.image !== null
          ? userInfo?.profile?.user?.image
          : ProfileImg,
    },
    validationSchema: imageValidationSchema,
    onSubmit: (values) => {
      updateMyImage(
        {
          token: TOKEN as string,
          data: values,
          userId: session?.user?.id as string,
        },
        {
          onSuccess: () => {
            setSuccessfullyUpdated(true);
            notify({
              type: "success",
              text: "You have successfully updated your profile image",
            });
            queryClient.invalidateQueries(["getMyProfile"]);
            onClose();
          },
        }
      );
    },
  });

  const handleDeleteProfilePicture = () => {
    updateMyImage(
      {
        token: TOKEN as string,
        data: { image: "" },
        userId: session?.user?.id as string,
      },
      {
        onSuccess: () => {
          setSuccessfullyUpdated(true);
          notify({
            type: "success",
            text: "You have successfully deleted your profile image",
          });
          queryClient.invalidateQueries(["getMyProfile"]);
          onClose();
        },
      }
    );
  };

  useEffect(() => {
    if (fileImg) {
      imageFormik?.setFieldValue("image", fileImg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileImg]);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState<any>(null);

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const [isCroppingImage, setIsCroppingImage] = useState(false);

  const showCroppedImage = useCallback(async () => {
    try {
      setIsCroppingImage(true);
      const croppedImage: any = await getCroppedImg(
        userInfo?.profile?.user?.image !== null
          ? userInfo?.profile?.user?.image
          : ProfileImg,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
      setModal("cropped-image");
    } catch (e) {
      console.error(e);
    } finally {
      setIsCroppingImage(false);
    }
  }, [croppedAreaPixels, rotation]);

  const uploadCroppedImage = async () => {
    let blob = await fetch(croppedImage).then((r) => r.blob());
    const newFile = new File(
      [blob],
      `${session?.user?.firstname}-cropped-image.png`,
      {
        lastModified: new Date().getTime(),
        type: croppedImage.type,
      }
    );

    if (blob && newFile) {
      updateMyImage(
        {
          token: TOKEN as string,
          data: { image: newFile },
          userId: session?.user?.id as string,
        },
        {
          onSuccess: () => {
            setSuccessfullyUpdated(true);
            notify({
              type: "success",
              text: "You have successfully uploaded your edited profile image",
            });
            queryClient.invalidateQueries(["getMyProfile"]);
            onClose();
          },
          onError: (err: any) => {
            notify(err?.message);
          },
        }
      );
    }
  };

  return (
    <ModalContainer marginTop="md:mt-[70px]">
      {modal === "initial-edit" && (
        <div className="w-[95%] mt-[20%] md:mt-[unset] md:w-[584px] h-[462px] bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
          <div className="flex border-b border-[#E3E2E2] w-full h-[61px] justify-between items-center pl-[30px]">
            <p className="text-[20px] text-brand-600 leading-[30px]">
              Edit Profile Picture
            </p>
            <NextImage
              src="/blueCloseIcon.svg"
              alt="close"
              width="60"
              height="61"
              className="cursor-pointer"
              onClick={() => setModal("")}
            />
          </div>
          <div className="w-full h-[calc(100%-61px)] pt-[18px] px-[21px]">
            <div className="w-full h-[282px] rounded-[8px]">
              <img
                src={
                  userInfo?.profile?.user?.image !== null
                    ? userInfo?.profile?.user?.image
                    : "/profileIcon.svg"
                }
                alt="profile"
                className="object-cover w-full h-full"
                onError={handleOnError}
              />
            </div>
            <div className="mt-[42px] flex justify-between items-center px-[10px] md:px-[56px]">
              {editProfilePictureControl?.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-[9px] cursor-pointer"
                  onClick={item?.onClick}
                >
                  <NextImage
                    src={item.icon}
                    alt="icon"
                    width="17"
                    height="17"
                  />
                  <p className="text-[18px] text-brand-600 leading-[27px] font-medium">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {modal === "edit" && (
        <div className="w-[95%] md:w-[717px] h-[630px] md:h-[675px] bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
          <div className="flex border-b border-[#E3E2E2] w-full h-[61px] justify-between items-center pl-[30px]">
            <p className="text-[20px] text-brand-600 leading-[30px]">
              Edit Profile Picture
            </p>
            <NextImage
              src="/blueCloseIcon.svg"
              alt="close"
              width="60"
              height="61"
              className="cursor-pointer"
              onClick={() => setModal("")}
            />
          </div>
          <div className="w-full h-[calc(100%-230px)] md:h-[calc(100%-290px)] border-b border-[#E3E2E2] py-[18px] px-[21px]">
            <div className="w-full relative h-[350px] rounded-[8px] box-border">
              <Cropper
                cropShape="round"
                image={
                  userInfo?.profile?.user?.image !== null
                    ? userInfo?.profile?.user?.image
                    : ProfileImg
                }
                crop={crop}
                zoom={zoom}
                zoomSpeed={4}
                maxZoom={3}
                zoomWithScroll={true}
                showGrid={true}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                rotation={rotation}
                objectFit="auto-cover"
              />
            </div>
          </div>
          <div className="w-full h-full py-[20px] md:py-[31px] md:px-[38px]">
            <div className="flex gap-[30px] w-full justify-between">
              <div className="flex flex-col items-center basis-[50%]">
                <p>Zoom</p>
                <div className="flex gap-[12px]">
                  <p className="text-[40px] leading-[65px]">-</p>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={zoom}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => {
                      setZoom(parseInt(e.target.value));
                    }}
                    className="w-[50px] md:w-[unset]"
                  />
                  <p className="text-[40px] leading-[65px]">+</p>
                </div>
              </div>

              <div className="flex flex-col items-center basis-[50%]">
                <p>Straighten</p>
                <div className="flex gap-[12px]">
                  <p className="text-[40px] leading-[65px]">-</p>
                  <input
                    type="range"
                    min="-180"
                    max="0"
                    value={rotation}
                    onChange={(e) => {
                      setRotation(parseInt(e.target.value));
                    }}
                    className="w-[50px] md:w-[unset]"
                  />
                  <p className="text-[40px] leading-[65px]">+</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between px-[20px] md:px-[unset]">
              <div className="flex gap-[40px] items-center">
                <div className="flex gap-[15px]">
                  <NextImage
                    src={RotateLeftIcon}
                    width="58"
                    height="52"
                    alt="rotateL"
                    className="cursor-pointer w-[40px] h-[40px] md:w-[58px] md:h-[52px]"
                    onClick={() => {
                      if (rotation <= 0) {
                        setRotation(0);
                      } else {
                        setRotation(rotation - 25);
                      }
                    }}
                  />
                  <NextImage
                    src={RotateRightIcon}
                    width="58"
                    height="52"
                    alt="rotateR"
                    className="cursor-pointer w-[40px] h-[40px] md:w-[58px] md:h-[52px]"
                    onClick={() => {
                      if (rotation >= 180) {
                        setRotation(180);
                      } else {
                        setRotation(rotation + 25);
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={showCroppedImage}
                  disabled={isCroppingImage}
                  className="w-[150px] md:w-[174px] h-[40px] md:h-[53px] font-medium rounded-[4px] border border-[2px] border-brand-600 text-brand-500"
                >
                  {isCroppingImage ? (
                    <BeatLoader
                      color={"blue"}
                      size={10}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    <div className="flex gap-[20px]  items-center justify-center w-full h-full">
                      <NextImage
                        src={CropIcon}
                        width="28"
                        height="28"
                        alt="crop"
                      />
                      <p className="text-brand-600 font-medium text-[25px] leading-[38px]">
                        Crop
                      </p>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal === "cropped-image" && (
        <div className="w-[95%] md:w-[592px] mt-[30%] md:mt-[unset] max-h-[400px] py-[20px] flex justify-center items-center relative bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
          <img
            src={croppedImage as unknown as string}
            alt="croppedImage"
            className="pb-[100px]"
          />

          <div className="flex px-[30px] py-[25px] justify-between w-[inherit] h-[100px] px-[10px] md:px-[59px] gap-x-[10px] md:gap-x-[unset] bg-brand-500 flex justify-end absolute bottom-0 border-t border-[#E3E2E2] ">
            <button
              onClick={() => setModal("edit")}
              className="border border-[2px] font-medium w-[135px] md:w-[159px] h-[54px] rounded-[4px] border-brand-600 text-brand-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-brand-600 text-brand-500 rounded-[4px] w-[159px] p-[13px] h-[54px]"
              onClick={() => uploadCroppedImage()}
            >
              {isUpdatingMyImage ? (
                <BeatLoader
                  color={"white"}
                  size={10}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "Upload image"
              )}
            </button>
          </div>
        </div>
      )}

      {modal === "change-profile" && (
        <div className="w-[95%] md:w-[584px] h-[505px] bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
          <FormikProvider value={imageFormik}>
            <form onSubmit={imageFormik.handleSubmit} className="w-full h-full">
              <div className="flex border-b border-[#E3E2E2] w-full h-[61px] justify-between items-center pl-[30px]">
                <p className="text-[20px] text-brand-600 leading-[30px]">
                  Change Profile Picture
                </p>
                <NextImage
                  src="/blueCloseIcon.svg"
                  alt="close"
                  width="60"
                  height="61"
                  className="cursor-pointer"
                  onClick={() => setModal("initial-edit")}
                />
              </div>
              <div className="w-full h-[calc(100%-173px)] px-[20px]">
                <div className="relative w-full h-full rounded-[8px] flex items-center">
                  <img
                    src={
                      fileImg !== null
                        ? URL.createObjectURL(fileImg)
                        : imageFormik?.values?.image || ProfileImg
                    }
                    alt="profile"
                    className="object-cover w-full h-[282px]"
                  />
                  <div className="absolute w-full h-[282px] rounded-[8px] bg-brand-100 opacity-20 flex justify-center items-center">
                    <div
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => document.getElementById("file")?.click()}
                    >
                      <NextImage
                        src="/album2.svg"
                        alt="album"
                        width="49"
                        height="49"
                        className="cursor-pointer"
                      />
                      <p className="text-brand-500 mt-[25px]">Select Image</p>
                    </div>
                    <input
                      type="file"
                      className="hidden h-full w-full"
                      accept="image/*"
                      id="file"
                      onChange={(e) =>
                        e?.target?.files && setFileImg(e?.target?.files[0])
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-[24px] w-full h-[93px] mb-[19px] border border-t border-b-transparent border-[#E3E2E2]">
                <button className="border border-[2px] font-medium w-[135px] h-[41px] rounded-[4px] border-brand-600 text-brand-600">
                  {" "}
                  Edit Image
                </button>
                <button
                  type="submit"
                  className="w-[135px] h-[41px] font-medium rounded-[4px] bg-brand-600 text-brand-500"
                >
                  {isUpdatingMyImage ? (
                    <BeatLoader
                      color={"white"}
                      size={10}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </FormikProvider>
        </div>
      )}
      {modal === "delete-profile" && (
        <div className="w-[95%] md:w-[592px] mt-[30%] md:mt-[unset] h-[273px] bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
          <div className="flex border-b border-[#E3E2E2] w-full h-[61px] justify-between items-center pl-[30px]">
            <p className="text-[20px] text-brand-600 leading-[30px]">
              Delete Profile Picture
            </p>
            <NextImage
              src="/blueCloseIcon.svg"
              alt="close"
              width="60"
              height="61"
              className="cursor-pointer"
              onClick={() => setModal("initial-edit")}
            />
          </div>
          <div className="pt-[28px] px-[30px] md:px-[100px]">
            <p className="text-center text-[20px] leading-[162%] text-[#343D45]">
              Are you sure you want to delete your profile picture?
            </p>
            <div className="flex justify-center gap-[20px] mt-[34px]">
              <button
                onClick={() => setModal("initial-edit")}
                className="border border-[2px] font-medium w-[135px] h-[41px] rounded-[4px] border-brand-600 text-brand-600"
              >
                No
              </button>
              <button
                onClick={handleDeleteProfilePicture}
                className="w-[135px] h-[41px] font-medium rounded-[4px] bg-brand-600 text-brand-500"
              >
                {isUpdatingMyImage ? (
                  <BeatLoader
                    color={"white"}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  "Yes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {modal === "" && (
        <div className="w-[95%] mt-[30%] md:mt-[unset] md:w-[429px] h-[280px] bg-brand-500 rounded-[8px] shadow shadow-[0px_4px_15px_1px_rgba(0, 0, 0, 0.15)]">
          <div className="flex border-b border-[#E3E2E2] w-full h-[49px] justify-between items-center pl-[30px]">
            <p className="text-[20px] text-brand-600 leading-[30px]">
              Edit Profile
            </p>
            <NextImage
              src="/blueCloseIcon.svg"
              alt="close"
              width="60"
              height="49"
              className="cursor-pointer"
              onClick={onClose}
            />
          </div>
          <div className="flex gap-[18px] justify-center w-full h-[calc(100%-49px)] px-[30px] py-[27px]">
            <div className="relative w-[160px] h-full border-[3.82857px] border-brand-500 rounded-[9.6px] shadow shadow-[0px_0.812121px_4.87273px_0.812121px_rgba(0, 0, 0, 0.15)]">
              <img
                src={
                  userInfo?.profile?.user?.image !== null
                    ? userInfo?.profile?.user?.image
                    : "/profileIcon.svg"
                }
                alt="profile"
                className="object-cover w-full h-full"
                onError={handleOnError}
              />
              <NextImage
                src="/editCircle.svg"
                alt="edit circle"
                width="36"
                height="36"
                className="absolute bottom-0 right-[9px] cursor-pointer"
                onClick={() => setModal("initial-edit")}
              />
            </div>
            <div className="w-[217px]">
              <FormikProvider value={experienceFormik}>
                <form onSubmit={experienceFormik.handleSubmit}>
                  <InputBox
                    id="years_of_experience"
                    title="Years of Experience"
                    onChange={experienceFormik.handleChange}
                    placeholder="Enter years of experience"
                    value={experienceFormik.values.years_of_experience}
                  />
                  <ErrorMessage
                    name="years_of_experience"
                    component="p"
                    className="text-brand-warning text-[12px]"
                  />
                  <button
                    type="submit"
                    className="w-full mt-[12px] h-[41px] text-brand-500 rounded-[4px] bg-brand-600"
                  >
                    {isUpdatingMyProfile ? (
                      <BeatLoader
                        color={"white"}
                        size={10}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </form>
              </FormikProvider>
            </div>
          </div>
        </div>
      )}
    </ModalContainer>
  );
};

export default EditProfileAndExperience;
