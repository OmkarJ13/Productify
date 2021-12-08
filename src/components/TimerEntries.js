import React from "react";
import { v4 as uuid } from "uuid";

import "./TimerEntries.css";
import TimerEntry from "./TimerEntry";

import { calculateDaysPassed, days } from "../helpers/timerHelpers";
import Time from "../classes/Time";

class TimerEntries extends React.Component {
  /*
  Returns total duration of timer entries tracked by the user for this week
  */
  getWeeklyTotal(timerEntries) {
    // Filtered by latest week
    const filteredEntries = timerEntries.filter((timerEntry) => {
      const daysPassed = calculateDaysPassed(timerEntry.date);
      return daysPassed < 7 && daysPassed > -1;
    });

    const durations = filteredEntries.map((timerEntry) => timerEntry.duration);
    return Time.addTime(...durations);
  }

  /*
  Groups timer entries by provided keys,
  for example, given array of timer entry objects and key as 'task',
  will return a new array with arrays of timer entries with the same 'task' value.
  keys is an array. 
  */
  groupTimerEntriesBy(timerEntries, keys) {
    const groupedEntries = [];

    // For each timer entry, checks with every other entry and checks if it has the
    // same value for 'key' provided in parameter. If so, groups them in an array.
    timerEntries.forEach((timerEntry, _, self) => {
      const matches = self.filter((ele) => {
        return keys.every((key) => {
          return timerEntry[key] === ele[key];
        });
      });

      // Used stringify to find duplicate objects.
      const includes = groupedEntries.some(
        (ele) => JSON.stringify(ele) === JSON.stringify(matches)
      );

      if (!includes) groupedEntries.push(matches);
    });

    return groupedEntries;
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
      allEntries: this.generateTimerEntries(timerEntries),
    };

    return combinedTimerEntry;
  }

  /*
  From all the timer entries that exist, 
  returns only those which are relevant to the user in a processed way.
  */
  getTimerEntries(timerEntries) {
    // Filtered to show only entries that are recorded in this week
    const filteredEntries = timerEntries.filter((timerEntry) => {
      const daysPassed = calculateDaysPassed(timerEntry.date);
      return daysPassed < 7 && daysPassed > -1;
    });

    // Grouped by dates
    const groupedByDate = this.groupTimerEntriesBy(filteredEntries, ["date"]);

    // Sorted to show latest entry first
    const sortedByDate = groupedByDate.sort(
      (a, b) => calculateDaysPassed(a[0].date) - calculateDaysPassed(b[0].date)
    );

    // Grouped by task name if has similar task names for each day
    const groupedByDateAndTask = sortedByDate.map((groupedEntries) =>
      this.groupTimerEntriesBy(groupedEntries, ["task"])
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
      const daysSince = calculateDaysPassed(timerEntriesGrouped[0].date);
      const day =
        daysSince < 7 && daysSince > -1
          ? days[daysSince]
          : timerEntriesGrouped[0].date;

      return (
        <div className="TimerEntries-grouped">
          <h4 className="TimerEntries-grouped__day">{day}</h4>
          <div className="TimerEntries-grouped__entries">
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
          allEntries={timerEntry.allEntries}
          onTimerEntryEdited={this.props.onTimerEntryEdited}
          onTimerEntryDeleted={this.props.onTimerEntryDeleted}
          onTimerEntryDuplicated={this.props.onTimerEntryDuplicated}
        />
      );
    });
  }

  generateEmptyMessage() {
    return (
      <h3 className="TimerEntries__empty-msg">No Tasks Tracked This Week...</h3>
    );
  }

  render() {
    const weekTotal = this.getWeeklyTotal(this.props.timerEntries);
    const timerEntries = this.getTimerEntries(this.props.timerEntries);

    return (
      <div className="TimerEntries">
        <div className="TimerEntries__stats">
          <h2>This week</h2>
          <h2>Week Total - {weekTotal.getTimeString()}</h2>
        </div>
        {timerEntries.length > 0 && timerEntries}
        {timerEntries.length === 0 && this.generateEmptyMessage()}
      </div>
    );
  }
}

export default TimerEntries;
