export const getDaysPassed = (date) => {
  return Math.floor(date.diffNow().as("days"));
};
