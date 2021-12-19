import { getDayMiliseconds } from "./getDayMiliseconds";

export const getPrevDate = (date, days = 1) => {
  const prevDate = new Date(date.getTime() - days * getDayMiliseconds());
  prevDate.setHours(0, 0, 0);
  return prevDate;
};

export const getNextDate = (date, days = 1) => {
  const nextDate = new Date(date.getTime() + days * getDayMiliseconds());
  nextDate.setHours(0, 0, 0);
  return nextDate;
};
