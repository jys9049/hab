import dayjs from "dayjs";

export const currentYearAndMonth = () => {
  return dayjs().format("YYYY-MM");
};

export const addFormat = (date: string, format: string) => {
  return dayjs(date).format(format);
};

export const addLeadingZero = (value: string) => {
  return value.padStart(2, "0");
};
