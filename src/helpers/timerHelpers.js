const days = [
  "today",
  "yesterday",
  "2 days ago",
  "3 days ago",
  "4 days ago",
  "5 days ago",
  "6 days ago",
];

const startInterval = (callback, interval) => {
  callback();
  return setInterval(callback, interval);
};

const calculateDaysPassed = (date) => {
  const difference = Math.abs(new Date() - new Date(date));
  const daysSince = Math.floor(difference / 1000 / 60 / 60 / 24);
  return daysSince;
};

export { startInterval, calculateDaysPassed, days };
