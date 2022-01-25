import React from "react";

import { Bar } from "react-chartjs-2";
import { Duration } from "luxon";
import { Info } from "luxon";
import { Interval, DateTime } from "luxon";

import { ArrowBack, ArrowForward, Today } from "@mui/icons-material";
import { groupTimerEntriesBy } from "../../helpers/groupTimerEntriesBy";
import PeriodChanger from "../UI/PeriodChanger";

class WeeklyGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      period: Interval.fromDateTimes(
        DateTime.now().startOf("week"),
        DateTime.now().endOf("week")
      ),
    };

    this.handlePeriodChanged = this.handlePeriodChanged.bind(this);
  }

  handlePeriodChanged(e) {
    this.setState({
      period: e,
    });
  }

  getWeeklyData(timerEntries) {
    if (!timerEntries) return [];

    const timerEntriesFiltered = timerEntries.filter((timerEntry) => {
      return this.state.period.contains(timerEntry.date);
    });

    const timerEntriesSorted = timerEntriesFiltered.sort((a, b) => {
      return b.date.toMillis() - a.date.toMillis();
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

  render() {
    const { timerEntryData } = this.props;
    const { period } = this.state;

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

    const productiveData = this.getWeeklyData(productive);
    const productiveDurations = productiveData.map((timerEntriesByDay) => {
      return timerEntriesByDay.reduce((acc, cur) => {
        return acc.plus(cur.duration);
      }, Duration.fromMillis(0));
    });
    const productiveHours = productiveDurations.map((weeklyDuration) =>
      weeklyDuration.as("hours")
    );

    const unproductiveData = this.getWeeklyData(unproductive);
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
      <div className="w-2/3 h-[75vh] flex flex-col justify-between gap-4 p-4 border-b border-gray-300">
        <div className="flex justify-between items-center">
          <span className="flex items-baseline gap-1">
            Clocked Hours -
            <strong className="font-bold text-lg">
              {totalWeeklyDuration.toFormat("hh:mm:ss")}
            </strong>
            <PeriodChanger
              unit="week"
              period={this.state.period}
              onChange={this.handlePeriodChanged}
            />
          </span>
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
              scales: {
                y: {
                  suggestedMin: 0,
                  suggestedMax: 10,
                },
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default WeeklyGraph;
