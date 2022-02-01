import { DateTime, Duration } from "luxon";

export const restoreTimerEntry = (timerEntry) => {
  const restoredTimerEntry = {
    ...timerEntry,
    date: DateTime.fromISO(timerEntry.date),
    startTime: DateTime.fromISO(timerEntry.startTime),
    endTime: DateTime.fromISO(timerEntry.endTime),
    duration: Duration.fromISO(timerEntry.duration),
  };

  return restoreTimerEntry;
};
