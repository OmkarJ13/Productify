import { DateTime } from "luxon";
import { Duration } from "luxon";

export const restoreTimerEntry = (timerEntry) => {
  timerEntry.date = DateTime.fromISO(timerEntry.date);
  timerEntry.startTime = DateTime.fromISO(timerEntry.startTime);
  timerEntry.endTime = DateTime.fromISO(timerEntry.endTime);
  timerEntry.duration = Duration.fromISO(timerEntry.duration);

  return timerEntry;
};
