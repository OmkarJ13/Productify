import React from "react";
import "./TimerEntries.css";
import TimerEntry from "./TimerEntry";

import { calculateDaysPassed } from "../helpers/timerHelpers";
import Time from "../classes/Time";

class TimerEntries extends React.Component {
  calculateTotal(timerEntries) {
    return timerEntries.reduce((total, timerEntry) => {
      return total.addTime(timerEntry.duration);
    }, new Time());
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
          <h2>Week Total - {weekTotal.getTimeString()}</h2>
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
                  task={timerEntry.task}
                  duration={timerEntry.duration}
                  date={timerEntry.date}
                  startTime={timerEntry.startTime}
                  endTime={timerEntry.endTime}
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
