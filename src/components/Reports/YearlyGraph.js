import React from "react";

import Time from "../../classes/Time";
import { Line } from "react-chartjs-2";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

class YearlyGraph extends React.Component {
  // Returns number of hours tracked for each month in a given year.
  getYearlyData(timerEntries, year = new Date().toFullYear()) {
    if (!timerEntries) return [];

    const filteredTimerEntries = timerEntries.filter((timerEntry) => {
      return new Date(timerEntry.date).getFullYear() === year;
    });

    const sortedTimerEntries = filteredTimerEntries.sort(
      (a, b) => new Date(a.date).getMonth() - new Date(b.date).getMonth()
    );

    const yearlyData = [];
    for (let i = 0; i < months.length; i++) {
      const filteredByMonth = sortedTimerEntries.filter((timerEntry) => {
        return new Date(timerEntry.date).getMonth() === i;
      });

      yearlyData.push(filteredByMonth);
    }

    return yearlyData;
  }

  getYearlyTitle(year) {
    const presentYear = new Date().getFullYear();

    if (year === presentYear) {
      return "This Year";
    } else if (year === presentYear - 1) {
      return "Last Year";
    }

    return year;
  }

  render() {
    const { timerEntryData, year } = this.props;

    const yearlyData = this.getYearlyData(timerEntryData, year);
    const yearlyDurations = yearlyData.map((timerEntriesByMonth) => {
      const durations = timerEntriesByMonth.map(
        (timerEntry) => timerEntry.duration
      );

      return Time.addTime(...durations);
    });
    const totalYearlyDuration = Time.addTime(...yearlyDurations);
    const yearlyHours = yearlyDurations.map((yearlyDuration) =>
      yearlyDuration.toHours()
    );

    return (
      <div className="w-full flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <div className="inline-flex self-end border border-gray-300 rounded-full">
            <button name="minus" onClick={this.props.yearChangeHandler}>
              <i className="fa fa-arrow-left px-4 py-2  text-gray-600" />
            </button>
            <span className="flex items-center gap-2 px-4 py-2 border-x border-gray-300">
              <i className="fa fa-calendar" />
              {this.getYearlyTitle(year)}
            </span>
            <button name="plus" onClick={this.props.yearChangeHandler}>
              <i className="fa fa-arrow-right px-4 py-2 text-gray-600" />
            </button>
          </div>

          <span className="flex items-baseline gap-1">
            Clocked Hours -
            <strong className="font-bold text-lg">
              {totalYearlyDuration.toTimeString()}
            </strong>
          </span>
        </div>

        <Line
          data={{
            labels: months,
            datasets: [
              {
                label: "Hours Tracked",
                data: yearlyHours,
                backgroundColor: "skyblue",
                borderColor: "skyblue",
                borderWidth: 1.5,
              },
            ],
          }}
          options={{
            elements: {
              point: {
                radius: 0,
              },
            },
            scales: {
              x: {
                ticks: {
                  maxTicksLimit: 12,
                },
              },
            },
          }}
        />
      </div>
    );
  }
}

export default YearlyGraph;
