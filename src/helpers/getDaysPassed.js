import {
  HOURS_IN_DAY,
  MILISECONDS_IN_SECOND,
  MINUTES_IN_HOUR,
  SECONDS_IN_MINUTE,
} from "../constants/timeHelper";

export const getDaysPassed = (date) => {
  const difference = new Date() - new Date(date);
  const daysPassed = Math.floor(
    difference /
      MILISECONDS_IN_SECOND /
      SECONDS_IN_MINUTE /
      MINUTES_IN_HOUR /
      HOURS_IN_DAY
  );
  return daysPassed;
};
