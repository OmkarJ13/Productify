import React from "react";
import { v4 as uuid } from "uuid";

import TimerEntry from "./TimerEntry";

import { getDaysPassed } from "../../helpers/getDaysPassed";
import { groupTimerEntriesBy } from "../../helpers/groupTimerEntriesBy";
import { days } from "../../helpers/days";
import Time from "../../classes/Time";

class TimerEntries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "weekly",
    };

    this.viewChangeHandler = this.viewChangeHandler.bind(this);
  }

  viewChangeHandler(e) {
    const view = e.target.value.toLowerCase();
    this.setState({
      view: view,
    });
  }

  /*
  Returns total duration of timer entries tracked by the user for this week
  */
  getWeeklyTotal(timerEntries) {
    const filteredEntries = this.getWeeklyEntries(timerEntries);
    const durations = filteredEntries.map((timerEntry) => timerEntry.duration);
    return Time.addTime(...durations);
  }

  /*
  Returns total duration of timer entries tracked by the user for today
  */
  getDailyTotal(timerEntries) {
    const filteredEntries = this.getDailyEntries(timerEntries);
    const durations = filteredEntries.map((timerEntry) => timerEntry.duration);
    return Time.addTime(...durations);
  }

  /*
  Combines timer entries with the same task name and date
  */
  getCombinedTimerEntry(timerEntries) {
    // Get all the start times
    const allStartTimes = timerEntries.map(
      (timerEntry) => timerEntry.startTime
    );

    // Get all the end times
    const allEndTimes = timerEntries.map((timerEntry) => timerEntry.endTime);

    // Get all the durations
    const allDurations = timerEntries.map((timerEntry) => timerEntry.duration);

    // Find earliest start time and set it as this entry's start time,
    // find latest end time and set it as this entry's end time.
    // Add all the durations for the duration for this entry
    // Set allEntries property and generate JSX for it so if the user clicks on this entry, all entries can be shown.
    const combinedTimerEntry = {
      id: uuid(),
      task: timerEntries[0].task,
      date: timerEntries[0].date,
      duration: Time.addTime(...allDurations),
      startTime: Time.getMin(...allStartTimes),
      endTime: Time.getMax(...allEndTimes),
      isProductive: timerEntries[0].isProductive,
      allEntries: this.generateTimerEntries(timerEntries),
    };

    return combinedTimerEntry;
  }

  /*
  From all the timer entries that exist, 
  returns only those which are relevant to the user in a processed way.
  */
  getTimerEntries(timerEntries) {
    // Grouped by dates
    const groupedByDate = groupTimerEntriesBy(timerEntries, ["date"]);

    // Sorted to show latest entry first
    const sortedByDate = groupedByDate.sort(
      (a, b) => getDaysPassed(a[0].date) - getDaysPassed(b[0].date)
    );

    // Grouped by task name if has similar task names for each day
    const groupedByDateAndTask = sortedByDate.map((groupedEntries) =>
      groupTimerEntriesBy(groupedEntries, ["task"])
    );

    // Combined duplicate entries to show one instead of multiple
    const finalTimerEntries = groupedByDateAndTask.map((groupedByDate) => {
      return groupedByDate.map((groupedByTask) => {
        if (groupedByTask.length === 1) {
          return groupedByTask[0];
        } else {
          return this.getCombinedTimerEntry(groupedByTask);
        }
      });
    });

    // Finally, generate JSX
    const JSX = finalTimerEntries.map((timerEntriesGrouped) => {
      const daysSince = getDaysPassed(timerEntriesGrouped[0].date);
      const day =
        daysSince < 7 && daysSince > -1
          ? days[daysSince]
          : timerEntriesGrouped[0].date;

      const thisDayTotal = Time.addTime(
        ...timerEntriesGrouped.map((timerEntry) => timerEntry.duration)
      );

      return (
        <div className="w-full flex flex-col">
          <div className="w-full flex justify-between px-4 py-2 bg-blue-500 text-white uppercase text-lg">
            <h4>{day}</h4>
            <h4>{thisDayTotal.toTimeString()}</h4>
          </div>

          <div className="w-full flex flex-col">
            {this.generateTimerEntries(timerEntriesGrouped)}
          </div>
        </div>
      );
    });

    return JSX;
  }

  /*
  Generates TimerEntry components from array of timer entries
  */
  generateTimerEntries(timerEntries) {
    return timerEntries.map((timerEntry) => {
      return (
        <TimerEntry
          key={timerEntry.id}
          id={timerEntry.id}
          task={timerEntry.task}
          duration={timerEntry.duration}
          date={timerEntry.date}
          startTime={timerEntry.startTime}
          endTime={timerEntry.endTime}
          isProductive={timerEntry.isProductive}
          allEntries={timerEntry.allEntries}
          onTimerEntryEdited={this.props.onTimerEntryEdited}
          onTimerEntryDeleted={this.props.onTimerEntryDeleted}
          onTimerEntryDuplicated={this.props.onTimerEntryDuplicated}
          onTimerEntryContinued={this.props.onTimerEntryContinued}
        />
      );
    });
  }

  generateEmptyMessage() {
    return <h3 className="m-auto text-2xl font-light">No Time Tracked...</h3>;
  }

  getWeeklyEntries(timerEntries) {
    return timerEntries.filter((timerEntry) => {
      const daysPassed = getDaysPassed(timerEntry.date);
      return daysPassed < 7 && daysPassed > -1;
    });
  }

  getDailyEntries(timerEntries) {
    return timerEntries.filter((timerEntry) => {
      const daysPassed = getDaysPassed(timerEntry.date);
      return daysPassed === 0;
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
    }
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
            <span className="flex gap-2 font-light">
              Today
              <strong className="font-bold">{dailyTotal.toTimeString()}</strong>
            </span>
            <span className="flex gap-2 font-light">
              This Week
              <strong className="font-bold">{weekTotal.toTimeString()}</strong>
            </span>
          </div>
          <select
            className="font-light focus:outline-none"
            onChange={this.viewChangeHandler}
          >
            <option>Weekly</option>
            <option>Daily</option>
            <option>All</option>
          </select>
        </div>
        <div className="w-full h-full flex flex-col gap-8">
          {timerEntries.length > 0 && timerEntries}
          {timerEntries.length === 0 && this.generateEmptyMessage()}
        </div>
      </div>
    );
  }
}

export default TimerEntries;
