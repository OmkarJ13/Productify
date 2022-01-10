import React from "react";
import { v4 as uuid } from "uuid";
import { Duration } from "luxon";
import { DateTime } from "luxon";

import TimerEntry from "./TimerEntry";

import { getDaysPassed } from "../../helpers/getDaysPassed";
import { groupTimerEntriesBy } from "../../helpers/groupTimerEntriesBy";
import { connect } from "react-redux";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  SwapVerticalCircleOutlined,
} from "@mui/icons-material";
import TimerForm from "./TimerForm";

class TimerEntries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "weekly",
      duration: "unsorted",
      time: "descending",
    };

    this.viewChangeHandler = this.viewChangeHandler.bind(this);
    this.sortDuration = this.sortDuration.bind(this);
    this.sortTime = this.sortTime.bind(this);
  }

  viewChangeHandler(e) {
    const view = e.target.value.toLowerCase();
    this.setState({
      view: view,
    });
  }

  getWeeklyTotal(timerEntries) {
    const filteredEntries = this.getWeeklyEntries(timerEntries);
    return filteredEntries.reduce((acc, cur) => {
      return acc.plus(cur.duration);
    }, Duration.fromMillis(0));
  }

  getDailyTotal(timerEntries) {
    const filteredEntries = this.getDailyEntries(timerEntries);
    return filteredEntries.reduce((acc, cur) => {
      return acc.plus(cur.duration);
    }, Duration.fromMillis(0));
  }

  getCombinedTimerEntry(timerEntries) {
    const allStartTimes = timerEntries.map((cur) => cur.startTime);
    const minStartTime = DateTime.min(...allStartTimes);

    const allEndTimes = timerEntries.map((cur) => cur.endTime);
    const maxEndTime = DateTime.max(...allEndTimes);

    // Get all the durations
    const totalDuration = timerEntries.reduce((acc, cur) => {
      return acc.plus(cur.duration);
    }, Duration.fromMillis(0));

    const combinedTimerEntry = {
      id: uuid(),
      task: timerEntries[0].task,
      date: timerEntries[0].date,
      duration: totalDuration,
      startTime: minStartTime,
      endTime: maxEndTime,
      tag: timerEntries[0].tag,
      isProductive: timerEntries[0].isProductive,
      isBillable: timerEntries[0].isBillable,
      allEntries: this.generateTimerEntries(timerEntries),
    };

    return combinedTimerEntry;
  }

  getTimerEntries(timerEntries) {
    const groupedByDate = groupTimerEntriesBy(timerEntries, ["date"]);

    let sorted = [];
    if (this.state.time !== "unsorted") {
      sorted = groupedByDate.sort((a, b) => {
        return this.state.time === "descending"
          ? getDaysPassed(b[0].date) - getDaysPassed(a[0].date)
          : getDaysPassed(a[0].date) - getDaysPassed(b[0].date);
      });
    }

    if (this.state.duration !== "unsorted") {
      sorted = groupedByDate.sort((a, b) => {
        const durationsA = a.reduce((acc, cur) => {
          return acc.plus(cur.duration);
        }, Duration.fromMillis(0));

        const durationsB = b.reduce((acc, cur) => {
          return acc.plus(cur.duration);
        }, Duration.fromMillis(0));

        return this.state.duration === "descending"
          ? durationsB.toMillis() - durationsA.toMillis()
          : durationsA.toMillis() - durationsB.toMillis();
      });
    }

    const groupedByDateAndTask = sorted.map((groupedEntries) =>
      groupTimerEntriesBy(groupedEntries, ["task"])
    );

    const finalTimerEntries = groupedByDateAndTask.map((groupedByDate) => {
      return groupedByDate.map((groupedByTask) => {
        if (groupedByTask.length === 1) {
          return groupedByTask[0];
        } else {
          return this.getCombinedTimerEntry(groupedByTask);
        }
      });
    });

    const JSX = finalTimerEntries.map((timerEntriesGrouped) => {
      const day = timerEntriesGrouped[0].date.toRelativeCalendar({
        unit: "days",
      });

      const thisDayTotal = timerEntriesGrouped.reduce((acc, cur) => {
        return acc.plus(cur.duration);
      }, Duration.fromMillis(0));

      return (
        <div className="w-full flex flex-col">
          <div className="w-full flex justify-between px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white uppercase text-lg">
            <h4>{day}</h4>
            <h4>{thisDayTotal.toFormat("hh:mm:ss")}</h4>
          </div>

          <div className="w-full flex flex-col">
            {this.generateTimerEntries(timerEntriesGrouped)}
          </div>
        </div>
      );
    });

    return JSX;
  }

  generateTimerEntries(timerEntries) {
    return timerEntries.map((timerEntry) => {
      return (
        <TimerForm
          key={timerEntry.id}
          timerEntry={{
            id: timerEntry.id,
            task: timerEntry.task,
            tag: timerEntry.tag,
            duration: timerEntry.duration,
            date: timerEntry.date,
            startTime: timerEntry.startTime,
            endTime: timerEntry.endTime,
            isProductive: timerEntry.isProductive,
            isBillable: timerEntry.isBillable,
          }}
          UI={(otherProps) => {
            return (
              <TimerEntry allEntries={timerEntry.allEntries} {...otherProps} />
            );
          }}
        />
      );
    });
  }

  generateEmptyMessage() {
    return <h3 className="m-auto text-2xl font-light">No Time Tracked...</h3>;
  }

  getWeeklyEntries(timerEntries) {
    return timerEntries.filter((timerEntry) => {
      return (
        timerEntry.date.toRelativeCalendar({ unit: "weeks" }) === "this week"
      );
    });
  }

  getDailyEntries(timerEntries) {
    return timerEntries.filter((timerEntry) => {
      return timerEntry.date.toRelativeCalendar({ unit: "days" }) === "today";
    });
  }

  getFilteredEntries(timerEntries) {
    const { view } = this.state;
    switch (view) {
      case "weekly":
        return this.getWeeklyEntries(timerEntries);

      case "daily":
        return this.getDailyEntries(timerEntries);

      case "all":
        return timerEntries;

      default:
        return [];
    }
  }

  sortDuration(e) {
    this.setState({
      duration:
        this.state.duration === "descending" ? "ascending" : "descending",
      time: "unsorted",
    });
  }

  sortTime(e) {
    this.setState({
      time: this.state.time === "descending" ? "ascending" : "descending",
      duration: "unsorted",
    });
  }

  render() {
    const filteredEntries = this.getFilteredEntries(this.props.timerEntries);

    const weekTotal = this.getWeeklyTotal(this.props.timerEntries);
    const dailyTotal = this.getDailyTotal(this.props.timerEntries);

    const timerEntries = this.getTimerEntries(filteredEntries);

    return (
      <div className="w-full min-h-full flex flex-col gap-8 pt-4">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-4">
            <span className="flex items-baseline gap-2 font-light">
              Today
              <strong className="text-lg">
                {dailyTotal.toFormat("hh:mm:ss")}
              </strong>
            </span>
            <span className="flex items-baseline gap-2 font-light">
              This Week
              <strong className="text-lg">
                {weekTotal.toFormat("hh:mm:ss")}
              </strong>
            </span>
          </div>

          <div className="flex gap-8">
            <button
              onClick={this.sortTime}
              className="flex justify-center items-center gap-2 font-light text-gray-600"
            >
              {this.state.time === "descending" ? (
                <ArrowCircleDown />
              ) : this.state.time === "ascending" ? (
                <ArrowCircleUp />
              ) : (
                <SwapVerticalCircleOutlined />
              )}
              Recent
            </button>

            <button
              onClick={this.sortDuration}
              className="flex justify-center items-center gap-2 font-light text-gray-600"
            >
              {this.state.duration === "descending" ? (
                <ArrowCircleDown />
              ) : this.state.duration === "ascending" ? (
                <ArrowCircleUp />
              ) : (
                <SwapVerticalCircleOutlined />
              )}
              Duration
            </button>

            <select
              className="font-light focus:outline-none"
              onChange={this.viewChangeHandler}
            >
              <option>Weekly</option>
              <option>Daily</option>
              <option>All</option>
            </select>
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-8">
          {timerEntries.length > 0 && timerEntries}
          {timerEntries.length === 0 && this.generateEmptyMessage()}
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    this.storeTimerEntries();
  }

  storeTimerEntries() {
    localStorage.setItem(
      "timerEntries",
      JSON.stringify(this.props.timerEntries)
    );
  }
}

const mapStateToProps = (state) => {
  return {
    timerEntries: state.timerEntryReducer.timerEntries,
  };
};

export default connect(mapStateToProps)(TimerEntries);
