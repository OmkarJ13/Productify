import React from "react";
import { Line } from "react-chartjs-2";
import { Info } from "luxon";
import { Duration } from "luxon";
import { DateTime } from "luxon";
import { ArrowBack, ArrowForward, Today } from "@mui/icons-material";

class YearlyGraph extends React.Component {
  getYearlyData(timerEntries, year) {
    if (!timerEntries) return [];

    const filteredTimerEntries = timerEntries.filter((timerEntry) => {
      return timerEntry.date.year === year;
    });

    const sortedTimerEntries = filteredTimerEntries.sort(
      (a, b) => a.date.month - b.date.month
    );

    const yearlyData = [];
    for (let i = 1; i <= Info.months().length; i++) {
      const filteredByMonth = sortedTimerEntries.filter((timerEntry) => {
        return timerEntry.date.month === i;
      });

      yearlyData.push(filteredByMonth);
    }

    return yearlyData;
  }

  getYearlyTitle(year) {
    const date = DateTime.fromObject({ year: year });
    return date.toRelativeCalendar({ unit: "years" });
  }

  render() {
    const { timerEntryData, year } = this.props;

    const yearlyData = this.getYearlyData(timerEntryData, year);

    const yearlyDurations = yearlyData.map((timerEntriesByMonth) => {
      return timerEntriesByMonth.reduce((acc, cur) => {
        return acc.plus(cur.duration);
      }, Duration.fromMillis(0));
    });

    const totalYearlyDuration = yearlyDurations.reduce((acc, cur) => {
      return acc.plus(cur);
    }, Duration.fromMillis(0));

    const yearlyHours = yearlyDurations.map((yearlyDuration) =>
      yearlyDuration.as("hours")
    );

    return (
      <div className="w-full flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <div className="inline-flex self-end">
            <button
              name="minus"
              onClick={this.props.yearChangeHandler}
              className="px-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white rounded-l-full"
            >
              <ArrowBack />
            </button>
            <span className="flex items-center gap-2 px-4 py-2 border-y border-gray-300 capitalize">
              <Today />
              {this.getYearlyTitle(year)}
            </span>
            <button
              name="plus"
              onClick={this.props.yearChangeHandler}
              className="px-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white rounded-r-full"
            >
              <ArrowForward />
            </button>
          </div>

          <span className="flex items-baseline gap-1">
            Clocked Hours -
            <strong className="font-bold text-lg">
              {totalYearlyDuration.toFormat("hh:mm:ss")}
            </strong>
          </span>
        </div>

        <Line
          data={{
            labels: Info.months(),
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
            scales: {
              y: {
                suggestedMin: 0,
                suggestedMax: 300,
              },
            },
          }}
        />
      </div>
    );
  }
}

export default YearlyGraph;
