export const getDaysPassed = (date) => {
  const daysPassed = Math.floor(date.diffNow().days);
  return daysPassed;
};
