import { restoreTimerEntry } from "./restoreTimerEntry";

export const parseTimerEntriesJSON = (timerEntriesJSON) => {
  const timerEntries = JSON.parse(timerEntriesJSON);
  timerEntries.forEach((timerEntry) => {
    restoreTimerEntry(timerEntry);
  });

  return timerEntries;
};
