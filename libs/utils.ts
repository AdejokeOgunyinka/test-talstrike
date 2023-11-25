import dayjs from "dayjs";
import config from "./config";

export const uppercaseFirsLetter = (word: string) => {
  return word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase();
};

export const formatDate = (date: string) => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const formatDateToMonth = (date: string) => {
  return dayjs(date).format("yyyy-MM");
};

export const formatDateByMonth = (date: string) => {
  return dayjs(date).format("MMMM YYYY");
};

export const isActivePath = (
  sidebarLink: string,
  currentPath: string
): boolean => {
  return sidebarLink === currentPath;
};

export const getYears = (startYear?: number, endYear?: number) => {
  let currentYear = endYear || new Date().getFullYear() - 17;
  let years: string[] = [];
  startYear = startYear || 1980;
  while (startYear <= currentYear) {
    years.push((startYear++)?.toString());
  }
  years = years?.sort((a, b) => parseInt(b) - parseInt(a));
  return years;
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


export const mimes = {
  "image/apng": "IMAGE",
  "image/avif" :"IMAGE",
  "image/gif": "IMAGE",
"image/jpeg": "IMAGE",
"image/png": "IMAGE",
"image/svg+xml": "IMAGE",
"image/webp": "IMAGE",
"audio/wave": "AUDIO",
"audio/wav": "AUDIO",
"audio/mp4": "AUDIO", 
"audio/mp3": "AUDIO",
"audio/aac": "AUDIO",
"audio/ogg": "AUDIO",
"audio/mpeg": "AUDIO",
"video/mp4" : "VIDEO",
"video/ogg": "VIDEO",
"video/webm": "VIDEO",
"video/x-m4v": "VIDEO",
"video/quicktime": "VIDEO"
}

export const userTypeIcon: Record<string, any> = {
  talent: { img: "/playerProfileIcon.svg", name: "Player" },
  coach: { img: "/coachProfileIcon.svg", name: "Coach" },
  agent: { img: "/agentProfileIcon.svg", name: "Agent" },
  fan: { img: "/fanProfileIcon.svg", name: "Fan" },
  trainer: { img: "/trainerProfileIcon.svg", name: "Trainer" },
};


export const getFileExtension = function ({ url }: { url: string }) {
  if (url === null) {
    return "";
  }
  var index = url.lastIndexOf("/");
  if (index !== -1) {
    url = url.substring(index + 1); // Keep path without its segments
  }
  index = url.indexOf("?");
  if (index !== -1) {
    url = url.substring(0, index); // Remove query
  }
  index = url.indexOf("#");
  if (index !== -1) {
    url = url.substring(0, index); // Remove fragment
  }
  index = url.lastIndexOf(".");
  return index !== -1
    ? url.substring(index + 1) // Only keep file extension
    : ""; // No extension found
};

export function isImgUrl({ url }: { url: string }) {
  return fetch(url, { method: "HEAD" }).then((res) => {
    return res?.headers?.get("Content-Type")?.startsWith("image");
  });
}

export const createImage = (url: any) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export function getRadianAngle(degreeValue: any) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: any, height: any, rotation: any) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImg(
  imageSrc: any,
  pixelCrop: any,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image: any = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file: any) => {
      resolve(URL.createObjectURL(file));
    }, "image/jpeg");
  });
}

export const handleOnError = (e: any) => {
  e.target.src = "/user_placeholder.svg";
};

export const handleMediaPostError = (e: any) => {
  e.target.src = "/no-image-icon.jpeg";
};

export const exportToCloudinary = async(file: string)=>{

  const url = `https://api.cloudinary.com/v1_1/dblqvlycm/upload`;
  const fd = new FormData();
  const unsignedUploadPreset = 'talstrike_chat_preset';

  fd.append('upload_preset', unsignedUploadPreset);
  fd.append('tags', 'browser_upload'); // Optional - add tags for image admin in Cloudinary
  fd.append('file', file);
  let returned_image = ""

  returned_image = await fetch(url, {
    method: 'POST',
    body: fd,
  })
    .then((response) => response.json())
    .then((data) => {
      // File uploaded successfully
      const url = data.secure_url;
      // Create a thumbnail of the uploaded image, with 150px width
      const tokens = url.split('/');
      tokens.splice(-3, 0, 'w_150,c_scale');
      const img = new Image();
      img.src = tokens.join('/');
      img.alt = data.public_id;
      return data.secure_url;
    })
    .catch((error) => {
      console.error('Error uploading the file:', error);
    });
  console.log(returned_image);
  return returned_image
}

