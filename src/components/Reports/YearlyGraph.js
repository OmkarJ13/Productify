import React from "react";

import { ArrowBack, ArrowForward, Today } from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import { Info } from "luxon";
import { Duration } from "luxon";
import { DateTime, Interval } from "luxon";

import PeriodChanger from "../UI/PeriodChanger";

class YearlyGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      period: Interval.fromDateTimes(
        DateTime.now().startOf("day"),
        DateTime.now().endOf("day")
      ),
    };

    this.handlePeriodChanged = this.handlePeriodChanged.bind(this);
  }

  handlePeriodChanged(e) {
    this.setState({
      period: e,
    });
  }

  getYearlyData(timerEntries) {
    if (!timerEntries) return [];

    const filteredTimerEntries = timerEntries.filter((timerEntry) => {
      return this.state.period.contains(timerEntry.date);
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

  render() {
    const { timerEntryData } = this.props;
    const { period } = this.state;

    const yearlyData = this.getYearlyData(timerEntryData);

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
          <span className="flex items-baseline gap-1">
            Clocked Hours -
            <strong className="font-bold text-lg">
              {totalYearlyDuration.toFormat("hh:mm:ss")}
            </strong>
          </span>

          <PeriodChanger
            unit="year"
            period={this.state.period}
            onChange={this.handlePeriodChanged}
          />
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
