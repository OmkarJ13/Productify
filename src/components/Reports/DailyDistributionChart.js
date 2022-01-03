import { ArrowBack, ArrowForward, Today } from "@mui/icons-material";
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
      <div className="w-1/3 h-[75vh] flex flex-col justify-between items-center gap-4 p-4 border-r border-b border-gray-300">
        <div className="inline-flex border border-gray-300 rounded-full">
          <button
            name="minus"
            onClick={this.props.dateChangeHandler}
            className="px-2"
          >
            <ArrowBack />
          </button>
          <span className="flex items-center gap-2 px-4 py-2 border-x border-gray-300 capitalize">
            <Today />
            {this.getDailyTitle(date)}
          </span>
          <button
            name="plus"
            onClick={this.props.dateChangeHandler}
            className="px-2"
          >
            <ArrowForward />
          </button>
        </div>
        {totalDailyDuration.as("hours") === 0 ? (
          <h2>No Time Tracked...</h2>
        ) : (
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
        )}

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
