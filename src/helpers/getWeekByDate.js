import { getPrevDate, getNextDate } from "./getDate";

export const getWeekByDate = (date) => {
  const weekStart = getPrevDate(date, date.getDay() - 1);
  const weekEnd = getNextDate(weekStart, 6);

  return [weekStart, weekEnd];
};
