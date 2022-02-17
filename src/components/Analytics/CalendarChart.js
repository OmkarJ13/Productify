import React from "react";
import { Interval, DateTime } from "luxon";
import CalendarHeatmap from "react-calendar-heatmap";

import PeriodChanger from "../UI/PeriodChanger";

class CalendarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      period: Interval.fromDateTimes(
        DateTime.now().startOf("year"),
        DateTime.now().endOf("year")
      ),
    };

    this.handlePeriodChanged = this.handlePeriodChanged.bind(this);
  }

  handlePeriodChanged(e) {
    this.setState({
      period: e,
    });
  }

  filterData(data, period) {
    return data.filter((ele) => period.contains(ele.date));
  }

  getYearlyData(timerEntries, todos) {
    const yearStart = this.state.period.start;
    const yearEnd = this.state.period.end;

    const yearlyData = [];

    let currentDay = yearStart;
    while (currentDay.toISODate() !== yearEnd.toISODate()) {
      const filteredTimerEntries = timerEntries.filter(
        (timerEntry) => timerEntry.date.toISODate() === currentDay.toISODate()
      );

      const doneTodos = todos.filter((todo) => todo.isDone);
      const filteredTodos = doneTodos.filter(
        (todo) => todo.doneTime.toISODate() === currentDay.toISODate()
      );

      const trackedHours = filteredTimerEntries.reduce(
        (acc, cur) => acc + cur.duration.as("hours"),
        0
      );

      const tasksDone = filteredTodos.length;

      const productivity = Math.round(trackedHours + tasksDone);

      if (productivity > 0) {
        yearlyData.push({
          date: currentDay.toFormat("yyyy-MM-dd"),
          count: productivity,
        });
      }

      currentDay = currentDay.plus({ day: 1 });
    }

    return yearlyData;
  }

  render() {
    const { timerEntries, todos, tags } = this.props;
    const { period } = this.state;

    const filteredTimerEntries = this.filterData(timerEntries, period);
    const filteredTodos = this.filterData(todos, period);

    const yearlyData = this.getYearlyData(filteredTimerEntries, filteredTodos);

    return (
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-lg font-semibold">Productivity</h1>
            <h2 className="text-sm">
              Your productivity depends upon the tasks you complete each day and
              the amount of hours you track every day.
            </h2>
          </div>

          <PeriodChanger
            unit="year"
            value={period}
            onChange={this.handlePeriodChanged}
          />
        </div>
        <div className="overflow-auto">
          <CalendarHeatmap
            startDate={period.start.toJSDate()}
            endDate={period.end.toJSDate()}
            values={yearlyData}
            classForValue={(value) => {
              if (!value || value.count === 0) return "fill-gray-200";
              switch (value.count) {
                case 1:
                  return "fill-blue-200";
                case 2:
                case 3:
                  return "fill-blue-300";
                case 4:
                case 5:
                case 6:
                  return "fill-blue-400";
                case 7:
                case 8:
                case 9:
                case 10:
                  return "fill-blue-500";
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                  return "fill-blue-500";
                default:
                  return "fill-blue-600";
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default CalendarChart;
