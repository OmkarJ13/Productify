import { DateTime } from "luxon";

export const getDaysPassed = (date) => {
  const today = DateTime.fromObject({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  return Math.floor(date.diff(today).as("days"));
};
