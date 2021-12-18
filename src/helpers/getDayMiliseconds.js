import {
  HOURS_IN_DAY,
  MINUTES_IN_HOUR,
  SECONDS_IN_MINUTE,
  MILISECONDS_IN_SECOND,
} from "../constants/timeHelper";

export const getDayMiliseconds = () => {
  return (
    HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILISECONDS_IN_SECOND
  );
};
