import Time from "../classes/Time";

export const restoreTimerEntry = (timerEntry) => {
  timerEntry.endTime = new Time(...Object.values(timerEntry.endTime));
  timerEntry.startTime = new Time(...Object.values(timerEntry.startTime));
  timerEntry.duration = new Time(...Object.values(timerEntry.duration));

  return timerEntry;
};
