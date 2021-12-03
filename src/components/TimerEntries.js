import React from "react";
import "./TimerEntries.css";
import TimerEntry from "./TimerEntry";

import { calculateDaysPassed, addTime } from "../helpers/timerHelpers";

class TimerEntries extends React.Component {
  calculateTotal(timerEntries) {
    return timerEntries.reduce(
      (total, timerEntry) => {
        return addTime(total, timerEntry.time);
      },
      { hours: 0, minutes: 0, seconds: 0 }
    );
  }

  render() {
    const { timerEntries } = this.props;
    const filteredTimerEntries = timerEntries.filter((timerEntry) => {
      return calculateDaysPassed(timerEntry.date) < 7;
    });
    const weekTotal = this.calculateTotal(filteredTimerEntries);

    return (
      <div className="TimerEntries">
        <div className="TimerEntries__stats">
          <h2>This week</h2>
          <h2>
            Week Total: {weekTotal.hours}:{weekTotal.minutes}:
            {weekTotal.seconds}
          </h2>
        </div>
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
