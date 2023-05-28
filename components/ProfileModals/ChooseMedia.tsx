import NextImage from "next/image";
import { ChangeEvent } from "react";

const ChooseMedia = ({
  setSelectedMedia,
  setSelectedMediaUrl,
  onClose,
  fileType,
  formik,
}: {
  setSelectedMedia: any;
  setSelectedMediaUrl: any;
  onClose: () => void;
  fileType: string;
  formik: any;
}) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileUrl =
      e?.target?.files && URL.createObjectURL(e?.target?.files[0]);
    setSelectedMediaUrl(fileUrl);
    const fileVal = e?.target?.files && e?.target?.files[0];
    setSelectedMedia(fileVal);
    formik.setFieldValue("media", "yes");
    onClose();
  };

  return (
    <div className="w-[90%] lg:w-[687px] h-[220px] bg-brand-500 flex flex-col justify-center items-center relative">
      <div className="absolute right-0 top-0 cursor-pointer" onClick={onClose}>
        <NextImage
          src="/closeIcon.svg"
          className="cursor-pointer"
          alt="close"
          width="50"
          height="50"
        />
      </div>
      <label
        htmlFor="file"
        className="cursor-pointer flex flex-col gap-y-[18.25px] items-center"
      >
        <NextImage
          src={
            fileType?.toLowerCase() === "image"
              ? "/imageVector.svg"
              : "/videoVector.svg"
          }
          alt="vector"
          width="43"
          height="38"
        />
        <p className="cursor-pointer">
          Select {fileType?.toLowerCase() === "image" ? "Image" : "Video"}
        </p>
      </label>
      <input
        className="hidden h-[100%] w-full"
        type="file"
        accept={fileType?.toLowerCase() === "image" ? "image/*" : "video/*"}
        onChange={(e) => onChange(e)}
        id="file"
      />
    </div>
  );
};

export default ChooseMedia;
