import { getDayMiliseconds } from "./getDayMiliseconds";

export const getPrevDate = (date, days = 1) => {
  return new Date(date.getTime() - days * getDayMiliseconds());
};

export const getNextDate = (date, days = 1) => {
  return new Date(date.getTime() + days * getDayMiliseconds());
};
