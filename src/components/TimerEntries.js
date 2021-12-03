import React from "react";
import "./TimerEntries.css";
import TimerEntry from "./TimerEntry";

import { calculateDaysPassed } from "../helpers/timerHelpers";

class TimerEntries extends React.Component {
  render() {
    const { timerEntries } = this.props;
    const filteredTimerEntries = timerEntries.filter((timerEntry) => {
      return calculateDaysPassed(timerEntry.date) < 7;
    });

    return (
      <div className="TimerEntries">
        {filteredTimerEntries.length > 0 &&
          filteredTimerEntries
            .sort(
              (a, b) =>
                calculateDaysPassed(a.date) - calculateDaysPassed(b.date)
            )
            .map((timerEntry) => {
              return (
                <TimerEntry
                  key={timerEntry.id}
                  id={timerEntry.id}
                  taskName={timerEntry.taskName}
                  time={timerEntry.time}
                  date={timerEntry.date}
                  onTimerEntryEdited={this.props.onTimerEntryEdited}
                  onTimerEntryDeleted={this.props.onTimerEntryDeleted}
                />
              );
            })}
        {filteredTimerEntries.length === 0 && (
          <h2 className="TimerEntries__empty-msg">No Tasks Tracked...</h2>
        )}
      </div>
    );
  }
}

export default TimerEntries;
