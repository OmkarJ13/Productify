import React from "react";

import { ArrowBack, ArrowForward, Today } from "@mui/icons-material";
import { Duration } from "luxon";
import { Doughnut } from "react-chartjs-2";

import { groupTimerEntriesBy } from "../../helpers/groupTimerEntriesBy";
import PeriodChanger from "../UI/PeriodChanger";
import { DateTime, Interval } from "luxon";

class DailyDistributionChart extends React.Component {
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

  getDailyData(timerEntries) {
    if (!timerEntries) return [];

    return timerEntries.filter((timerEntry) => {
      return this.state.period.contains(timerEntry.date);
    });
  }

  render() {
    const { timerEntryData } = this.props;
    const { period } = this.state;

    const dailyData = this.getDailyData(timerEntryData);
    const totalDailyDuration = dailyData.reduce((acc, cur) => {
      return acc.plus(cur.duration);
    }, Duration.fromMillis(0));

    const dailyTasks = groupTimerEntriesBy(dailyData, ["tag"]);

    const labels = dailyTasks.map((groupedByTag) =>
      groupedByTag[0].tag ? groupedByTag[0].tag.name : "Untagged"
    );

    const bgColors = dailyTasks.map((groupedByTag) =>
      groupedByTag[0].tag ? groupedByTag[0].tag.color : "#808080"
    );

    const hours = dailyTasks.map((groupedByTag) => {
      return groupedByTag
        .reduce((acc, cur) => acc.plus(cur.duration), Duration.fromMillis(0))
        .as("hours");
    });

    return (
      <div className="w-1/3 h-[75vh] flex flex-col justify-between items-center gap-4 p-4 border-r border-b border-gray-300">
        <PeriodChanger
          unit="day"
          period={this.state.period}
          onChange={this.handlePeriodChanged}
        />
        {totalDailyDuration.as("hours") === 0 ? (
          <h2>No Time Tracked...</h2>
        ) : (
          <Doughnut
            data={{
              labels: labels,
              datasets: [
                {
                  label: "Daily Task Distribution",
                  data: hours,
                  backgroundColor: bgColors,
                  borderColor: bgColors,
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
