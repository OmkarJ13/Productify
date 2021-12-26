export const getDaysPassed = (date) => {
  const daysPassed = Math.floor(date.diffNow().as("days"));
  return daysPassed;
};
