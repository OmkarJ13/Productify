export const toDateString = (dateInput) => {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};
