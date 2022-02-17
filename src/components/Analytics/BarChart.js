import React from "react";
import { DateTime, Interval, Info, Duration } from "luxon";
import { Bar } from "react-chartjs-2";

import PeriodChanger from "../UI/PeriodChanger";
import ViewBySelector from "./ViewBySelector";

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      period: Interval.fromDateTimes(
        DateTime.now().startOf("week"),
        DateTime.now().endOf("week")
      ),
      view: "trackedHours",
    };

    this.handlePeriodChanged = this.handlePeriodChanged.bind(this);
    this.handleViewChanged = this.handleViewChanged.bind(this);
  }

  handlePeriodChanged(e) {
    this.setState({
      period: e,
    });
  }

  handleViewChanged(e) {
    this.setState({
      view: e,
    });
  }

  getWeeklyTrackedHours(timerEntries) {
    const weekdays = Info.weekdays();
    const weeklyTrackedHours = weekdays.map((weekday, i) => {
      const timerEntriesForDay = timerEntries.filter(
        (timerEntry) => timerEntry.date.weekday === i
      );

      return timerEntriesForDay
        .reduce((acc, cur) => acc.plus(cur.duration), Duration.fromMillis(0))
        .as("hours");
    });

    return weeklyTrackedHours;
  }

  getWeeklyTasksDone(todos) {
    const weekdays = Info.weekdays();
    const weeklyTasksDone = weekdays.map((_, i) => {
      const todosForDay = todos.filter((todo) => todo.doneTime.weekday === i);

      return todosForDay.filter((todo) => todo.isDone).length;
    });

    return weeklyTasksDone;
  }

  getWeeklyRevenueEarned(timerEntries, tags) {
    const weekdays = Info.weekdays();
    const weeklyRevenueEarned = weekdays.map((_, i) => {
      const timerEntriesForDay = timerEntries.filter(
        (timerEntry) => timerEntry.date.weekday === i
      );

      const billableTimerEntriesForDay = timerEntriesForDay.filter(
        (timerEntry) => timerEntry.isBillable
      );

      return billableTimerEntriesForDay.reduce(
        (acc, cur) =>
          acc +
          cur.duration.as("hours") *
            tags.find((x) => x.id === cur.tag)?.billableAmount,
        0
      );
    });

    return weeklyRevenueEarned;
  }

  render() {
    const { view, period } = this.state;
    const { timerEntries, todos, tags } = this.props;

    const filteredTimerEntries = timerEntries.filter((timerEntry) =>
      period.contains(timerEntry.date)
    );
    const filteredTodos = todos.filter((todo) =>
      period.contains(todo.doneTime)
    );

    const trackedHours = this.getWeeklyTrackedHours(filteredTimerEntries);
    const tasksDone = this.getWeeklyTasksDone(filteredTodos);
    const revenueEarned = this.getWeeklyRevenueEarned(
      filteredTimerEntries,
      tags
    );

    return (
      <div className="flex h-full w-full flex-col items-center gap-8 rounded-md p-4">
        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <PeriodChanger
            unit="week"
            value={period}
            onChange={this.handlePeriodChanged}
          />
          <ViewBySelector value={view} onChange={this.handleViewChanged} />
        </div>

        <div className="h-full w-full">
          <Bar
            data={{
              labels: Info.weekdays(),
              datasets: [
                {
                  label: "Weekly Distribution",
                  data:
                    view === "trackedHours"
                      ? trackedHours
                      : view === "tasksDone"
                      ? tasksDone
                      : view === "revenueEarned"
                      ? revenueEarned
                      : [],
                  backgroundColor: "#3b82f6",
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  suggestedMin: 0,
                  suggestedMax: 8,
                },
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default BarChart;
