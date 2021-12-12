import Time from "../classes/Time";

export const parseTimerEntriesJSON = (timerEntriesJSON) => {
  const timerEntries = JSON.parse(timerEntriesJSON);
  timerEntries.forEach((timerEntry) => {
    timerEntry.startTime = new Time(...Object.values(timerEntry.startTime));
    timerEntry.endTime = new Time(...Object.values(timerEntry.endTime));
    timerEntry.duration = new Time(...Object.values(timerEntry.duration));
  });

  return timerEntries;
};
