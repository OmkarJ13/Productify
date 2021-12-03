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

const addTime = (timeA, timeB) => {
  const secondsTotal = Number(timeA.seconds) + Number(timeB.seconds);
  const minutesTotal = Number(timeA.minutes) + Number(timeB.minutes);
  const hoursTotal = Number(timeA.hours) + Number(timeB.hours);

  if (secondsTotal >= 60) {
    minutesTotal++;
    secondsTotal = secondsTotal % 60;
  }

  if (minutesTotal >= 60) {
    hoursTotal++;
    minutesTotal = minutesTotal % 60;
  }

  return {
    hours: hoursTotal.toString().padStart(2, "0"),
    minutes: minutesTotal.toString().padStart(2, "0"),
    seconds: secondsTotal.toString().padStart(2, "0"),
  };
};

export { days, startInterval, calculateDaysPassed, addTime };
