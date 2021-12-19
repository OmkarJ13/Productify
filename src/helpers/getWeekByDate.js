import { getPrevDate, getNextDate } from "./getDate";
import { mod } from "./mod";

export const getWeekByDate = (date) => {
  const weekStart = getPrevDate(date, mod(date.getDay() - 1, 7));
  const weekEnd = getNextDate(weekStart, 7);

  return [weekStart, weekEnd];
};
