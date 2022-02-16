import { DateTime, Interval, Duration } from "luxon";
import React from "react";
import { Doughnut } from "react-chartjs-2";

import { groupObjectArrayBy } from "../../helpers/groupObjectArrayBy";
import ViewBySelector from "./ViewBySelector";
import PeriodChanger from "../UI/PeriodChanger";
import NoData from "../UI/NoData";

class DoughnutChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      period: Interval.fromDateTimes(
        DateTime.now().startOf("day"),
        DateTime.now().endOf("day")
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

  filterData(data, period) {
    return data.filter((ele) => period.contains(ele.date));
  }

  getTrackedHoursPerTag(timerEntries, tags) {
    if (timerEntries.length === 0) return [];
    const timerEntriesPerTag = groupObjectArrayBy(timerEntries, ["tag"]);

    const trackedHoursPerTag = timerEntriesPerTag.map((timerEntriesGrouped) => {
      return {
        tag: tags.find((x) => x.id === timerEntriesGrouped[0].tag),
        trackedHours: timerEntriesGrouped
          .reduce(
            (acc, timerEntry) => acc.plus(timerEntry.duration),
            Duration.fromMillis(0)
          )
          .as("hours"),
      };
    });

    return trackedHoursPerTag;
  }

  getTasksDonePerTag(todos, tags) {
    const doneTodos = todos.filter((todo) => todo.isDone);
    if (!doneTodos.length) return [];

    const todosPerTag = groupObjectArrayBy(doneTodos, ["tag"]);
    const tasksDonePerTag = todosPerTag.map((todosGrouped) => {
      return {
        tag: tags.find((x) => x.id === todosGrouped[0].tag),
        tasksDone: todosGrouped.length,
      };
    });

    return tasksDonePerTag;
  }

  getRevenueEarnedPerTag(timerEntries, tags) {
    const billableTimerEntries = timerEntries.filter(
      (timerEntry) => timerEntry.isBillable
    );
    if (!billableTimerEntries.length) return [];

    const timerEntriesPerTag = groupObjectArrayBy(billableTimerEntries, [
      "tag",
    ]);

    const revenueEarnedPerTag = timerEntriesPerTag.map(
      (timerEntriesGrouped) => {
        const revenueEarned = timerEntriesGrouped.reduce((acc, timerEntry) => {
          const tag = tags.find((x) => x.id === timerEntry.tag);
          if (tag) {
            return acc + tag.billableAmount * timerEntry.duration.as("hours");
          }
        }, 0);

        return {
          tag: tags.find((x) => x.id === timerEntriesGrouped[0].tag),
          revenueEarned,
        };
      }
    );

    const filteredRevenueEarnedPerTag = revenueEarnedPerTag.filter(
      (revenuePerTag) => revenuePerTag.revenueEarned > 0
    );

    return filteredRevenueEarnedPerTag;
  }

  getData(view, timerEntries, todos, tags) {
    switch (view) {
      case "trackedHours":
        return this.getTrackedHoursPerTag(timerEntries, tags);

      case "revenueEarned":
        return this.getRevenueEarnedPerTag(timerEntries, tags);

      case "tasksDone":
        return this.getTasksDonePerTag(todos, tags);

      default:
        return [];
    }
  }

  render() {
    const { period, view } = this.state;
    const { timerEntries, todos, tags } = this.props;

    const filteredTimerEntries = this.filterData(timerEntries, period);
    const filteredTodos = this.filterData(todos, period);

    const data = this.getData(view, filteredTimerEntries, filteredTodos, tags);

    return (
      <div className="flex h-full w-full flex-col items-center justify-between gap-8 p-4">
        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <PeriodChanger
            unit="day"
            value={period}
            onChange={this.handlePeriodChanged}
          />
          <ViewBySelector value={view} onChange={this.handleViewChanged} />
        </div>

        <div className="flex h-full flex-grow items-center justify-center">
          {data.length === 0 && <NoData text="No Data To Display" />}
          {data.length > 0 && (
            <Doughnut
              data={{
                labels: data.map((ele) =>
                  ele.tag ? ele.tag.name : "Untagged"
                ),
                datasets: [
                  {
                    label: "Daily Distribution",
                    data: data.map((ele) => ele[view]),
                    backgroundColor: data.map((ele) =>
                      ele.tag ? ele.tag.color : "gray"
                    ),
                  },
                ],
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default DoughnutChart;
