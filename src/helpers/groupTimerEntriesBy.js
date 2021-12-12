export const groupTimerEntriesBy = (timerEntries, keys) => {
  const groupedEntries = [];

  timerEntries.forEach((timerEntry, _, self) => {
    const matches = self.filter((ele) => {
      return keys.every((key) => {
        return timerEntry[key] === ele[key];
      });
    });

    const includes = groupedEntries.some(
      (ele) => JSON.stringify(ele) === JSON.stringify(matches)
    );

    if (!includes) groupedEntries.push(matches);
  });

  return groupedEntries;
};
