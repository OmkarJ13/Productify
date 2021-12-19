import React from "react";

import { Bar } from "react-chartjs-2";

import { getDaysPassed } from "../../helpers/getDaysPassed";
import { mod } from "../../helpers/mod";
import { getNextDate, getPrevDate } from "../../helpers/getDate";
import { groupTimerEntriesBy } from "../../helpers/groupTimerEntriesBy";
import Time from "../../classes/Time";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

class WeeklyGraph extends React.Component {
  // Returns the number of hours tracked for each day in a given week
  getWeeklyData(timerEntries, weekStart, weekEnd) {
    if (!timerEntries) return [];

    const timerEntriesFiltered = timerEntries.filter((timerEntry) => {
      const ms = new Date(timerEntry.date);
      return ms > weekStart.getTime() && ms < weekEnd.getTime();
    });

    const timerEntriesSorted = timerEntriesFiltered.sort((a, b) => {
      return getDaysPassed(b.date) - getDaysPassed(a.date);
    });

    const weeklyData = [];
    for (let i = 0; i < days.length; i++) {
      const timerEntriesByDay = timerEntriesSorted.filter((timerEntry) => {
        let day = new Date(timerEntry.date).getDay() - 1;

        day = mod(day, days.length);
        return day === i;
      });

      weeklyData.push(timerEntriesByDay);
    }

    return weeklyData;
  }

  getWeeklyTitle(weekStart, weekEnd) {
    const presentDate = new Date();
    const lastWeekDate = getPrevDate(
      presentDate,
      mod(presentDate.getDay() - 1, 7) + 1
    );

    if (
      presentDate.getTime() > weekStart.getTime() &&
      presentDate.getTime() < weekEnd.getTime()
    ) {
      return "This Week";
    } else if (
      lastWeekDate.getTime() > weekStart.getTime() &&
      lastWeekDate.getTime() < weekEnd.getTime()
    ) {
      return "Last Week";
    }
    return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
  }

  render() {
    const { timerEntryData, week } = this.props;

    const weeklyData = groupTimerEntriesBy(timerEntryData, ["isProductive"]);
    const productive = weeklyData[0][0].isProductive
      ? weeklyData[0]
      : weeklyData[1];

    const unproductive = !weeklyData[1][0].isProductive
      ? weeklyData[1]
      : weeklyData[0];

    const productiveData = this.getWeeklyData(productive, ...week);
    const productiveDurations = productiveData.map((timerEntriesByDay) => {
      const durations = timerEntriesByDay.map(
        (timerEntry) => timerEntry.duration
      );

      return Time.addTime(...durations);
    });
    const productiveHours = productiveDurations.map((weeklyDuration) =>
      weeklyDuration.toHours()
    );

    const unproductiveData = this.getWeeklyData(unproductive, ...week);
    const unproductiveDurations = unproductiveData.map((timerEntriesByDay) => {
      const durations = timerEntriesByDay.map(
        (timerEntry) => timerEntry.duration
      );

      return Time.addTime(...durations);
    });
    const unproductiveHours = unproductiveDurations.map((weeklyDuration) =>
      weeklyDuration.toHours()
    );

    const totalWeeklyDuration = Time.addTime(
      ...productiveDurations,
      ...unproductiveDurations
    );

    return (
      <div className="w-2/3 flex flex-col justify-between gap-4 p-4 border-b border-gray-300">
        <div className="flex justify-between items-center">
          <span className="flex items-baseline gap-1">
            Clocked Hours -
            <strong className="font-bold text-lg">
              {totalWeeklyDuration.toTimeString()}
            </strong>
          </span>

          <div className="flex self-start border border-gray-300 rounded-full">
            <button name="minus" onClick={this.props.weekChangeHandler}>
              <i className="fa fa-arrow-left px-4 py-2  text-gray-600" />
            </button>
            <span className="flex items-center gap-2 px-4 py-2 border-x border-gray-300">
              <i className="fa fa-calendar" />
              {this.getWeeklyTitle(...week)}
            </span>
            <button name="plus" onClick={this.props.weekChangeHandler}>
              <i className="fa fa-arrow-right px-4 py-2 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="w-full h-full">
          <Bar
            data={{
              labels: days,
              datasets: [
                {
                  label: "Productive Hours",
                  data: productiveHours,
                  backgroundColor: "lightgreen",
                  borderColor: "lightgreen",
                },
                {
                  label: "Unproductive Hours",
                  data: unproductiveHours,
                  backgroundColor: "salmon",
                  borderColor: "salmon",
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    );
  }
}

export default WeeklyGraph;
