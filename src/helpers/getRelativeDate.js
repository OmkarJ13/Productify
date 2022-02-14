import { Interval } from "luxon";
import { DateTime } from "luxon";
import { Info } from "luxon";

export const getRelativeDate = (date, unit) => {
  const recentPeriod = Interval.fromDateTimes(
    DateTime.now()
      .startOf(unit)
      .minus({ [unit]: 1 }),
    DateTime.now()
      .endOf(unit)
      .plus({
        [unit]: 1,
      })
  );

  if (!recentPeriod.contains(date)) {
    switch (unit) {
      case "day":
        return date.toFormat("dd/MM/yyyy");

      case "week":
        return Interval.fromDateTimes(
          date.startOf("week"),
          date.endOf("week")
        ).toFormat("dd MMM");

      case "month":
        return `${Info.months()[date.month - 1]}, ${date.year}`;

      case "year":
        return date.year;
    }
  }

  return date.toRelativeCalendar({ unit: `${unit}s` });
};
