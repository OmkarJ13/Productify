import { Duration } from "luxon";
import React from "react";
import { Doughnut } from "react-chartjs-2";

import { colors } from "../../helpers/colors";

class DailyDistributionChart extends React.Component {
  getDailyData(timerEntries, date) {
    if (!timerEntries) return [];

    return timerEntries.filter((timerEntry) => {
      return timerEntry.date.toString() === date.toString();
    });
  }

  getDailyTitle(date) {
    return date.toRelativeCalendar({ unit: "days" });
  }

  render() {
    const { timerEntryData, date } = this.props;

    const dailyData = this.getDailyData(timerEntryData, date);

    const dailyTasks = dailyData.map((timerEntry) => timerEntry.task);

    const dailyDurations = dailyData.map((timerEntry) => timerEntry.duration);

    const totalDailyDuration = dailyDurations.reduce((acc, cur) => {
      return acc.plus(cur);
    }, Duration.fromMillis(0));

    const dailyHours = dailyDurations.flatMap((dailyDuration) =>
      dailyDuration.as("hours")
    );

    return (
      <div className="w-1/3 flex flex-col justify-between items-center gap-4 p-4 border-r border-b border-gray-300">
        <div className="inline-flex border border-gray-300 rounded-full">
          <button name="minus" onClick={this.props.dateChangeHandler}>
            <i className="fa fa-arrow-left px-4 py-2  text-gray-600" />
          </button>
          <span className="flex items-center gap-2 px-4 py-2 border-x border-gray-300 capitalize">
            <i className="fa fa-calendar" />
            {this.getDailyTitle(date)}
          </span>
          <button name="plus" onClick={this.props.dateChangeHandler}>
            <i className="fa fa-arrow-right px-4 py-2 text-gray-600" />
          </button>
        </div>

        <Doughnut
          data={{
            labels: dailyTasks,
            datasets: [
              {
                label: "Daily Task Distribution",
                data: dailyHours,
                backgroundColor: colors,
                borderColor: colors,
              },
            ],
          }}
        />

        <span className="flex items-baseline gap-1">
          Clocked Hours -
          <strong className="font-bold text-lg">
            {totalDailyDuration.toFormat("hh:mm:ss")}
          </strong>
        </span>
      </div>
    );
  }
}

export default DailyDistributionChart;
