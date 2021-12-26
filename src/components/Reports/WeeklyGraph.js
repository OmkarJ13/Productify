import React from "react";
import { Bar } from "react-chartjs-2";
import { Duration } from "luxon";
import { Info } from "luxon";
import { DateTime } from "luxon";

import { getDaysPassed } from "../../helpers/getDaysPassed";
import { groupTimerEntriesBy } from "../../helpers/groupTimerEntriesBy";
import { Interval } from "luxon";

class WeeklyGraph extends React.Component {
  getWeeklyData(timerEntries, week) {
    if (!timerEntries) return [];

    const timerEntriesFiltered = timerEntries.filter((timerEntry) => {
      return week.contains(timerEntry.date);
    });

    const timerEntriesSorted = timerEntriesFiltered.sort((a, b) => {
      return getDaysPassed(b.date) - getDaysPassed(a.date);
    });

    const weeklyData = [];
    for (let i = 1; i <= Info.weekdays().length; i++) {
      const timerEntriesByDay = timerEntriesSorted.filter((timerEntry) => {
        return timerEntry.date.weekday === i;
      });

      weeklyData.push(timerEntriesByDay);
    }

    return weeklyData;
  }

  getWeeklyTitle(week) {
    return week.start.toRelativeCalendar({ unit: "weeks" });
  }

  render() {
    const { timerEntryData, week } = this.props;

    const weeklyData = groupTimerEntriesBy(timerEntryData, ["isProductive"]);
    const productive = weeklyData[0][0].isProductive
      ? weeklyData[0]
      : weeklyData.length === 2
      ? weeklyData[1]
      : [];

    const unproductive = !weeklyData[0][0].isProductive
      ? weeklyData[0]
      : weeklyData.length === 2
      ? weeklyData[1]
      : [];

    const productiveData = this.getWeeklyData(productive, week);
    const productiveDurations = productiveData.map((timerEntriesByDay) => {
      return timerEntriesByDay.reduce((acc, cur) => {
        return acc.plus(cur.duration);
      }, Duration.fromMillis(0));
    });
    const productiveHours = productiveDurations.map((weeklyDuration) =>
      weeklyDuration.as("hours")
    );

    const unproductiveData = this.getWeeklyData(unproductive, week);
    const unproductiveDurations = unproductiveData.map((timerEntriesByDay) => {
      return timerEntriesByDay.reduce((acc, cur) => {
        return acc.plus(cur.duration);
      }, Duration.fromMillis(0));
    });
    const unproductiveHours = unproductiveDurations.map((weeklyDuration) =>
      weeklyDuration.as("hours")
    );

    const totalWeeklyDuration = [
      ...productiveDurations,
      ...unproductiveDurations,
    ].reduce((acc, cur) => {
      return acc.plus(cur);
    }, Duration.fromMillis(0));

    return (
      <div className="w-2/3 flex flex-col justify-between gap-4 p-4 border-b border-gray-300">
        <div className="flex justify-between items-center">
          <span className="flex items-baseline gap-1">
            Clocked Hours -
            <strong className="font-bold text-lg">
              {totalWeeklyDuration.toFormat("hh:mm:ss")}
            </strong>
          </span>

          <div className="flex self-start border border-gray-300 rounded-full">
            <button name="minus" onClick={this.props.weekChangeHandler}>
              <i className="fa fa-arrow-left px-4 py-2  text-gray-600" />
            </button>
            <span className="flex items-center gap-2 px-4 py-2 border-x border-gray-300 capitalize">
              <i className="fa fa-calendar" />
              {this.getWeeklyTitle(week)}
            </span>
            <button name="plus" onClick={this.props.weekChangeHandler}>
              <i className="fa fa-arrow-right px-4 py-2 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="w-full h-full">
          <Bar
            data={{
              labels: Info.weekdays(),
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