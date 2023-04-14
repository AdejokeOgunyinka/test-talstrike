import dayjs from "dayjs";

export const uppercaseFirsLetter = (word: string) => {
  return word && word.charAt(0).toUpperCase() + word.slice(1);
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

export const getYears = (startYear: number) => {
  let currentYear = new Date().getFullYear();
  let years: string[] = [];
  startYear = startYear || 1980;
  while (startYear <= currentYear) {
    years.push((startYear++)?.toString());
  }
  return years;
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
