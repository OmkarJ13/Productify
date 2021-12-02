import React from "react";
import "./TimerEntries.css";
import TimerEntry from "./TimerEntry";

class TimerEntries extends React.Component {
  render() {
    const { timerEntries } = this.props;
    return (
      <div className="TimerEntries">
        {timerEntries.length > 0 &&
          timerEntries.map((timerEntry) => {
            return (
              <TimerEntry
                key={timerEntry.id}
                id={timerEntry.id}
                taskName={timerEntry.taskName}
                time={timerEntry.time}
                onTimerEntryEdited={this.props.onTimerEntryEdited}
                onTimerEntryDeleted={this.props.onTimerEntryDeleted}
              />
            );
          })}
        {timerEntries.length === 0 && (
          <h2 className="TimerEntries__empty-msg">No Tasks Tracked...</h2>
        )}
      </div>
    );
  }
}

export default TimerEntries;
