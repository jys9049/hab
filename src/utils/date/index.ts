import dayjs, { Dayjs } from "dayjs";

export const currentYearAndMonth = () => {
  return dayjs().format("YYYY-MM");
};

export const formatAsIsoDate = (date: Dayjs) => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const formatAsDateTime = (date: Dayjs) => {
  return dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
};

export const addFormat = (date: string, format: string) => {
  return dayjs(date).format(format);
};

export const addLeadingZero = (value: string) => {
  return value.padStart(2, "0");
};
