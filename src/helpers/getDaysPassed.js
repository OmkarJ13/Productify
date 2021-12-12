export const getDaysPassed = (date) => {
  const difference = new Date() - new Date(date);
  const daysSince = Math.floor(difference / 1000 / 60 / 60 / 24);
  return daysSince;
};
