const days = [
  "today",
  "yesterday",
  "2 days ago",
  "3 days ago",
  "4 days ago",
  "5 days ago",
  "6 days ago",
];

const calculateDaysPassed = (date) => {
  const difference = new Date() - new Date(date);
  const daysSince = Math.floor(difference / 1000 / 60 / 60 / 24);
  return daysSince;
};

export { days, calculateDaysPassed };
